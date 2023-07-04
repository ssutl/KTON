import { Book } from "@/api/Interface";
import styles from "../../styles/BookPage.module.scss";
import { useRouter } from "next/router";
import React, { useState, useEffect, useContext } from "react";
import userAuthenticated from "@/helpers/UserAuthenticated";
import { KTON_CONTEXT } from "../../context/KTONContext";
import InitApi from "../../api/InitAPI";
import Highlight from "@/components/Highlight";
import { usePalette } from "react-palette";
import Tilt from "react-parallax-tilt";

const BookPage = () => {
  const router = useRouter();
  const id = router.query.id;
  const singleId = Array.isArray(id) ? id[0] : id; // Access the first element if it's an array
  const { books } = useContext(KTON_CONTEXT);
  const { InitialiseApp } = InitApi();
  const [mainBook, setMainBook] = useState<undefined | Book>(undefined);
  const { data, loading, error } = usePalette(
    mainBook ? mainBook.cover_image : ""
  );

  //Initialising App by making data call on page load, this updates user context
  useEffect(() => {
    //If the user is logged in but the book data is empty then we gotta refresh context, this way we can keep initial load fast by not loading books off of navigation
    if (userAuthenticated() && !books) {
      InitialiseApp();
    }

    //Else user not logged in, we can just grab from clippings
    if (!userAuthenticated()) {
      const clippings = localStorage.getItem("clippings");

      if (clippings && singleId) {
        const parsedClippings: Book[] = JSON.parse(clippings);
        setMainBook(parsedClippings[parseInt(singleId)]);
      }
    }
  }, []);

  //This should trigger at the start if theres already books, or after the initaliseApp has been called to get books
  useEffect(() => {
    if (userAuthenticated() && books) {
      setMainBook(books.filter((book) => book._id === singleId)[0]);
    }
  }, [books]);

  if (mainBook) {
    return (
      <div className={styles.BookPage}>
        <div className={styles.searchBar}></div>
        <div className={styles.bookHalf}>
          <div
            className={styles.overlay}
            style={
              { "--background-color": data.vibrant } as React.CSSProperties
            }
          ></div>
          <div className={styles.imageSection}>
            <Tilt
              glareEnable={true}
              glareMaxOpacity={0.1}
              glarePosition="all"
              glareBorderRadius="0px"
              tiltAngleYInitial={-10}
              tiltEnable={true}
              gyroscope={true}
              className={styles.ImageContainer}
              perspective={650}
            >
              <img
                draggable="false"
                src={mainBook.cover_image}
                className="image"
              />
            </Tilt>
          </div>
        </div>
        <div className={styles.highlightHalf}>
          <div className={styles.bookTitle}>
            <h1>{mainBook.title}</h1>
            <p>{mainBook.author}</p>
          </div>
          {mainBook.highlights.map((eachHighlight, index) => (
            <Highlight highlight={eachHighlight} index={index} />
          ))}
        </div>
      </div>
    );
  } else return <h1>Component Loading</h1>;
};

export default BookPage;
