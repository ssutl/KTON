import ImportComponent from "@/components/Import/ImportComponent";
import styles from "../../styles/Pages/ImportPage.module.scss";
import React, { useContext, useEffect } from "react";
import Head from "next/head";
import AllowedRoute from "@/helpers/AllowedRoute";

const ImportPage = () => {
  useEffect(() => {
    //check if this is an allowed route
    AllowedRoute();
  }, []);

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
