import React, { useEffect, useState, useContext } from "react";
import styles from "../styles/QuoteBanner.module.scss";
import userAuthenticated from "@/helpers/UserAuthenticated";
import { KTON_CONTEXT } from "../context/KTONContext";
import { Book } from "@/api/Interface";

//interface QuoteBannerProps {}

const QuoteBanner = () => {
  const { books } = useContext(KTON_CONTEXT);
  const [restrictions, setRestrictions] = useState(true);

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
    //Setting restrictions
    setRestrictions(!userAuthenticated());

    if (userAuthenticated()) {
      //For logged in users we will use their clippings which are stored in the user context

      if (books) {
        randomHighlightGenerator(books);

        const interval = setInterval(() => {
          randomHighlightGenerator(books);
        }, 20000);

        return () => {
          clearInterval(interval);
        };
      }
    } else {
      //For non logged in users we will use their clippings in local storage to display random quote
      const clippings = localStorage.getItem("clippings");
      if (clippings) {
        const parsedClippings: Book[] = JSON.parse(clippings);
        randomHighlightGenerator(parsedClippings);

        const interval = setInterval(() => {
          randomHighlightGenerator(parsedClippings);
        }, 20000);

        return () => {
          clearInterval(interval);
        };
      }
    }
  }, []);

  if (randomCollection) {
    return (
      <div className={styles.QuoteBanner}>
        <div className={styles.QuoteBannerWidth}>
          <h1 className={styles.highlight}>{randomCollection?.highlight}</h1>
          {restrictions ? null : (
            <p className={styles.metaData1}>
              <span>Star</span> - <span>Delete</span>{" "}
            </p>
          )}

          <p className={styles.metaData2}>
            {randomCollection?.author} - {randomCollection?.title}
          </p>
        </div>
      </div>
    );
  } else return <h1>Component Loading </h1>;
};

export default QuoteBanner;
