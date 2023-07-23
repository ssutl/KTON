import { userInfo } from "@/api/Interface";
import { KTON_CONTEXT } from "../context/KTONContext";
import React, { useState, useEffect, useContext, useRef } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/GenreModal.module.scss";
import genreColors from "@/helpers/sortGenreColors";
import HandleChanges from "@/helpers/HandleChanges";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const GenreModal: React.FC<{ refrence: any }> = ({ refrence }) => {
  const { books, userinfo } = useContext(KTON_CONTEXT);
  const router = useRouter();
  const id = router.query.id;
  const mainBook = books!.filter((book) => book._id === id)[0];
  const { addGenreToBook, addGenreToUser } = HandleChanges();
  const [genreInput, setGenreInput] = useState<string>("");
  const { colorConverter, randomColorGenerator, mapTable } = genreColors();
  const [randomColor, setRandomColor] = useState(randomColorGenerator());
  const [displayGenreDropdown, setDisplayGenreDropdown] = useState<boolean>();

  //When the genreInput changes, we want to change the color of the randomColor
  useEffect(() => {
    if (genreInput === "") {
      setRandomColor(randomColorGenerator());
    }
  }, [genreInput]);

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
        {
          //List of the genres that the user has, and the color, when clicked, it will add the genre to the book
        }
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
              <DeleteOutlineIcon
                id={styles.trashIcon}
                onClick={(e) => {
                  e.stopPropagation();
                  addGenreToUser({
                    type: "remove",
                    data: eachGenre,
                    book_id: id,
                  });
                }}
              />
            </div>
          ))}
        {
          //If the user has no genres, allow users to create a genre
        }
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
