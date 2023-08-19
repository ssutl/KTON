import ImportComponent from "@/components/Import/ImportComponent";
import styles from "../../styles/Pages/ImportPage.module.scss";
import React, { useContext, useEffect } from "react";
import InitApi from "../../api/InitAPI";
import Head from "next/head";
import AllowedRoute from "@/helpers/AllowedRoute";
import { KTON_CONTEXT } from "../../context/KTONContext";

const ImportPage = () => {
  const { books } = useContext(KTON_CONTEXT);
  const { InitialiseApp } = InitApi();

  useEffect(() => {
    //check if this is an allowed route
    AllowedRoute();

    //If the user is logged in but the book data is empty then we gotta refresh context, this way we can keep initial load fast by not loading books off of navigation
    if (!books) {
      InitialiseApp();
    }
  }, []);

  return (
    <>
      <Head>
        <title>KTON Import</title>
      </Head>
      <div className={styles.ImportPage}>
        <ImportComponent />
      </div>
    </>
  );
};

export default ImportPage;
