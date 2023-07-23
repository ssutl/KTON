import { Book } from "@/api/Interface";
import styles from "../../styles/BookPage.module.scss";
import { useRouter } from "next/router";
import React, { useState, useEffect, useContext, useRef } from "react";
import userAuthenticated from "@/helpers/UserAuthenticated";
import { KTON_CONTEXT } from "../../context/KTONContext";
import InitApi from "../../api/InitAPI";
import Tilt from "react-parallax-tilt";
import HandleLoginModal from "@/components/HandleLoginModal";
import cleanAuthor from "@/helpers/cleanAuthor";
import AllowedRoute from "@/helpers/AllowedRoute";
import HighlightsList from "@/components/HighlightsList";
import SummarySection from "@/components/SummaryComponent";
import GenreBanner from "@/components/GenreBanner";

const BookPage = () => {
  const router = useRouter();
  const id = router.query.id;
  const singleId = Array.isArray(id) ? id[0] : id; // Access the first element if it's an array
  const { books } = useContext(KTON_CONTEXT);
  const { InitialiseApp } = InitApi();
  const [mainBook, setMainBook] = useState<undefined | Book>(undefined);
  const [restrictions, setRestricitons] = useState<boolean>(true);
  const { LoginModal } = HandleLoginModal();
  const [screenWidth, setScreenWidth] = useState(0);

  //Initialising App by making data call on page load, this updates user context
  useEffect(() => {
    setScreenWidth(window.innerWidth);
    window.addEventListener("resize", () => setScreenWidth(window.innerWidth));

    setRestricitons(!userAuthenticated());

    //check if this is an allowed route
    AllowedRoute();

    //If user is authenticated and they have no books in context, then we need to refresh context
    if (userAuthenticated() && !books) {
      InitialiseApp();
    }
  }, []);

  //Condition to set mainbooks to either books or clippings, depending on user authentication
  useEffect(() => {
    if (userAuthenticated()) {
      if (books) {
        setMainBook(books.filter((book) => book._id === singleId)[0]);
      }
    } else {
      const clippings = localStorage.getItem("clippings");

      if (clippings && singleId) {
        const parsedClippings: Book[] = JSON.parse(clippings);
        setMainBook(parsedClippings[parseInt(singleId)]);
      }
    }
  }, [books, singleId]);

  const bookTitle = () => {
    if (!mainBook) return null;
    return (
      <div className={styles.bookTitle}>
        <h1>{mainBook.title}</h1>
        <p>{cleanAuthor(mainBook.author)}</p>
      </div>
    );
  };

  if (mainBook) {
    return (
      <>
        {LoginModal()}
        <div className={styles.BookPage}>
          <div className={styles.bookHalf}>
            <div className={styles.overlay}></div>
            <div className={styles.imageSection}>
              <Tilt
                glareEnable={true}
                glareMaxOpacity={0.1}
                glarePosition="all"
                glareBorderRadius="0px"
                tiltAngleYInitial={screenWidth < 1024 ? 0 : -10}
                tiltEnable={false}
                className={styles.ImageContainer}
                perspective={650}
              >
                {restrictions ? null : (
                  <img
                    alt="Book Cover"
                    draggable="false"
                    src={mainBook.cover_image}
                    className="image"
                  />
                )}
              </Tilt>
            </div>
            {restrictions ? null : <GenreBanner id={singleId} />}
            {bookTitle()}
            {restrictions ? null : <SummarySection id={singleId} />}
            {screenWidth < 1024 ? <HighlightsList book={mainBook} /> : null}
          </div>
          <div className={styles.highlightHalf}>
            {bookTitle()}
            {screenWidth > 1024 ? <HighlightsList book={mainBook} /> : null}
          </div>
        </div>
      </>
    );
  } else return <h1>Component Loading</h1>;
};

export default BookPage;
