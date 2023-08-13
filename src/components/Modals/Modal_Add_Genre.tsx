import React, { useRef, useState, useContext, useEffect } from "react";
import { KTON_CONTEXT } from "../../context/KTONContext";
import genericModalStyles from "../../styles/Components/Modal.module.scss";
import genreColors from "@/helpers/sortGenreColors";
import { Book } from "@/api/Interface";
import HandleChanges from "@/helpers/HandleChanges";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface Modal_Add_GenreProps {
  mainBook: Book;
  closeModal: () => void;
}

const Modal_Add_Genre = ({ mainBook, closeModal }: Modal_Add_GenreProps) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const { userinfo, books } = useContext(KTON_CONTEXT);
  const { colorConverter, randomColorGenerator, mapTable } = genreColors();
  const { addGenreToBook, addGenreToUser, updateBookCover } = HandleChanges();
  const [randomColor, setRandomColor] = useState(randomColorGenerator());

  useEffect(() => {
    //Auto focus on input
    const input = document.getElementById("autoFocus");
    if (input) {
      input.focus();
    }

    //Add overflow hidden to element behind when modal is open
    const scrollHalf = document.getElementById("scrollHighlight");

    if (scrollHalf) {
      scrollHalf.style.overflow = "hidden";
      return () => {
        scrollHalf.style.overflow = "auto";
      };
    }
  }, []);

  //When the genreInput changes, we want to change the color of the randomColor
  useEffect(() => {
    if (searchValue === "") {
      setRandomColor(randomColorGenerator());
    }
  }, [searchValue]);

  const filteredData =
    userinfo &&
    Object.keys(userinfo.genres).filter((eachGenre) =>
      eachGenre.toLowerCase().includes(searchValue.toLowerCase())
    );

  if (!userinfo || !filteredData) return null;
  return (
    <>
      <div
        className={`${genericModalStyles.modal} ${genericModalStyles.Modal_Add_Genre}`}
      >
        <div className={genericModalStyles.header}>
          <h3>Select or create genre</h3>
        </div>

        <div className={genericModalStyles.searchSection}>
          <input
            type="text"
            placeholder={"Search for a genre, or type in your own..."}
            id="autoFocus"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        {
          //List of items for all modals except type_save
        }
        {filteredData.map((eachItem, i) => (
          <div
            key={i}
            className={`${genericModalStyles.listItem} ${genericModalStyles.spaceBetween}`}
            onClick={() => {
              if (!mainBook.genre.includes(eachItem)) {
                addGenreToBook({
                  type: "add",
                  data: eachItem,
                  book_id: mainBook._id,
                });
              }
            }}
          >
            <div
              style={
                {
                  "--background-color": colorConverter(
                    userinfo.genres[eachItem]
                  ),
                } as React.CSSProperties
              }
              className={genericModalStyles.tag}
            >
              <p>{eachItem}</p>
            </div>
            <DeleteOutlineIcon
              id={genericModalStyles.trashIcon}
              onClick={(e) => {
                e.stopPropagation();
                addGenreToUser({
                  type: "remove",
                  data: eachItem,
                  book_id: mainBook._id,
                });
              }}
            />
          </div>
        ))}
        {!filteredData.length && searchValue !== "" && (
          <div
            className={genericModalStyles.listItem}
            onClick={() => {
              addGenreToUser({
                type: "add",
                data: searchValue,
                book_id: mainBook._id,
                color: randomColor.color,
              });
            }}
          >
            <p id={genericModalStyles.createText}>Create</p>
            <div
              className={genericModalStyles.tag}
              style={
                {
                  "--background-color": randomColor.hex,
                } as React.CSSProperties
              }
            >
              <p>{searchValue}</p>
            </div>
          </div>
        )}
      </div>
      <div
        className={genericModalStyles.modalBackground}
        onClick={() => closeModal()}
      />
    </>
  );
};
export default Modal_Add_Genre;
