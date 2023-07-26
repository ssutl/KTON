import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/Library.module.scss";
import SearchIcon from "@mui/icons-material/Search";
import { KTON_CONTEXT } from "../context/KTONContext";
import { Book } from "@/api/Interface";
import userAuthenticated from "@/helpers/UserAuthenticated";
import InitApi from "../api/InitAPI";
import BookComponent from "@/components/BookComponent";
import Head from "next/head";
import AllowedRoute from "@/helpers/AllowedRoute";
import genreColors from "@/helpers/sortGenreColors";

const Library = () => {
  const { InitialiseApp } = InitApi();
  const { books, userinfo } = useContext(KTON_CONTEXT);
  const { colorConverter, randomColorGenerator, mapTable } = genreColors();
  const [mainBooks, setMainBooks] = useState<Book[] | undefined>(undefined);
  const [searchValue, setSearchValue] = useState("");
  const [restrictions, setRestricitons] = useState<boolean>(true);
  const [restrictionBanner, setRestrictionBanner] = useState(false);
  const [sortBy, setSortBy] = useState<"Recent" | "Rating" | "">("Recent");
  const [filterInput, setFilterInput] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string | undefined>(
    undefined
  );

  //Initialising App by making data call on page load, this updates user context
  useEffect(() => {
    setRestricitons(!userAuthenticated());
    setRestrictionBanner(!userAuthenticated());

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
        setMainBooks(books);
      }
    } else {
      const clippings = localStorage.getItem("clippings");

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
            <span className={styles.hoverMenu}>
              <SearchIcon />
              <div className={styles.SearchFieldModal}>
                <div className={styles.searchBar}>
                  <input
                    type="text"
                    onChange={(e) =>
                      setSearchValue(e.target.value.toLowerCase())
                    }
                    placeholder="Search By Title, Author Or Quote"
                  />
                </div>
                <div className={styles.modal_title}>
                  {mainBooks
                    .slice(
                      0,
                      restrictions
                        ? Math.round(mainBooks.length / 2)
                        : mainBooks.length
                    )
                    .filter((eachBook) =>
                      eachBook.title.toLowerCase().includes(searchValue)
                    ).length === 0 ? (
                    <p>No Titles Match</p>
                  ) : (
                    <p>Books</p>
                  )}
                </div>
                {mainBooks
                  .filter((eachBook) =>
                    eachBook.title.toLowerCase().includes(searchValue)
                  )
                  .slice(
                    0,
                    restrictions
                      ? Math.round(mainBooks.length / 2)
                      : mainBooks.length
                  )
                  .map((eachBook, i) => (
                    <div key={i} className={styles.bookBar}>
                      <p>{eachBook.title}</p>
                    </div>
                  ))}
              </div>
            </span>
          </div>
        </div>
      );
  };

  //The Sort modal
  const SortModal = () => {
    return (
      <div className={styles.SortModal}>
        <div className={styles.modal_title}>
          <p>Types</p>
        </div>
        <div
          className={`${styles.sortItem} ${
            sortBy === "Rating" ? styles.selected : ""
          }`}
          onClick={() =>
            sortBy === "Rating" ? setSortBy("") : setSortBy("Rating")
          }
        >
          <p>Rating</p>
        </div>
        <div
          className={`${styles.sortItem} ${
            sortBy === "Recent" ? styles.selected : ""
          }`}
          onClick={() =>
            sortBy === "Recent" ? setSortBy("") : setSortBy("Recent")
          }
        >
          <p>Recent</p>
        </div>
      </div>
    );
  };

  //The Filter modal
  const FilterModal = () => {
    if (books && userinfo) {
      return (
        <div className={styles.FilterModal}>
          <div className={styles.searchItem}>
            <input
              placeholder="Filter by genre"
              onChange={(e) => setFilterInput(e.target.value)}
            />
          </div>
          <div className={styles.modal_title}>
            <p>Genres</p>
          </div>
          {[
            ...new Set(
              books
                .map((book) => book.genre)
                .reduce((acc, curr) => acc.concat(curr), [])
                .filter((eachGenre) =>
                  eachGenre.toLowerCase().includes(filterInput.toLowerCase())
                )
            ),
          ].map((genre, i) => (
            <div
              key={i}
              className={`${styles.genreItem} ${
                selectedFilter === genre ? styles.selected : ""
              }`}
              onClick={() => {
                //If the genre is already selected we need to clear selectedFilter, else set selectedFilter to genre
                if (selectedFilter === genre) {
                  setSelectedFilter(undefined);
                } else {
                  setSelectedFilter(genre);
                }
              }}
            >
              <div
                style={
                  {
                    "--background-color": colorConverter(
                      userinfo.genres[genre]
                    ),
                  } as React.CSSProperties
                }
                className={styles.tag}
              >
                <p>{genre}</p>
              </div>
            </div>
          ))}
        </div>
      );
    } else return null;
  };

  //Banner shown when user is not authenticated
  const restrictionBannerComp = () => {
    return (
      <div className={styles.restrictionBanner}>
        <div className={styles.headerWidth}>
          <p>
            Login to view all books:{" "}
            {mainBooks
              ?.slice(mainBooks.length / 2 + 1, mainBooks.length)
              .map((eachBook) => `${eachBook.title}, `)
              .slice(0, 2)}{" "}
            etc ...
          </p>
          <span onClick={() => setRestrictionBanner(false)}>x</span>
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
            {
              //Only show filter option if user has genres added
            }
            {books &&
            books
              .map((book) => book.genre)
              .reduce((acc, curr) => acc.concat(curr), []).length ? (
              <span className={styles.filterHoverMenu}>
                <h3>Filters +</h3>
                {FilterModal()}
              </span>
            ) : null}
            <span className={styles.sortHoverMenu}>
              <h3>Sort</h3>
              {SortModal()}
            </span>
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
        <div className={styles.Library}>
          {SearchBanner()}
          {filterBanner()}
          {restrictionBanner ? restrictionBannerComp() : null}
          <div className={styles.bookContainer}>
            {mainBooks
              .filter((eachBook) =>
                eachBook.title.toLowerCase().includes(searchValue)
              )
              .sort((a: Book, b: Book) => {
                if (sortBy === "Rating") {
                  return b.rating - a.rating;
                } else if (sortBy === "") {
                  return (
                    new Date(a.upload_date).getTime() -
                    new Date(b.upload_date).getTime()
                  );
                } else return 0;
              })
              .filter((eachBook) =>
                selectedFilter
                  ? eachBook.genre.includes(selectedFilter)
                  : eachBook
              )
              .slice(
                0,
                restrictions
                  ? Math.round(mainBooks.length / 2)
                  : mainBooks.length
              )
              .map((eachBook, i) => (
                <BookComponent book={eachBook} index={i} key={i} />
              ))}
          </div>
        </div>
      </>
    );
  } else return <h1>Component Loading</h1>;
};

export default Library;
