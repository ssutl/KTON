import styles from "../../../../src/styles/Pages/ImgDisplay.module.scss";
import TextareaAutosize from "react-textarea-autosize";
import React, { useState, useEffect, useContext, useRef, useMemo } from "react";
import htmlToImage from "html-to-image";
import download from "downloadjs";
import { toPng, toJpeg } from "html-to-image";
import { set } from "lodash";

function ImgDisplay({ currentHighlight }: { currentHighlight: string }) {
  console.log("currentHighlight", currentHighlight);
  const [Quote, setQuote] = useState(currentHighlight);
  const randomImg = "https://assets.imgix.net/unsplash/motorbike.jpg";

  //Add local image
  const handleUpload = (event: any) => {
    console.log("sumn");
    event.preventDefault();
    const { files } = event.target;
    const uploadFile = URL.createObjectURL(files[0]);
  };

  //Download PNG image
  const handlePng = () => {
    const imageToDownload = document.getElementById("my-img");
    if (imageToDownload === null) return;

    toPng(imageToDownload).then(function (dataUrl) {
      download(dataUrl, "text-img.png");
    });
  };

  // Download JPEG image
  const handleJpeg = () => {
    const imageToDownload = document.getElementById("my-img");
    if (imageToDownload === null) return;
    toJpeg(imageToDownload, { quality: 0.95 }).then(function (dataUrl) {
      var link = document.createElement("a");
      link.download = "text-img.jpeg";
      link.href = dataUrl;
      link.click();
    });
  };

  return (
    // main div
    <div className={styles.ImgDisplayPage}>
      <div className={styles.imgContainer} id="my-img">
        <img src={randomImg} alt="" width="100%" />
        <h2>{Quote}</h2>
      </div>
      <div className={styles.formContainer}>
        <form>
          <div className={styles.formCard}>
            <p className={styles.title}>Add image</p>
            <input
              onChange={(event) => handleUpload(event)}
              type="file"
              id="inputGroupFile04"
              className={styles.hideInput}
              aria-describedby="inputGroupFileAddon04"
              accept="image/x-png,image/gif,image/jpeg"
            />
            <label htmlFor="inputGroupFile04" className={styles.fileInput}>
              <div className={styles.chooseFileBtn}>
                <p>Choose local image</p>
              </div>
              <div className={styles.browseBtn}>
                <p>Browse</p>
              </div>
            </label>
          </div>
          <div className={styles.formCard}>
            <p className={styles.title}>Add details</p>
            <TextareaAutosize
              className={styles.textInput}
              value={Quote}
              onChange={(event) => {
                setQuote(event.target.value);
                console.log("event.target.value", event.target.value);
              }}
              placeholder="Quote"
            />
          </div>
          <div className={styles.formCard}>
            <button
              type="button"
              onClick={() => handlePng()}
              className={styles.button}
            >
              Download PNG
            </button>
            <button
              type="button"
              onClick={() => handleJpeg()}
              className={styles.button}
            >
              Download JPEG
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default React.memo(ImgDisplay);
