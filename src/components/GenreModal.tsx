import { userInfo } from "@/api/Interface";
import { KTON_CONTEXT } from "../context/KTONContext";
import React, { useState, useEffect, useContext, useRef } from "react";
import addGenreToBookApi from "@/api/Books/AddGenreToBook";
import { useRouter } from "next/router";
import styles from "@/styles/GenreModal.module.scss";
import genreColors from "@/helpers/sortGenreColors";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import HandleChanges from "@/helpers/HandleChanges";

const GenreModal: React.FC<{ refrence: any }> = ({ refrence }) => {
  const router = useRouter();
  const { addGenreToBook, addGenreToUser } = HandleChanges();
  const { books, userinfo, updateBooks, updateUserInfo } =
    useContext(KTON_CONTEXT);
  const [genreInput, setGenreInput] = useState<string>("");
  const id = router.query.id;
  const mainBook = books!.filter((book) => book._id === id)[0];
  const { colorConverter, randomColorGenerator, mapTable } = genreColors();
  const [randomColor, setRandomColor] = useState(randomColorGenerator());
  const [displayGenreDropdown, setDisplayGenreDropdown] = useState<boolean>();

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
                  addGenreToBook({
                    type: "add",
                    data: eachGenre,
                    book_id: id,
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
                addGenreToUser({
                  type: "add",
                  data: genreInput,
                  book_id: id,
                  color: randomColor.color,
                })
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
