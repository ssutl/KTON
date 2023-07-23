import styles from "../styles/GenreBanner.module.scss";
import React, { useState, useEffect, useContext, useRef } from "react";
import HandleLoginModal from "./HandleLoginModal";
import { KTON_CONTEXT } from "../context/KTONContext";
import useOutsideAlerter from "@/helpers/ClickOutsideFunction";
import GenreModal from "./GenreModal";
import genreColors from "@/helpers/sortGenreColors";
import addGenreToBookApi from "@/api/Books/AddGenreToBook";

const GenreBanner: React.FC<{
  id: string | undefined;
}> = ({ id }) => {
  const { books, userinfo, updateBooks } = useContext(KTON_CONTEXT);
  const [displayGenreModal, setDisplayGenreModal] = useState(false);
  const { colorConverter } = genreColors();
  const multiRef = useRef(null);
  const mainBook = books?.filter((book) => book._id === id)[0];

  // /**Custom hook which takes in a ref and a setState action which gets triggered when the user clicks outside of the ref */
  useOutsideAlerter(multiRef, setDisplayGenreModal);

  const handleAddGenreToBook = ({
    type,
    genre,
  }: {
    type: "add" | "remove";
    genre: string;
  }) => {
    //Sorting on Context
    const newState = books!.map((book_context) => {
      if (book_context._id === id) {
        return {
          ...book_context,
          genre:
            type === "add"
              ? [...book_context.genre, genre]
              : book_context.genre.filter((eachGenre) => eachGenre !== genre),
        };
      } else return book_context;
    });
    updateBooks(newState);

    //sorting on server
    addGenreToBookApi({
      book_id: id,
      data: newState.filter((book) => book._id === id)[0].genre,
    });
  };

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
                  handleAddGenreToBook({
                    type: "remove",
                    genre: eachGenre,
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
