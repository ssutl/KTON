import React, { useEffect, useState, useContext } from "react";
import styles from "../styles/QuoteBanner.module.scss";
import userAuthenticated from "@/helpers/UserAuthenticated";
import { KTON_CONTEXT } from "../context/KTONContext";
import { dbBook, singleHighlight } from "@/api/Interface";

//interface QuoteBannerProps {}

const QuoteBanner = ({ ...props }) => {
  const { highlights } = useContext(KTON_CONTEXT);
  console.log("never ", highlights);
  const [restrictions, setRestrictions] = useState<boolean>(true);
  const [randomHighlight, setRandomHighlight] = useState<
    singleHighlight | undefined
  >();

  useEffect(() => {
    setRestrictions(userAuthenticated());
  }, []);

  return (
    <div className={styles.QuoteBanner}>
      <h1>Quote</h1>
    </div>
  );
};

export default QuoteBanner;
