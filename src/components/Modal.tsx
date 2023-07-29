import { Book } from "@/api/Interface";
import React, {
  useRef,
  useState,
  useContext,
  useEffect,
  SetStateAction,
} from "react";
import { useRouter } from "next/router";
import styles from "../styles/Modal.module.scss";
import userAuthenticated from "@/helpers/UserAuthenticated";
import { KTON_CONTEXT } from "../context/KTONContext";
import genreColors from "@/helpers/sortGenreColors";
import HandleChanges from "@/helpers/HandleChanges";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { spec } from "node:test/reporters";

interface ModalProps {
  specific_type:
    | "Book_Search"
    | "Filter_Search"
    | "Select"
    | "Add_Genre"
    | "Type_Save";
  closeModal: () => void;
  mainBooks?: Book[];
  onItemClick?: (item: any) => void;
  data?: string[];
  mainBook?: Book;
  selectedFilter?: string;
  selectedSort?: "Recent" | "Rating" | "Oldest";
}

const Modal = ({
  closeModal,
  mainBooks,
  onItemClick,
  specific_type,
  data,
  mainBook,
  selectedFilter,
  selectedSort,
}: ModalProps) => {
  const router = useRouter();
  const modalRef = useRef(null);
  const { colorConverter, randomColorGenerator, mapTable } = genreColors();
  const { userinfo } = useContext(KTON_CONTEXT);
  const [searchValue, setSearchValue] = useState("");
  const [restrictions, setRestricitons] = useState<boolean>(true);
  const { addGenreToBook, addGenreToUser, updateBookCover } = HandleChanges();
  const [randomColor, setRandomColor] = useState(randomColorGenerator());

  //When the genreInput changes, we want to change the color of the randomColor
  useEffect(() => {
    if (searchValue === "") {
      setRandomColor(randomColorGenerator());
    }
  }, [searchValue]);

  //Initialising App by making data call on page load, this updates user context
  useEffect(() => {
    setRestricitons(!userAuthenticated());
  }, []);

  const filteredData =
    specific_type === "Book_Search"
      ? mainBooks &&
        mainBooks
          .slice(
            0,
            restrictions ? Math.round(mainBooks.length / 2) : mainBooks.length
          )
          .filter((book) =>
            book.title.toLowerCase().includes(searchValue.toLowerCase())
          )
      : specific_type === "Filter_Search"
      ? mainBooks && [
          ...new Set(
            mainBooks
              .map((book) => book.genre)
              .reduce((acc, curr) => acc.concat(curr), [])
              .filter((eachGenre) =>
                eachGenre.toLowerCase().includes(searchValue.toLowerCase())
              )
          ),
        ]
      : specific_type === "Add_Genre" && userinfo
      ? Object.keys(userinfo.genres).filter((eachGenre) =>
          eachGenre.toLowerCase().includes(searchValue.toLowerCase())
        )
      : data!;

  return (
    <>
      <div
        className={`${styles.modal} ${styles[specific_type]}`}
        ref={modalRef}
      >
        {specific_type !== "Select" && (
          <div className={styles.searchSection}>
            <input
              type="text"
              placeholder={
                specific_type === "Type_Save"
                  ? "Input an image URL"
                  : specific_type === "Filter_Search"
                  ? "Search for a genre"
                  : specific_type === "Add_Genre"
                  ? "Search for a genre, or type in your own"
                  : "Search for a book"
              }
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        )}
        {specific_type !== "Type_Save" &&
          filteredData &&
          filteredData.map((eachItem, i) => (
            <div
              key={i}
              className={`${styles.listItem} ${
                selectedFilter === eachItem || selectedSort === eachItem
                  ? styles.selectedItem
                  : ""
              } ${styles.spaceBetween}`}
              onClick={() => {
                if (
                  typeof eachItem !== "string" &&
                  specific_type === "Book_Search"
                ) {
                  //If type is book search, then redirect to book page
                  router.push(`/Book/${eachItem._id}`);
                } else if (
                  specific_type === "Filter_Search" &&
                  typeof eachItem === "string"
                ) {
                  //If type is filter search, then set the filter
                  if (selectedFilter === eachItem) {
                    onItemClick!(undefined);
                  } else {
                    onItemClick!(eachItem);
                  }
                } else if (
                  specific_type === "Select" &&
                  typeof eachItem === "string"
                ) {
                  if (selectedSort === eachItem && selectedSort !== "Recent") {
                    onItemClick!("Recent");
                  } else if (
                    selectedSort === eachItem &&
                    selectedSort === "Recent"
                  ) {
                    onItemClick!("Oldest");
                  } else {
                    onItemClick!(eachItem);
                  }
                } else if (
                  specific_type === "Add_Genre" &&
                  typeof eachItem === "string" &&
                  mainBook
                ) {
                  if (!mainBook.genre.includes(eachItem)) {
                    addGenreToBook({
                      type: "add",
                      data: eachItem,
                      book_id: mainBook._id,
                    });
                  }
                }
              }}
            >
              {(specific_type === "Filter_Search" ||
                specific_type === "Add_Genre") &&
              typeof eachItem === "string" &&
              userinfo ? (
                <>
                  <div
                    style={
                      {
                        "--background-color": colorConverter(
                          userinfo.genres[eachItem]
                        ),
                      } as React.CSSProperties
                    }
                    className={styles.tag}
                  >
                    <p>{eachItem}</p>
                  </div>
                  {specific_type === "Add_Genre" && mainBook && (
                    <DeleteOutlineIcon
                      id={styles.trashIcon}
                      onClick={(e) => {
                        e.stopPropagation();
                        addGenreToUser({
                          type: "remove",
                          data: eachItem,
                          book_id: mainBook._id,
                        });
                      }}
                    />
                  )}
                </>
              ) : (
                <p>
                  {typeof eachItem !== "string" ? eachItem.title : eachItem}
                </p>
              )}
            </div>
          ))}
        {userinfo &&
          mainBook &&
          specific_type === "Add_Genre" &&
          !Object.keys(userinfo.genres)
            .map((eachGenre) => eachGenre.toLowerCase())
            .includes(searchValue.toLowerCase()) &&
          searchValue !== "" && (
            <div
              className={styles.listItem}
              onClick={() => {
                console.log("Adding genre to user", searchValue, mainBook._id);
                addGenreToUser({
                  type: "add",
                  data: searchValue,
                  book_id: mainBook._id,
                  color: randomColor.color,
                });
              }}
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
                <p>{searchValue}</p>
              </div>
            </div>
          )}
        {specific_type === "Type_Save" && (
          <div className={styles.buttonSection}>
            <p
              className={styles.button}
              onClick={() => {
                if (searchValue.length) {
                  updateBookCover({
                    book_id: mainBook!._id,
                    data: searchValue,
                  });
                  closeModal();
                } else {
                  alert("Invalid image URL");
                }
              }}
            >
              Save
            </p>
          </div>
        )}
      </div>

      <div className={styles.modalBackground} onClick={() => closeModal()} />
    </>
  );
};

export default Modal;
