import styles from "../styles/GenreBanner.module.scss";
import { useRouter } from "next/router";
import React, { useState, useContext, useRef } from "react";
import { KTON_CONTEXT } from "../context/KTONContext";
import genreColors from "@/helpers/sortGenreColors";
import HandleChanges from "@/helpers/HandleChanges";
import Modal from "./Modal";

const GenreBanner = () => {
  const { books, userinfo } = useContext(KTON_CONTEXT);
  const [displayGenreModal, setDisplayGenreModal] = useState(false);
  const { addGenreToBook } = HandleChanges();
  const { colorConverter } = genreColors();
  const router = useRouter();
  const id = router.query.id;
  let mainBook = books?.filter((book) => book._id === id)[0];
  //Ref for the add genre button

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
        {displayGenreModal ? (
          <Modal
            specific_type="Add_Genre"
            closeModal={() => setDisplayGenreModal(false)}
            mainBooks={books!}
            mainBook={mainBook}
          />
        ) : null}
      </div>
    );
  } else return null;
};

export default GenreBanner;
