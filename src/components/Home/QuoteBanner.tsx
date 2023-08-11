import React, { useEffect, useState, useContext } from "react";
import styles from "../../styles/Components/QuoteBanner.module.scss";
import { KTON_CONTEXT } from "../../context/KTONContext";
import { Meta_con_highlight } from "@/api/Interface";
import cleanAuthor from "@/helpers/cleanAuthor";
import { useRouter } from "next/router";

const QuoteBanner = () => {
  const { highlights } = useContext(KTON_CONTEXT);
  const router = useRouter();
  const [randomHighlight, setRandomHighlight] = useState<Meta_con_highlight>();

  const redirect = () => {
    router.push({
      pathname: `/Book/${randomHighlight?.book_id}`,
      query: { highlight_text: randomHighlight?.highlight.Text },
    });
  };

  //When the component mounts, we want to set a random highlight
  useEffect(() => {
    if (!highlights) return;

    setRandomHighlight(
      highlights[Math.floor(Math.random() * highlights.length)]
    );

    const interval = setInterval(() => {
      setRandomHighlight(
        highlights[Math.floor(Math.random() * highlights.length)]
      );
      //secures a random quote every 60 seconds
    }, 60000); // runs every 60 seconds

    return () => {
      clearInterval(interval);
    };
  }, [highlights]);

  //Reading from the main collection (source of truth), if it aint there show loading
  if (!randomHighlight) return <div className={styles.loading}></div>;

  const text = randomHighlight.highlight.Text;
  const author = randomHighlight.author;
  const title = randomHighlight.title;

  return (
    <div className={styles.QuoteBanner}>
      <div className={styles.QuoteBannerWidth}>
        <div className={styles.highlightSection}>
          <h1 className={styles.highlight} onClick={() => redirect()}>
            {text}
          </h1>
        </div>
        <div className={styles.metaDataSection}>
          <p className={styles.metaData}>
            {cleanAuthor(author)} - {title}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuoteBanner;
