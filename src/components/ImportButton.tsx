import React, { useState, useEffect } from "react";
import styles from "../styles/ImportButton.module.scss";
import uploadedTxtHelper from "@/helpers/clippingsParse";
import Router from "next/router";

const ImportButton = () => {
  const [incomingFile, setIncomingFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<boolean>(false);

  //Function to handle the upload of the file
  const uploadFile = async () => {
    var file = incomingFile;
    var textType = /text.*/;

    //This upload process is for the landing page, therefore user isn't logged in and we can parse server side
    if (file && file.type.match(textType)) {
      var reader = new FileReader();

      reader.onload = async function (e) {
        var content = reader.result;
        let success_upload: boolean = false;
        //Here the content has been read successfuly
        if (content !== null && typeof content === "string") {
          success_upload = await uploadedTxtHelper(content);
          setUploadStatus(success_upload);
        }
      };

      reader.readAsText(file);
    } else {
      alert("File type does not match");
    }
  };

  //UseEffect to see what the local storage state is after upload
  useEffect(() => {
    const clippings = localStorage.getItem("clippings");

    //If the local storage has clippings we can send unauthed user to home page
    if (clippings && uploadStatus) {
      Router.push("Home");
    }
  }, [uploadStatus]);

  return (
    <>
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
        {incomingFile ? <p>{incomingFile.name}</p> : <p>+ Import To KTON</p>}
      </label>
      {incomingFile ? (
        <div className={styles.button} onClick={() => uploadFile()}>
          Upload
        </div>
      ) : null}
    </>
  );
};

export default ImportButton;
