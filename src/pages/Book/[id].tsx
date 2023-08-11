import { Book } from "@/api/Interface";
import styles from "../../styles/Pages/BookPage.module.scss";
import { useRouter } from "next/router";
import React, { useState, useEffect, useContext, useRef } from "react";
import { KTON_CONTEXT } from "../../context/KTONContext";
import InitApi from "../../api/InitAPI";
import Tilt from "react-parallax-tilt";
import HandleLoginModal from "@/components/Login/HandleLoginModal";
import cleanAuthor from "@/helpers/cleanAuthor";
import AllowedRoute from "@/helpers/AllowedRoute";
import HighlightsList from "@/components/Book/HighlightsList";
import SummarySection from "@/components/Book/SummaryComponent";
import GenreBanner from "@/components/Book/GenreBanner";
import LoadingPage from "@/components/Loading/LoadingPage";
import { Tooltip } from "react-tooltip";
import SearchIcon from "@mui/icons-material/Search";
import Modal_Book_Search from "@/components/Modals/Modal_Book_Search";
import Modal_Type_Save from "@/components/Modals/Modal_Type_Save";
import scrollToElementWithText from "@/helpers/ScrollToHighlight";
import Head from "next/head";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import HandleChanges from "@/helpers/HandleChanges";

const BookPage = () => {
  const router = useRouter();
  const id = router.query.id;
  const singleId = Array.isArray(id) ? id[0] : id; // Access the first element if it's an array
  const { books } = useContext(KTON_CONTEXT);
  const { InitialiseApp } = InitApi();
  const [mainBook, setMainBook] = useState<undefined | Book>(undefined);
  const { LoginModal } = HandleLoginModal();
  const [screenWidth, setScreenWidth] = useState(0);
  const { addRating } = HandleChanges();
  const [showEditImageModal, setShowEditImageModal] = useState(false);
  const [coverIsValid, setCoverIsValid] = useState(true);
  const [displaySearchModal, setDisplaySearchModal] = useState(false);

  //Need to check if anything was passed in through the query string, if it was scroll to it
  useEffect(() => {
    //Handling control F
    function handleKeyPress(e: KeyboardEvent) {
      if (e.key === "f" && e.ctrlKey) {
        e.preventDefault();
        setDisplaySearchModal((prevDisplay) => !prevDisplay);
      }
    }

    window.addEventListener("keydown", handleKeyPress);

    if (!router.query.highlight_text) return;

    const scrollDelay = setTimeout(() => {
      scrollToElementWithText(router.query.highlight_text as string);
    }, 500);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      //Clean up the timer
      clearTimeout(scrollDelay);
    };
  }, []);

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

  const bookInformation = () => {
    if (!mainBook) return null;
    return (
      <div className={styles.bookInformation}>
        <div className={styles.titleContainer}>
          <div className={styles.titleSection}>
            <h1>{mainBook.title}</h1>
          </div>
          <div className={styles.searchSection}>
            <SearchIcon
              onClick={() => setDisplaySearchModal(!displaySearchModal)}
              id={styles.searchIcon}
            />
            {displaySearchModal && (
              <Modal_Book_Search
                closeModal={() => setDisplaySearchModal(false)}
              />
            )}
          </div>
        </div>
        <p id={styles.author}>{cleanAuthor(mainBook.author)}</p>
        <p>
          {[...Array(5)].map((eachStar, i) => {
            const isFilled = i < mainBook.rating;
            const starIcon = isFilled ? (
              <StarIcon className={styles.star} />
            ) : (
              <StarBorderIcon className={styles.star} />
            );
            return (
              <span
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  const newRating = isFilled ? i : i + 1;
                  addRating({ data: newRating, book_id: mainBook._id });
                }}
              >
                {starIcon}
              </span>
            );
          })}
        </p>
      </div>
    );
  };

  if (!mainBook) return <LoadingPage Text="Book Loading" />;

  return (
    <>
      <Head>
        <title>{mainBook.title}</title>
        <meta
          name={"og:image"}
          title={"og:image"}
          content={mainBook.cover_image}
        />
      </Head>
      {LoginModal()}
      <div className={styles.BookPage}>
        <div className={styles.bookHalf}>
          <Tilt
            glareEnable={true}
            glareMaxOpacity={0.4}
            glarePosition="all"
            glareBorderRadius="0px"
            tiltAngleYInitial={screenWidth < 1024 ? 0 : -10}
            tiltEnable={false}
            className={styles.image}
            perspective={650}
          >
            {!coverIsValid || mainBook.cover_image === null ? (
              <div
                data-tooltip-id={`my-tooltip-${id}`}
                data-tooltip-content={`Add an image through the button above ⬆️`}
              ></div>
            ) : (
              <img
                alt="Book Cover"
                draggable="false"
                src={mainBook.cover_image}
                onError={({ currentTarget }) => {
                  setCoverIsValid(false);
                }}
              />
            )}
          </Tilt>
          {/* <p
            className={styles.editURLMenu}
            onClick={() => setShowEditImageModal(!showEditImageModal)}
          >
            Edit cover
          </p>
          {showEditImageModal && (
            <Modal_Type_Save
              closeModal={() => setShowEditImageModal(false)}
              mainBook={mainBook}
            />
          )} */}
        </div>
        <div className={styles.highlightHalf} id="scrollHighlight">
          {bookInformation()}
          <SummarySection />
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
