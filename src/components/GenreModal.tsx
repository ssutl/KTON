import { userInfo } from "@/api/Interface";
import { KTON_CONTEXT } from "../context/KTONContext";
import React, { useState, useEffect, useContext, useRef } from "react";
import addGenreToBookApi from "@/api/Books/AddGenreToBook";
import { useRouter } from "next/router";
import styles from "@/styles/GenreModal.module.scss";
import genreColors from "@/helpers/sortGenreColors";
import useOutsideAlerter from "@/helpers/ClickOutsideFunction";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import addGenreToUserApi from "@/api/Users/AddGenre";

const GenreModal: React.FC<{ refrence: any }> = ({ refrence }) => {
  const router = useRouter();
  const { books, userinfo, updateBooks, updateUserInfo } =
    useContext(KTON_CONTEXT);
  const [genreInput, setGenreInput] = useState<string>("");
  const id = router.query.id;
  const mainBook = books!.filter((book) => book._id === id)[0];
  const { colorConverter, randomColorGenerator, mapTable } = genreColors();
  const [randomColor, setRandomColor] = useState(randomColorGenerator());
  const [displayGenreDropdown, setDisplayGenreDropdown] = useState<boolean>();

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

  const handleAddGenreToUser = ({
    type,
    genre,
  }: {
    type: "add" | "remove";
    genre: string;
  }) => {
    if (userinfo) {
      let newState = userinfo;

      if (type === "add") {
        //Add the genre to the userinfo genres
        newState = {
          ...userinfo,
          genres: { ...userinfo.genres, [genre]: randomColor.color },
        };
      } else if (type === "remove") {
        //Filter the userinfo genres to remove the genre and add to newState
        let ghost = userinfo.genres;
        delete ghost[genre];
        newState = { ...userinfo, genres: ghost };
      }

      //sorting locally
      updateUserInfo(newState);

      //Sorting on server
      addGenreToUserApi({ data: newState.genres });

      //We could be removing from user geres but it may not be on the highlight, so we need to check before removing and wasting a request
      //When we add to user genres, we also need to add to book genres, so we can just add to book categories
      if (
        (mainBook && type === "remove" && mainBook.genre.includes(genre)) ||
        (mainBook && type === "add" && !mainBook.genre.includes(genre))
      ) {
        handleAddGenreToBook({ type, genre });
      }
    }
  };

  if (userinfo) {
    return (
      <div className={styles.GenreModal} ref={refrence}>
        <div className={styles.searchItem}>
          <input
            placeholder="Search for genres"
            value={genreInput}
            onChange={(e) => setGenreInput(e.target.value)}
          />
        </div>
        {Object.keys(userinfo.genres)
          .filter((eachGenre) =>
            eachGenre.toLowerCase().includes(genreInput.toLowerCase())
          )
          .map((eachGenre, i) => (
            <div
              key={i}
              className={`${styles.genreItem} ${styles.spaceBetween}`}
              onClick={() => {
                if (!mainBook.genre.includes(eachGenre)) {
                  handleAddGenreToBook({
                    type: "add",
                    genre: eachGenre,
                  });
                }
              }}
            >
              <div
                style={
                  {
                    "--background-color": colorConverter(
                      userinfo.genres[eachGenre]
                    ),
                  } as React.CSSProperties
                }
                className={styles.tag}
              >
                <p>{eachGenre}</p>
              </div>
              <MoreHorizIcon
                className={styles.dotsIcon}
                onClick={() => {
                  setDisplayGenreDropdown(!displayGenreDropdown);
                }}
              />
            </div>
          ))}
        {!Object.keys(userinfo.genres)
          .map((eachGenre) => eachGenre.toLowerCase())
          .includes(genreInput.toLowerCase()) &&
          genreInput !== "" && (
            <div
              className={styles.genreItem}
              onClick={() =>
                handleAddGenreToUser({ type: "add", genre: genreInput })
              }
            >
              <p id={styles.createText}>Create</p>
              <div
                className={styles.tag}
                style={
                  {
                    "--background-color": randomColor.hex,
                  } as React.CSSProperties
                }
              >
                <p>{genreInput}</p>
              </div>
            </div>
          )}
      </div>
    );
  } else return null;
};

export default GenreModal;
