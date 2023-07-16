import styles from "../styles/ImportComponent.module.scss";
import ImportButton from "./ImportButton";

const ImportComponent = () => {
  return (
    <div className={styles.importSect}>
      <div className={styles.importInfoSect}>
        <h2>IMPORT YOUR CLIPPINGS</h2>
        <p>Locate &#34;Clippings.txt&#34;</p>
      </div>
      <ImportButton />
      {/* <div className={styles.importProgressSect}>
        <p>
          <span>Current Book </span>
          <span>N/A</span>
        </p>
        <p>
          <span>Progress </span>
          <span>N/A</span>
        </p>
        <p>
          <span>Estimated Time </span>
          <span>N/A</span>
        </p>
      </div> */}
    </div>
  );
};

export default ImportComponent;
