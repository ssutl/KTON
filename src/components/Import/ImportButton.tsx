import React, { useState, useEffect } from "react";
import styles from "../../styles/Components/ImportButton.module.scss";
import ImportBooksApi from "@/api/Users/ImportBooks";
import { useAlert } from "react-alert";

interface ImportButtonProps {
  setProgress?: React.Dispatch<
    React.SetStateAction<"Started" | "None" | "Complete">
  >;
  setPercentage?: (value: number) => void;
  progress?: "Started" | "None" | "Complete";
}

const ImportButton = ({ setProgress, progress }: ImportButtonProps) => {
  const [incomingFile, setIncomingFile] = useState<File | null>(null);
  const alert = useAlert();

  //Function to handle the upload of the file
  const uploadFile = async () => {
    var file = incomingFile;
    var textType = /text.*/;

    if (file && setProgress) {
      //This is the upload process for the user's library, so we can parse server side
      const formData = new FormData(); // needed for uploading a file
      formData.append("clippingsFile", file); // adds the uploaded file under the name "clippingsFile" to the formData variable
      setProgress("Started");
      const status = await ImportBooksApi({ formData });
      setProgress(status);
    }
  };

  return (
    <div className={styles.buttonContainer}>
      <input
        type="file"
        id="input"
        className={styles.input}
        disabled={progress === "Started" ? true : false}
        onChange={(event) => {
          if (event.target.files !== null) {
            if (
              event.target.files[0].type === "text/plain" &&
              (event.target.files[0].name === "My Clippings.txt" ||
                event.target.files[0].name === "clippings.txt")
            ) {
              setIncomingFile(event.target.files[0]);
            } else {
              alert.show("Only 'My Clippings' files can be uploaded", {
                type: "error",
                position: "top right",
              });
            }
          }
        }}
      ></input>
      <label
        className={`${styles.button} ${
          progress === "Started" ? styles.active : null
        }`}
        htmlFor="input"
      >
        {incomingFile ? <p>{incomingFile.name}</p> : <p>+ Import to KTON</p>}
      </label>
      {incomingFile ? (
        <div
          className={`${styles.button} ${
            progress === "Started" ? styles.active : null
          }`}
          onClick={() => (progress === "Started" ? null : uploadFile())}
        >
          <p>Upload</p>
        </div>
      ) : null}
    </div>
  );
};

export default ImportButton;
