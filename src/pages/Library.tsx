import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/Library.module.scss";
import SearchIcon from "@mui/icons-material/Search";
import { KTON_CONTEXT } from "../context/KTONContext";
import { Book } from "@/api/Interface";
import userAuthenticated from "@/helpers/UserAuthenticated";

//interface LibraryProps {}

const Library = () => {
  const { books } = useContext(KTON_CONTEXT);
  const [mainBooks, setMainBooks] = useState<Book[]>([]);
  const [searchValue, setSearchValue] = useState("");
  console.log("searchValue", searchValue);

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
  }, []);

  const SearchBanner = () => {
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
                  onChange={(e) => setSearchValue(e.target.value.toLowerCase())}
                  placeholder="Search By Title, Author Or Quote"
                />
              </div>
              <div className={styles.modal_title}>
                <p>Books</p>
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

  const filterBanner = () => {
    return (
      <div className={styles.filterBanner}>
        <h1>Filter Banner</h1>
      </div>
    );
  };

  if (mainBooks) {
    return (
      <div className={styles.Library}>
        {SearchBanner()}
        {filterBanner()}
      </div>
    );
  } else return <h1>Component Loading</h1>;
};

export default Library;
