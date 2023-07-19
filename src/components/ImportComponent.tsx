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
    </div>
  );
};

export default ImportComponent;
