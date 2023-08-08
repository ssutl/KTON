import { Book } from "@/api/Interface";
import styles from "../../styles/BookPage.module.scss";
import { useRouter } from "next/router";
import React, { useState, useEffect, useContext, useRef } from "react";
import { KTON_CONTEXT } from "../../context/KTONContext";
import InitApi from "../../api/InitAPI";
import Tilt from "react-parallax-tilt";
import HandleLoginModal from "@/components/HandleLoginModal";
import cleanAuthor from "@/helpers/cleanAuthor";
import AllowedRoute from "@/helpers/AllowedRoute";
import HighlightsList from "@/components/HighlightsList";
import SummarySection from "@/components/SummaryComponent";
import GenreBanner from "@/components/GenreBanner";
import LoadingPage from "@/components/LoadingPage";
import { Tooltip } from "react-tooltip";
import SearchIcon from "@mui/icons-material/Search";
import Modal_Book_Search from "@/components/Modal_Book_Search";
import Modal_Type_Save from "@/components/Modal_Type_Save";

const BookPage = () => {
  const router = useRouter();
  const id = router.query.id;
  const singleId = Array.isArray(id) ? id[0] : id; // Access the first element if it's an array
  const { books } = useContext(KTON_CONTEXT);
  const { InitialiseApp } = InitApi();
  const [mainBook, setMainBook] = useState<undefined | Book>(undefined);
  const { LoginModal } = HandleLoginModal();
  const [screenWidth, setScreenWidth] = useState(0);
  const [showEditImageModal, setShowEditImageModal] = useState(false);
  const [coverIsValid, setCoverIsValid] = useState(true);
  const [displaySearchModal, setDisplaySearchModal] = useState(false);

  //Initialising App by making data call on page load, this updates user context
  useEffect(() => {
    setScreenWidth(window.innerWidth);
    window.addEventListener("resize", () => setScreenWidth(window.innerWidth));

    //check if this is an allowed route
    if (!AllowedRoute())
      throw new Error("Unauthed users cannot access this route");

    //If user is authenticated and they have no books in context, then we need to refresh context
    if (!books) {
      InitialiseApp();
    }
  }, []);

  //Condition to set mainbooks to either books or clippings, depending on user authentication
  useEffect(() => {
    if (!books) return;
    setMainBook(books.filter((book) => book._id === singleId)[0]);
  }, [books, singleId]);

  const bookTitle = () => {
    if (!mainBook) return null;
    return (
      <div className={styles.bookTitle}>
        <div className={styles.titleContainer}>
          <h1>{mainBook.title}</h1>
          <span>
            <SearchIcon
              onClick={() => setDisplaySearchModal(!displaySearchModal)}
              id={styles.searchIcon}
            />
            {displaySearchModal && (
              <Modal_Book_Search
                closeModal={() => setDisplaySearchModal(false)}
              />
            )}
          </span>
        </div>
        <p>{cleanAuthor(mainBook.author)}</p>
      </div>
    );
  };

  if (!mainBook) return <LoadingPage Text="Book Loading" />;

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
              {!coverIsValid || mainBook.cover_image === null ? (
                <div
                  className={styles.NoImage}
                  data-tooltip-id={`my-tooltip-${id}`}
                  data-tooltip-content={`Add an image through the button above ⬆️`}
                ></div>
              ) : (
                <img
                  alt="Book Cover"
                  draggable="false"
                  src={mainBook.cover_image}
                  className={styles.image}
                  onError={({ currentTarget }) => {
                    setCoverIsValid(false);
                  }}
                />
              )}

              <p
                className={styles.editURLMenu}
                onClick={() => setShowEditImageModal(!showEditImageModal)}
              >
                Edit cover
              </p>
            </Tilt>
            {showEditImageModal && (
              <Modal_Type_Save
                closeModal={() => setShowEditImageModal(false)}
                mainBook={mainBook}
              />
            )}
          </div>
          <GenreBanner />
          {bookTitle()}
          <SummarySection />
          {/*Highlights is only shown in this half on mobile, hidden on desktop */}
          <HighlightsList book={mainBook} />
        </div>
        {/* Highlight Section, this is hidden on mobile*/}
        <div className={styles.highlightHalf}>
          {bookTitle()}
          <HighlightsList book={mainBook} />
        </div>
        <Tooltip
          id={`my-tooltip-${id}`}
          className="toolTip"
          noArrow
          place="bottom-end"
        />
      </div>
    </>
  );
};

export default BookPage;
