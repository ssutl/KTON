import React, { useState, useEffect, useContext, useRef } from "react";
import styles from "../../styles/Pages/Library.module.scss";
import SearchIcon from "@mui/icons-material/Search";
import { KTON_CONTEXT } from "../../context/KTONContext";
import InitApi from "../../api/InitAPI";
import Head from "next/head";
import AllowedRoute from "@/helpers/AllowedRoute";
import BooksList from "@/components/Library/BooksList";
import LoadingPage from "@/components/Loading/LoadingPage";
import Modal_Book_Search from "@/components/Modals/Modal_Book_Search";
import Modal_Filter_Search from "@/components/Modals/Modal_Filter_Search";
import Modal_Select from "@/components/Modals/Modal_Select";

const Library = () => {
  const { InitialiseApp } = InitApi();
  const { books, userinfo } = useContext(KTON_CONTEXT);
  const [selectedSort, setSelectedSort] = useState<
    "Recent" | "Rating" | "Oldest"
  >("Recent");
  const [selectedFilter, setSelectedFilter] = useState<string | undefined>(
    undefined
  );
  const [screenWidth, setScreenWidth] = useState<number | undefined>(undefined);
  const [displaySearchModal, setDisplaySearchModal] = useState(false);
  const [displaySortModal, setDisplaySortModal] = useState(false);
  const [displayFilterModal, setDisplayFilterModal] = useState(false);

  const showFilterH3 =
    books &&
    books.map((book) => book.genre).reduce((acc, curr) => acc.concat(curr), [])
      .length;

  //Initialising App by making data call on page load, this updates user context
  useEffect(() => {
    //check if this is an allowed route
    AllowedRoute();

    //If user is authenticated and they have no books in context, then we need to refresh context
    if (!books) {
      InitialiseApp();
    }

    //Controlling screenwidth
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);

    //Set sort to whatever is in local storage
    const selectedSort = localStorage.getItem("selectedSort");
    if (selectedSort) {
      setSelectedSort(selectedSort as "Recent" | "Rating" | "Oldest");
    }

    //Handling control F
    function handleKeyPress(e: KeyboardEvent) {
      if (e.key === "f" && e.ctrlKey) {
        e.preventDefault();
        setDisplaySearchModal((prevDisplay) => !prevDisplay);
      }
    }

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //Code to for search bar
  const SearchBanner = () => {
    if (!books || !userinfo) return null;

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
              <Modal_Book_Search
                closeModal={() => setDisplaySearchModal(false)}
              />
            )}
          </span>
        </div>
      </div>
    );
  };

  //Banner shown to allow user to filter and sort their books
  const filterBanner = () => {
    if (!screenWidth) return null;

    return (
      <div className={styles.filterBanner}>
        <div className={styles.filterBannerWidth}>
          <div className={styles.filterSection}>
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
                    <Modal_Filter_Search
                      closeModal={() => setDisplayFilterModal(false)}
                      onItemClick={(genre: string) => setSelectedFilter(genre)}
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
                  <Modal_Select
                    closeModal={() => setDisplaySortModal(false)}
                    onItemClick={(
                      selectedSort: "Recent" | "Rating" | "Oldest"
                    ) => {
                      localStorage.setItem("selectedSort", selectedSort);
                      setSelectedSort(selectedSort);

                      //If on mobile automatically close this modal auto
                      if (screenWidth < 1024) {
                        setDisplaySortModal(false);
                      }
                    }}
                    optionsData={["Recent", "Rating"]}
                    selectedSort={selectedSort}
                  />
                )}
              </span>
            </>
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

  if (!books) return <LoadingPage Text="Loading Library" />;

  return (
    <>
      <Head>
        <title>Library</title>
      </Head>
      <div className={`${styles.Library}`} id="Library">
        {SearchBanner()}
        {filterBanner()}
        <div className={styles.bookContainer}>
          <BooksList
            selectedSort={selectedSort}
            books={books}
            selectedFilter={selectedFilter}
          />
        </div>
      </div>
    </>
  );
};

export default Library;
