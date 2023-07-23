import styles from "../styles/GenreBanner.module.scss";
import { useRouter } from "next/router";
import React, { useState, useContext, useRef } from "react";
import { KTON_CONTEXT } from "../context/KTONContext";
import useOutsideAlerter from "@/helpers/ClickOutsideFunction";
import GenreModal from "./GenreModal";
import genreColors from "@/helpers/sortGenreColors";
import HandleChanges from "@/helpers/HandleChanges";

const GenreBanner = () => {
  const { books, userinfo } = useContext(KTON_CONTEXT);
  const [displayGenreModal, setDisplayGenreModal] = useState(false);
  const { addGenreToBook } = HandleChanges();
  const { colorConverter } = genreColors();
  const multiRef = useRef(null);
  const router = useRouter();
  const id = router.query.id;
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
        {
          //Displaying the genre tags, should just be a display, and when cross is clicked, it should remove the genre from the book
        }
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
