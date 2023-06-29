import React, { useEffect, useState, useContext } from "react";
import styles from "../styles/QuoteBanner.module.scss";
import userAuthenticated from "@/helpers/UserAuthenticated";
import { KTON_CONTEXT } from "../context/KTONContext";
import { Book } from "@/api/Interface";

//interface QuoteBannerProps {}

const QuoteBanner = ({ ...props }) => {
  const { books } = useContext(KTON_CONTEXT);

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

  return (
    <div className={styles.QuoteBanner}>
      <div className={styles.QuoteBannerWidth}>
        <p className={styles.highlight}>{randomCollection?.highlight}</p>
        <p className={styles.metaData}>
          {randomCollection?.author} - {randomCollection?.title}
        </p>
      </div>
    </div>
  );
};

export default QuoteBanner;
