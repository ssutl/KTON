import React, { useState, useEffect } from "react";
import styles from "../styles/ImportButton.module.scss";
import uploadedTxtHelper from "@/helpers/clippingsParse";
import Router from "next/router";
import userAuthenticated from "@/helpers/UserAuthenticated";
import { io } from "socket.io-client";
import ImportBooksApi from "@/api/Users/ImportBooks";

const ImportButton = () => {
  const [incomingFile, setIncomingFile] = useState<File | null>(null);
  const [LocalUploadStatus, setLocalUploadStatus] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<number>(0);
  const [progress, setProgress] = useState<"Started" | "None" | "Complete">(
    "None"
  );

  //Function to handle the upload of the file
  const uploadFile = async () => {
    var file = incomingFile;
    var textType = /text.*/;

    if (userAuthenticated() && file) {
      //This is the upload process for the user's library, so we can parse server side
      const formData = new FormData(); // needed for uploading a file
      formData.append("clippingsFile", file); // adds the uploaded file under the name "clippingsFile" to the formData variable
      setProgress("Started");
      const status = await ImportBooksApi({ formData });
      setProgress(status);
    } else {
      //This upload process is for the landing page, therefore user isn't logged in and we can parse client side
      if (file && file.type.match(textType)) {
        var reader = new FileReader();

        reader.onload = async function (e) {
          var content = reader.result;
          let success_upload: boolean = false;
          //Here the content has been read successfuly
          if (content !== null && typeof content === "string") {
            success_upload = await uploadedTxtHelper(content);
            setLocalUploadStatus(success_upload);
          }
        };

        reader.readAsText(file);
      } else {
        alert("File type does not match");
      }
    }
  };

  const socket = io(`${process.env.NEXT_PUBLIC_BACKENDURL}`);

  //Connecting to the sockets to see the progress of the upload
  useEffect(() => {
    if (userAuthenticated() && progress === "Started") {
      socket.on("connect", () => {
        socket.on("upload-progress", (data) => {
          setPercentage(Number(data));
        });
      });
    }

    return () => {
      socket.off("connect");
      socket.off("upload-progress");
      socket.disconnect();
    };
  }, [progress, socket]);

  //UseEffect to see what the progress is
  useEffect(() => {
    if (progress === "Complete") {
      setTimeout(() => {
        //After two seconds of completed being shown pass user to home page
        Router.push("Home");
        setPercentage(0);
      }, 2000);
    }
  }, [progress]);

  //UseEffect to see what the local storage state is after upload
  useEffect(() => {
    const clippings = localStorage.getItem("clippings");

    //If the local storage has clippings we can send unauthed user to home page
    if (clippings && LocalUploadStatus) {
      Router.push("Home");
    }
  }, [LocalUploadStatus]);

  return (
    <div className={styles.buttonContainer}>
      <input
        type="file"
        id="input"
        className={styles.input}
        onChange={(event) => {
          if (event.target.files !== null) {
            if (
              event.target.files[0].type === "text/plain" &&
              (event.target.files[0].name === "My Clippings.txt" ||
                event.target.files[0].name === "clippings.txt")
            ) {
              setIncomingFile(event.target.files[0]);
            } else {
              alert(`Only 'My Clippings' files can be uploaded`);
            }
          }
        }}
      ></input>
      <label className={styles.button} htmlFor="input">
        {incomingFile ? <p>{incomingFile.name}</p> : <p>+ Import to KTON</p>}
      </label>
      {incomingFile ? (
        <div className={styles.button} onClick={() => uploadFile()}>
          <p>Upload</p>
        </div>
      ) : null}
      {progress === "Started" ? <p>{percentage}</p> : null}
    </div>
  );
};

export default ImportButton;
