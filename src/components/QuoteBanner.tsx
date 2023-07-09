import React, { useEffect, useState, useContext } from "react";
import styles from "../styles/QuoteBanner.module.scss";
import userAuthenticated from "@/helpers/UserAuthenticated";
import { KTON_CONTEXT } from "../context/KTONContext";
import { Book } from "@/api/Interface";

//interface QuoteBannerProps {}

const QuoteBanner = () => {
  const { books } = useContext(KTON_CONTEXT);
  //Books from authenticated users
  const [restrictions, setRestrictions] = useState(true);

  const [randomCollection, setRandomCollection] = useState<
    | {
        highlight: string;
        author: string;
        title: string;
      }
    | undefined
  >();
  //This is the main collection we are reading from, either authed user info or unauthed will go here

  const randomHighlightGenerator = (allBooks: Book[]) => {
    const randomBookNumber = Math.round(Math.random() * (allBooks.length - 1));
    const randomBook = allBooks[randomBookNumber];
    const randomHighlightNumber = Math.round(
      Math.random() * (randomBook.highlights.length - 1)
    );
    const randomHighlight = randomBook.highlights[randomHighlightNumber];

    setRandomCollection({
      highlight: randomHighlight.Text,
      //Removing the ; from author list
      author:
        randomBook.author.slice(-1) === ";"
          ? randomBook.author.slice(0, -1)
          : randomBook.author.replace(";", " & "),
      title: randomBook.title,
    });
  };

  useEffect(() => {
    //Setting restrictions
    setRestrictions(!userAuthenticated());

    //Passing in context for authed users
    if (userAuthenticated() && books) {
      randomHighlightGenerator(books);

      const interval = setInterval(() => {
        randomHighlightGenerator(books);
      }, 20000);

      return () => {
        clearInterval(interval);
      };
    } else {
      //For non logged in users we will use their clippings in local storage to display random quote
      const clippings = localStorage.getItem("clippings");
      if (clippings) {
        //Have to convert clippings to books format
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

  //Reading from the main collection (source of truth, idk what it means makes sense to me), if it aint there show loading
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
