import ImportComponent from "@/components/ImportComponent";
import styles from "../../styles/ImportPage.module.scss";
import React, { useContext, useEffect } from "react";

const ImportPage = () => {
  return (
    <div className={styles.ImportPage}>
      <ImportComponent />
    </div>
  );
};

export default ImportPage;
