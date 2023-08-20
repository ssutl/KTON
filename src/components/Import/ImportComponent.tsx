import styles from "../../styles/Components/ImportComponent.module.scss";
import React, { useState, useEffect, useMemo } from "react";
import ImportButton from "./ImportButton";
import { useRouter } from "next/router";
import { io } from "socket.io-client";

const ImportComponent = () => {
  const [progress, setProgress] = useState<"Started" | "None" | "Complete">(
    "None"
  );
  const [percentage, setPercentage] = useState<number>(2);
  const router = useRouter();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    setUsername(localStorage.getItem("username") as string);
  }, []);

  const updatePercentage = (value: number) => {
    //In order to prevent the progress bar from going backwards, because of the way the socket works
    if (percentage < value) {
      setPercentage(value);
    }
  };

  const socket = io(`${process.env.NEXT_PUBLIC_BACKENDURL}`);

  //Connecting to the sockets to see the progress of the upload
  useEffect(() => {
    if (progress === "Started") {
      socket.on("connect", () => {
        socket.on("upload-progress", (data) => {
          updatePercentage(Number(data));
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
    if (progress === "Complete" && setPercentage) {
      setTimeout(() => {
        //After two seconds of completed being shown pass user to home page
        router.push("Home");
        setPercentage(0);
      }, 1000);
    }
  }, [progress]);

  if (!username) return null;

  return (
    <div className={styles.importSect}>
      <div className={styles.importInfoSect}>
        <p id={styles.importToText}>
          {progress === "None"
            ? `Import your clippings to`
            : progress === "Started"
            ? `Importing Clippings`
            : `Upload Complete!`}
        </p>
        <h2>{JSON.parse(username)}</h2>
        <p>
          {progress === "None"
            ? `Firstly locate "Clippings.txt"`
            : progress === "Started"
            ? `Uploading.... ${percentage}%`
            : `Happy reading!`}
        </p>
      </div>
      <ImportButton setProgress={setProgress} progress={progress} />
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
