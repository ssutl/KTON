import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/Library.module.scss";
import SearchIcon from "@mui/icons-material/Search";
import { KTON_CONTEXT } from "../context/KTONContext";
import { Book } from "@/api/Interface";
import userAuthenticated from "@/helpers/UserAuthenticated";
import InitApi from "../api/InitAPI";
import BookComponent from "@/components/BookComponent";

//interface LibraryProps {}

const Library = () => {
  const { InitialiseApp } = InitApi();
  const { books } = useContext(KTON_CONTEXT);
  const [mainBooks, setMainBooks] = useState<Book[] | undefined>(undefined);
  const [searchValue, setSearchValue] = useState("");

  //Initialising App by making data call on page load, this updates user context
  useEffect(() => {
    InitialiseApp();
  }, []);

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

  const SearchBanner = () => {
    if (mainBooks)
      return (
        <div className={styles.searchBanner}>
          <div className={styles.searchBannerWidth}>
            <p>Last Import 16-4-23</p>
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
                  {mainBooks.filter((eachBook) =>
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

  interface ModalProps {
    type: "Filter" | "Sort";
  }

  //The pop up menu
  const Modal: React.FC<ModalProps> = ({ type }) => {
    return (
      <div className={styles.modal}>
        <div className={styles.modal_height}>
          <div className={styles.modal_title}>
            <p>{type}</p>
          </div>
          {type === "Filter" ? (
            <div className={styles.modal_item}>
              <p>Home</p>
            </div>
          ) : (
            <>
              <div className={styles.modal_item}>
                <p>Recent</p>
              </div>
              <div className={styles.modal_item}>
                <p>Starred</p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const filterBanner = () => {
    return (
      <div className={styles.filterBanner}>
        <div className={styles.filterBannerWidth}>
          <div className={styles.filterSection}>
            <span className={styles.hoverMenu}>
              <h3>Filters +</h3>
              <Modal type={"Filter"} />
            </span>
            <span className={styles.hoverMenu}>
              <h3>Sort</h3>
              <Modal type={"Sort"} />
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
      <div className={styles.Library}>
        {SearchBanner()}
        {filterBanner()}
        <div className={styles.bookContainer}>
          {mainBooks
            .filter((eachBook) =>
              eachBook.title.toLowerCase().includes(searchValue)
            )
            .map((eachBook, i) => (
              <BookComponent book={eachBook} index={i} key={i} />
            ))}
        </div>
      </div>
    );
  } else return <h1>Component Loading</h1>;
};

export default Library;
