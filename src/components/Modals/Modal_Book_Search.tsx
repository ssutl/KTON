import React, { useRef, useState, useContext, useEffect } from "react";
import { KTON_CONTEXT } from "../../context/KTONContext";
import genericModalStyles from "../../styles/Components/Modal.module.scss";
import { useRouter } from "next/router";
import scrollToElementWithText from "@/helpers/ScrollToHighlight";
import cleanAuthor from "@/helpers/cleanAuthor";

interface Modal_Book_SearchProps {
  closeModal: () => void;
}

const Modal_Book_Search = ({ closeModal }: Modal_Book_SearchProps) => {
  const router = useRouter();
  const { userinfo, books } = useContext(KTON_CONTEXT);
  const [searchValue, setSearchValue] = useState("");
  const libraryRoute = router.pathname === "/Library";
  const bookRoute = router.pathname.includes("/Book/");

  const idMatch = router.asPath.match(/\/Book\/([a-fA-F0-9]+)/);
  const bookId = idMatch ? idMatch[1] : null;

  let book;

  //Both routes require books to be loaded
  if (!books) return null;

  //If on the book route, find the book
  if (bookId) {
    book = books.find((eachBook) => eachBook._id === bookId);
  }

  return (
    <>
      <div
        className={`${genericModalStyles.modal} ${genericModalStyles.Modal_Book_Search}`}
      >
        <div className={genericModalStyles.header}>
          <h3>{libraryRoute ? "Find Book" : "Find Highlight"}</h3>
        </div>
        <div className={genericModalStyles.searchSection}>
          <input
            type="text"
            placeholder={
              libraryRoute
                ? "Search by book, or author"
                : "Searh for a highlight"
            }
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        {
          //If on the library route, show books and authors
        }
        {libraryRoute && (
          <>
            {books.filter((eachBook) =>
              eachBook.title
                .toLocaleUpperCase()
                .includes(searchValue.toLocaleUpperCase())
            ).length !== 0 && (
              <div className={genericModalStyles.listItemType}>
                <h3>Book Titles</h3>
              </div>
            )}
            {books
              .filter((eachBook) =>
                eachBook.title
                  .toLocaleUpperCase()
                  .includes(searchValue.toLocaleUpperCase())
              )
              .map((eachItem, i) => (
                <div
                  key={i}
                  className={`${genericModalStyles.listItem}`}
                  onClick={() => {
                    router.push(`/Book/${eachItem._id}`);
                  }}
                >
                  <p>{eachItem.title}</p>
                </div>
              ))}
            {books.filter((eachBook) =>
              eachBook.author
                .toLocaleUpperCase()
                .includes(searchValue.toLocaleUpperCase())
            ).length !== 0 && (
              <div className={genericModalStyles.listItemType}>
                <h3>Authors</h3>
              </div>
            )}
            {libraryRoute &&
              books
                .filter((eachBook) =>
                  eachBook.author
                    .toLocaleUpperCase()
                    .includes(searchValue.toLocaleUpperCase())
                )
                .map((eachItem, i) => (
                  <div
                    key={i}
                    className={`${genericModalStyles.listItem}`}
                    onClick={() => {
                      router.push(`/Book/${eachItem._id}`);
                    }}
                  >
                    <p>{cleanAuthor(eachItem.author)}</p>
                  </div>
                ))}
          </>
        )}
        {
          //If on the book route, show highlights
        }
        {bookRoute &&
          book?.highlights
            .filter((eachHighlight) => eachHighlight.deleted === false)
            .filter((eachHighlight) =>
              eachHighlight.Text.toLocaleUpperCase().includes(
                searchValue.toLocaleUpperCase()
              )
            )
            .map((eachHighlight, i) => (
              <div
                key={i}
                className={`${genericModalStyles.listItem}`}
                onClick={() => {
                  closeModal();

                  setTimeout(() => {
                    scrollToElementWithText(eachHighlight.Text);
                  }, 100);
                }}
              >
                <p>{eachHighlight.Text}</p>
              </div>
            ))}
        {
          //If no resuls are found, show a message
        }
        {libraryRoute &&
          books.filter((eachBook) =>
            eachBook.author
              .toLocaleUpperCase()
              .includes(searchValue.toLocaleUpperCase())
          ).length === 0 &&
          books.filter((eachBook) =>
            eachBook.title
              .toLocaleUpperCase()
              .includes(searchValue.toLocaleUpperCase())
          ).length === 0 && (
            <div className={genericModalStyles.listItemType}>
              <h3>No results found</h3>
            </div>
          )}
        {bookRoute &&
          book?.highlights
            .filter((eachHighlight) => eachHighlight.deleted === false)
            .filter((eachHighlight) =>
              eachHighlight.Text.toLocaleUpperCase().includes(
                searchValue.toLocaleUpperCase()
              )
            ).length === 0 && (
            <div className={genericModalStyles.listItemType}>
              <h3>No results found</h3>
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
export default React.memo(Modal_Book_Search);
