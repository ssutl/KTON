import styles from "../styles/ImportComponent.module.scss";
import React, { useState } from "react";
import ImportButton from "./ImportButton";
import { useRouter } from "next/router";

const ImportComponent = () => {
  const [progress, setProgress] = useState<"Started" | "None" | "Complete">(
    "None"
  );
  const [percentage, setPercentage] = useState<number>(5);
  const router = useRouter();
  const isIndexRoute = router.pathname === "/";

  const updatePercentage = (value: number) => {
    //In order to prevent the progress bar from going backwards, because of the way the socket works
    if (percentage < value) {
      setPercentage(value);
    }
  };

  return (
    <div className={styles.importSect}>
      <div className={styles.importInfoSect}>
        <h2>
          {isIndexRoute
            ? `Demo KTON, no login required!`
            : progress === "None"
            ? `Import your clippings`
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
        setPercentage={updatePercentage}
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
