import React from "react";
import styles from "../../../../src/styles/Pages/ImgDisplay.module.scss";

function ImgDisplay(props) {
  return (
    // main div
    <div className={styles.ImgDisplayPage}>
      <div className={styles.imgContainer} id="my-img">
        <img src={props.data.randomImg} alt="" width="100%" />
        <h2>{props.data.topText}</h2>
      </div>
      <div className={styles.formContainer}>
        <form>
          <div className={styles.formCard}>
            <p>Add image</p>
            <input
              onChange={props.handleUpload}
              type="file"
              id="inputGroupFile04"
              className={styles.hideInput}
              aria-describedby="inputGroupFileAddon04"
              accept="image/x-png,image/gif,image/jpeg"
            />
            <label for="inputGroupFile04" className={styles.fileInput}>
              <div className={styles.chooseFileBtn}>Choose local image</div>
              <div className={styles.browseBtn}>Browse</div>
            </label>
          </div>
          <div className={styles.formCard}>
            <p>Add details</p>
            <input
              type="text"
              name="topText"
              placeholder="Top phrase"
              value={props.data.topText}
              onChange={props.handleChange}
            />
          </div>
          <div className={styles.formCard}>
            <button type="button" onClick={props.handlePng}>
              Download PNG
            </button>
            <button type="button" onClick={props.handleJpeg}>
              Download JPEG
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ImgDisplay;
