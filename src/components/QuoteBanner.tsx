import React from "react";
import styles from "../styles/QuoteBanner.module.scss";

//interface QuoteBannerProps {}

const QuoteBanner = ({ ...props }) => {
  console.log(props);
  return (
    <div className={styles.QuoteBanner}>
      <h1>QuoteBanner</h1>
    </div>
  );
};

export default QuoteBanner;
