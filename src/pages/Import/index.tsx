import ImportComponent from "@/components/ImportComponent";
import styles from "../../styles/ImportPage.module.scss";
import AllowedRoute from "@/helpers/AllowedRoute";
import React, { useEffect } from "react";

const ImportPage = () => {
  useEffect(() => {
    //check if this is an allowed route
    AllowedRoute();
  }, []);

  return (
    <div className={styles.ImportPage}>
      <ImportComponent />
    </div>
  );
};

export default ImportPage;
