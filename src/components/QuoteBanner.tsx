import React, { useEffect, useState, useContext } from "react";
import styles from "../styles/QuoteBanner.module.scss";
import { KTON_CONTEXT } from "../context/KTONContext";
import { Meta_con_highlight } from "@/api/Interface";
import cleanAuthor from "@/helpers/cleanAuthor";
import { useRouter } from "next/router";

const QuoteBanner = () => {
  const { highlights } = useContext(KTON_CONTEXT);
  const router = useRouter();

  const redirect = () => {
    router.push({
      pathname: `/Book/${randomHighlight?.book_id}`,
      query: { highlight_text: randomHighlight?.highlight.Text },
    });
  };

  //Reading from the main collection (source of truth), if it aint there show loading
  if (!highlights) return <div className={styles.loading}></div>;

  const randomHighlight =
    highlights[Math.floor(Math.random() * highlights.length)];

  const text = randomHighlight.highlight.Text;
  const author = randomHighlight.author;
  const title = randomHighlight.title;

  return (
    <div className={styles.QuoteBanner}>
      <div className={styles.QuoteBannerWidth}>
        <h1 className={styles.highlight} onClick={() => redirect()}>
          {text}
        </h1>
        <p className={styles.metaData1}>
          {cleanAuthor(author)} - {title}
        </p>
      </div>
    </div>
  );
};

export default QuoteBanner;
