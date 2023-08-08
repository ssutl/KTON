import styles from "../../styles/Components/GenreBanner.module.scss";
import { useRouter } from "next/router";
import React, { useState, useContext, useRef } from "react";
import { KTON_CONTEXT } from "../../context/KTONContext";
import genreColors from "@/helpers/sortGenreColors";
import HandleChanges from "@/helpers/HandleChanges";
import Modal_Add_Genre from "../Modals/Modal_Add_Genre";

const GenreBanner = () => {
  const { books, userinfo } = useContext(KTON_CONTEXT);
  const [displayGenreModal, setDisplayGenreModal] = useState(false);
  const { addGenreToBook } = HandleChanges();
  const { colorConverter } = genreColors();
  const router = useRouter();
  const id = router.query.id;

  //If there is no book or userinfo, then return null. User context should have this data, it is checked on page load from parent.
  if (!books || !userinfo) return null;

  let mainBook = books.filter((book) => book._id === id)[0];

  return (
    <div className={styles.genreBanner}>
      <span>
        <p
          onClick={() => {
            setDisplayGenreModal(!displayGenreModal);
          }}
          id={styles.addGenre}
        >
          + Add genre
        </p>
        {displayGenreModal ? (
          <Modal_Add_Genre
            closeModal={() => setDisplayGenreModal(false)}
            mainBook={mainBook}
          />
        ) : null}
      </span>
      {
        //Displaying the genre tags, should just be a display, and when cross is clicked, it should remove the genre from the book
      }
      {mainBook.genre.map((eachGenre, i) => (
        <p
          key={i}
          className={styles.BannerTags}
          style={
            {
              "--background-color": colorConverter(userinfo.genres[eachGenre]),
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
};

export default GenreBanner;
