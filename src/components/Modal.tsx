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
import useOutsideAlerter from "@/helpers/ClickOutsideFunction";
import userAuthenticated from "@/helpers/UserAuthenticated";
import { KTON_CONTEXT } from "../context/KTONContext";
import genreColors from "@/helpers/sortGenreColors";

interface ModalProps {
  specific_type: "Book_Search" | "Filter_Search" | "Select";
  closeModal: () => void;
  mainBooks: Book[];
  onItemClick?: (item: any) => void;
  position: { x: number; y: number };
  data?: string[];
}

const Modal = ({
  closeModal,
  mainBooks,
  onItemClick,
  position,
  specific_type,
  data,
}: ModalProps) => {
  const router = useRouter();
  const modalRef = useRef(null);
  const { colorConverter, randomColorGenerator, mapTable } = genreColors();
  useOutsideAlerter(modalRef, closeModal);
  const { userinfo } = useContext(KTON_CONTEXT);
  const [searchValue, setSearchValue] = useState("");
  const [restrictions, setRestricitons] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<string | undefined>();
  const [selectedSort, setSelectedSort] = useState<
    "Recent" | "Rating" | "Oldest"
  >("Recent");

  //Initialising App by making data call on page load, this updates user context
  useEffect(() => {
    setRestricitons(!userAuthenticated());
  }, []);

  const filteredData =
    specific_type === "Book_Search"
      ? mainBooks
          .slice(
            0,
            restrictions ? Math.round(mainBooks.length / 2) : mainBooks.length
          )
          .filter((book) =>
            book.title.toLowerCase().includes(searchValue.toLowerCase())
          )
      : specific_type === "Filter_Search"
      ? [
          ...new Set(
            mainBooks
              .map((book) => book.genre)
              .reduce((acc, curr) => acc.concat(curr), [])
              .filter((eachGenre) =>
                eachGenre.toLowerCase().includes(searchValue.toLowerCase())
              )
          ),
        ]
      : data!;

  return (
    <div
      className={`${styles.modal} ${styles[specific_type]} `}
      ref={modalRef}
      style={{ top: `${position.y}%`, right: `${position.x}%` }}
    >
      {(specific_type === "Book_Search" ||
        specific_type === "Filter_Search") && (
        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      )}
      {filteredData.map((eachItem, i) => (
        <div
          key={i}
          className={`${styles.listItem} ${
            selectedFilter === eachItem || selectedSort === eachItem
              ? styles.selectedItem
              : ""
          }`}
          onClick={() => {
            if (typeof eachItem !== "string") {
              router.push(`/Book/${eachItem._id}`);
            } else if (specific_type === "Filter_Search") {
              if (selectedFilter === eachItem) {
                setSelectedFilter(undefined);
                onItemClick!(undefined);
              } else {
                setSelectedFilter(eachItem);
                onItemClick!(eachItem);
              }
            } else if (specific_type === "Select") {
              if (selectedSort === eachItem && selectedSort !== "Recent") {
                setSelectedSort("Recent");
                onItemClick!("Recent");
              } else if (
                selectedSort === eachItem &&
                selectedSort === "Recent"
              ) {
                setSelectedSort("Oldest");
                onItemClick!("Oldest");
              } else {
                setSelectedSort(
                  eachItem as SetStateAction<"Recent" | "Rating" | "Oldest">
                );
                onItemClick!(eachItem);
              }
            }
          }}
        >
          {specific_type === "Filter_Search" &&
          typeof eachItem === "string" &&
          userinfo ? (
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
          ) : (
            <p>{typeof eachItem !== "string" ? eachItem.title : eachItem}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Modal;
