import styles from "../styles/ImportComponent.module.scss";
import React, { useState, useEffect } from "react";
import ImportButton from "./ImportButton";

const ImportComponent = () => {
  const [progress, setProgress] = useState<"Started" | "None" | "Complete">(
    "None"
  );
  const [percentage, setPercentage] = useState<number>(0);

  return (
    <div className={styles.importSect}>
      <div className={styles.importInfoSect}>
        <h2>
          {progress === "None"
            ? `IMPORT YOUR CLIPPINGS`
            : progress === "Started"
            ? `Importing Clippings`
            : `Upload Complete!`}
        </h2>
        <p>
          {progress === "None"
            ? `Locate "Clippings.txt"`
            : progress === "Started"
            ? `Uploading.... ${percentage}%`
            : `Happy reading!`}
        </p>
      </div>
      <ImportButton
        setProgress={setProgress}
        setPercentage={setPercentage}
        progress={progress}
      />
      {progress === "Started" ? (
        <div className={styles.progressSect}>
          <div className={styles.progress_bar}>
            <div
              className={styles.progress_bar_fill}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ImportComponent;
