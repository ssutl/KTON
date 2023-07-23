import styles from "../styles/GenreBanner.module.scss";
import React, { useState, useEffect, useContext, useRef } from "react";
import HandleLoginModal from "./HandleLoginModal";
import { KTON_CONTEXT } from "../context/KTONContext";
import useOutsideAlerter from "@/helpers/ClickOutsideFunction";
import GenreModal from "./GenreModal";
import genreColors from "@/helpers/sortGenreColors";
import HandleChanges from "@/helpers/HandleChanges";

const GenreBanner: React.FC<{
  id: string | undefined;
}> = ({ id }) => {
  const { books, userinfo } = useContext(KTON_CONTEXT);
  const [displayGenreModal, setDisplayGenreModal] = useState(false);
  const { addGenreToBook } = HandleChanges();
  const { colorConverter } = genreColors();
  const multiRef = useRef(null);
  const mainBook = books?.filter((book) => book._id === id)[0];

  // /**Custom hook which takes in a ref and a setState action which gets triggered when the user clicks outside of the ref */
  useOutsideAlerter(multiRef, setDisplayGenreModal);

  if (mainBook) {
    return (
      <div className={styles.genreBanner}>
        <p
          onClick={() => {
            setDisplayGenreModal(!displayGenreModal);
          }}
          id={styles.addGenre}
        >
          + Add genre
        </p>
        {displayGenreModal ? <GenreModal refrence={multiRef} /> : null}
        {userinfo &&
          mainBook.genre.map((eachGenre, i) => (
            <p
              key={i}
              className={styles.BannerTags}
              style={
                {
                  "--background-color": colorConverter(
                    userinfo.genres[eachGenre]
                  ),
                } as React.CSSProperties
              }
            >
              {eachGenre}{" "}
              <span
                onClick={() => {
                  addGenreToBook({
                    type: "remove",
                    book_id: id,
                    data: eachGenre,
                  });
                }}
              >
                x
              </span>
            </p>
          ))}
      </div>
    );
  } else return null;
};

export default GenreBanner;
