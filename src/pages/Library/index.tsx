import React, { useState, useEffect, useContext, useRef } from "react";
import styles from "../../styles/Library.module.scss";
import SearchIcon from "@mui/icons-material/Search";
import { KTON_CONTEXT } from "../../context/KTONContext";
import { Book } from "@/api/Interface";
import userAuthenticated from "@/helpers/UserAuthenticated";
import InitApi from "../../api/InitAPI";
import Head from "next/head";
import AllowedRoute from "@/helpers/AllowedRoute";
import Modal from "@/components/Modal";
import BooksList from "@/components/BooksList";
import HandleLoginModal from "@/components/HandleLoginModal";
import LoadingPage from "@/components/LoadingPage";
// import headerStyles from "../../styles/Header.module.scss";

const Library = () => {
  const { InitialiseApp } = InitApi();
  const { books, userinfo } = useContext(KTON_CONTEXT);
  const [mainBooks, setMainBooks] = useState<Book[] | undefined>(undefined);
  const [restrictions, setRestrictions] = useState<boolean>(false);
  const [selectedSort, setSelectedSort] = useState<
    "Recent" | "Rating" | "Oldest"
  >("Recent");
  const [selectedFilter, setSelectedFilter] = useState<string | undefined>(
    undefined
  );
  const [screenWidth, setScreenWidth] = useState(0);
  const [displaySearchModal, setDisplaySearchModal] = useState(false);
  const [displaySortModal, setDisplaySortModal] = useState(false);
  const [displayFilterModal, setDisplayFilterModal] = useState(false);
  const modalDisplayed =
    displayFilterModal || displaySortModal || displaySearchModal;

  const showFilterH3 =
    books &&
    books.map((book) => book.genre).reduce((acc, curr) => acc.concat(curr), [])
      .length;

  //Initialising App by making data call on page load, this updates user context
  useEffect(() => {
    //check if this is an allowed route
    if (!AllowedRoute())
      throw new Error("Unauthed users cannot access this route");

    //If user is authenticated and they have no books in context, then we need to refresh context
    if (userAuthenticated() && !books) {
      InitialiseApp();
    }

    //Controlling screenwidth
    setScreenWidth(window.innerWidth);
    window.addEventListener("resize", () => setScreenWidth(window.innerWidth));

    setRestrictions(!userAuthenticated());
  }, []);

  //Condition to set mainbooks to either books or clippings, depending on user authentication
  useEffect(() => {
    if (userAuthenticated()) {
      if (books) {
        setMainBooks(books);
      }
    } else {
      const clippings = sessionStorage.getItem("clippings");

      if (clippings) {
        const parsedClippings: Book[] = JSON.parse(clippings);
        setMainBooks(parsedClippings);
      }
    }
  }, [books]);

  //Code to for search bar
  const SearchBanner = () => {
    if (mainBooks && userinfo)
      return (
        <div className={styles.searchBanner}>
          <div className={styles.searchBannerWidth}>
            <p>Last Import {new Date(userinfo.last_upload).toDateString()}</p>
            <span>
              <SearchIcon
                onClick={() => setDisplaySearchModal(!displaySearchModal)}
                id={styles.searchIcon}
              />
              {displaySearchModal && (
                <Modal
                  specific_type="Book_Search"
                  closeModal={() => setDisplaySearchModal(false)}
                  mainBooks={mainBooks}
                />
              )}
            </span>
          </div>
        </div>
      );
  };

  //Banner shown to allow user to filter and sort their books
  const filterBanner = () => {
    return (
      <div className={styles.filterBanner}>
        <div className={styles.filterBannerWidth}>
          <div className={styles.filterSection}>
            {restrictions ? (
              <p>Sign up to view all books</p>
            ) : (
              <>
                {showFilterH3 ? (
                  <span>
                    <p
                      id={styles.buttons}
                      onClick={() => setDisplayFilterModal(!displayFilterModal)}
                    >
                      Filters +
                    </p>
                    {displayFilterModal && (
                      <Modal
                        specific_type="Filter_Search"
                        closeModal={() => setDisplayFilterModal(false)}
                        mainBooks={mainBooks!}
                        onItemClick={(genre: string) =>
                          setSelectedFilter(genre)
                        }
                        selectedFilter={selectedFilter}
                      />
                    )}
                  </span>
                ) : null}
                <span>
                  <p
                    id={styles.buttons}
                    onClick={() => setDisplaySortModal(!displaySortModal)}
                  >
                    Sort
                  </p>
                  {displaySortModal && (
                    <Modal
                      specific_type="Select"
                      closeModal={() => setDisplaySortModal(false)}
                      onItemClick={(
                        selectedSort: "Recent" | "Rating" | "Oldest"
                      ) => {
                        setSelectedSort(selectedSort);

                        //If on mobile automatically close this modal auto
                        if (screenWidth < 1024) {
                          setDisplaySortModal(false);
                        }
                      }}
                      mainBooks={mainBooks!}
                      data={
                        userAuthenticated() ? ["Recent", "Rating"] : ["Recent"]
                      }
                      selectedSort={selectedSort}
                    />
                  )}
                </span>
              </>
            )}
          </div>
          <div className={styles.descriptionSection}>
            <h3>
              Dive into your personal library and rediscover your favorite
              reads. Search by genre, delve into specific themes, and uncover
              memorable quotes. Start exploring your literary world now!
            </h3>
          </div>
        </div>
      </div>
    );
  };

  if (mainBooks) {
    return (
      <>
        <Head>
          <title>Library</title>
        </Head>
        <div
          className={`${styles.Library} ${
            modalDisplayed ? styles.noScroll : ""
          }`}
        >
          {SearchBanner()}
          {filterBanner()}
          <div className={styles.bookContainer}>
            <BooksList
              selectedSort={selectedSort}
              books={mainBooks}
              selectedFilter={selectedFilter}
            />
          </div>
        </div>
      </>
    );
  } else return <LoadingPage Text="Loading" />;
};

export default Library;
