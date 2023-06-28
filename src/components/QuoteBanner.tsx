import React, { useEffect, useState, useContext } from "react";
import styles from "../styles/QuoteBanner.module.scss";
import userAuthenticated from "@/helpers/UserAuthenticated";
import { KTON_CONTEXT } from "../context/KTONContext";
import { AllHighlights, Book, highlight } from "@/api/Interface";

//interface QuoteBannerProps {}

const QuoteBanner = ({ ...props }) => {
  const { highlights } = useContext(KTON_CONTEXT);
  const [restrictions, setRestrictions] = useState<boolean>(true);

  const [randomCollection, setRandomCollection] = useState<
    | {
        highlight: string;
        author: string;
        title: string;
      }
    | undefined
  >();

  const randomHighlightGenerator = (allBooks: Book[]) => {
    const randomBookNumber = Math.round(Math.random() * (allBooks.length - 1));
    const randomBook = allBooks[randomBookNumber];
    const randomHighlightNumber = Math.round(
      Math.random() * (randomBook.highlights.length - 1)
    );
    const randomHighlight = randomBook.highlights[randomHighlightNumber];

    setRandomCollection({
      highlight: randomHighlight.Text,
      author: randomBook.author,
      title: randomBook.title,
    });
  };

  useEffect(() => {
    setRestrictions(!userAuthenticated());

    if (userAuthenticated()) {
    } else {
      //For non logged in users we will use their clippings in local storage to display random quote
      const clippings = localStorage.getItem("clippings");
      if (clippings) {
        const parsedClippings = JSON.parse(clippings);
        randomHighlightGenerator(parsedClippings);

        const interval = setInterval(() => {
          randomHighlightGenerator(parsedClippings);
        }, 10000);

        return () => {
          clearInterval(interval);
        };
      }
    }
  }, []);

  return (
    <div className={styles.QuoteBanner}>
      <div className={styles.QuoteBannerWidth}>
        {restrictions ? (
          <p className={styles.highlight}>{randomCollection?.highlight}</p>
        ) : null}
        {restrictions ? (
          <p className={styles.metaData}>
            {randomCollection?.author} - {randomCollection?.title}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default QuoteBanner;
