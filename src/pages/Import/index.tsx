import ImportComponent from "@/components/Import/ImportComponent";
import styles from "../../styles/Pages/ImportPage.module.scss";
import React, { useContext, useEffect } from "react";

const ImportPage = () => {
  return (
    <>
      <Head>
        <title>KTON Home</title>
      </Head>
      <div className={styles.ImportPage}>
        <ImportComponent />
      </div>
    </>
  );
};

export default ImportPage;
