import { Book } from "@/api/Interface";
import styles from "../../styles/Book.module.scss";
import { useRouter } from "next/router";
import React, { useState, useEffect, useContext } from "react";
import userAuthenticated from "@/helpers/UserAuthenticated";
import { KTON_CONTEXT } from "../../context/KTONContext";
import InitApi from "../../api/InitAPI";

const BookPage = () => {
  const router = useRouter();
  const id = router.query.id;
  const singleId = Array.isArray(id) ? id[0] : id; // Access the first element if it's an array
  const { books } = useContext(KTON_CONTEXT);
  const { InitialiseApp } = InitApi();
  const [mainBook, setMainBook] = useState<undefined | Book>(undefined);

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
        <h1>{mainBook.title}</h1>
      </div>
    );
  } else return <h1>Component Loading</h1>;
};

export default BookPage;
