import React, { useState, useEffect } from "react";
import styles from "../styles/ImportButton.module.scss";
import clippingsParser from "@/helpers/UploadedTXTHelper";
import uploadedTxtHelper from "@/helpers/clippingsParse";

//interface ImportButtonProps {}

const ImportButton = () => {
  const [incomingFile, setIncomingFile] = useState<File | null>(null);

  const uploadFile = () => {
    var file = incomingFile;
    var textType = /text.*/;

    if (file && file.type.match(textType)) {
      var reader = new FileReader();

      reader.onload = function (e) {
        var content = reader.result;
        //Here the content has been read successfuly
        if (content !== null && typeof content === "string")
          uploadedTxtHelper(content);
        alert(content);
      };

      reader.readAsText(file);
    }
  };

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
              event.target.files[0].name === "My Clippings.txt"
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
