import React, { useEffect, useState, useContext } from "react";
import styles from "../styles/QuoteBanner.module.scss";
import userAuthenticated from "@/helpers/UserAuthenticated";
import { KTON_CONTEXT } from "../context/KTONContext";
import { Meta_con_highlight } from "@/api/Interface";
import clippings_AllHighlights from "@/helpers/Clippings_AllHighlights";
import cleanAuthor from "@/helpers/cleanAuthor";
import { useRouter } from "next/router";

const QuoteBanner = () => {
  const { highlights } = useContext(KTON_CONTEXT);
  //This is the main collection we are reading from, either authed user info or unauthed will go here
  const [randomHighlight, setRandomHighlight] = useState<Meta_con_highlight>();
  const router = useRouter();

  //On page load, we'll set the restrictions and decide where to get highlights from
  useEffect(() => {
    //Setting restrictions
    let clippings = sessionStorage.getItem("clippings");

    if (userAuthenticated() && highlights) {
      //Setting the main collection
      setRandomHighlight(
        highlights[Math.floor(Math.random() * highlights.length)]
      );
    } else if (clippings) {
      let allHighlights = clippings_AllHighlights(clippings);

      if (allHighlights)
        setRandomHighlight(
          allHighlights[Math.floor(Math.random() * allHighlights.length)]
        );
    }
  }, []);

  const redirect = () => {
    router.push({
      pathname: `/Book/${randomHighlight?.book_id}`,
      query: { highlight_text: randomHighlight?.highlight.Text },
    });
  };

  //Reading from the main collection (source of truth), if it aint there show loading
  if (randomHighlight) {
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
  } else return <div className={styles.loading}></div>;
};

export default QuoteBanner;
