import React, { useRef, useState, useContext, useEffect } from "react";
import { KTON_CONTEXT } from "../../context/KTONContext";
import genericModalStyles from "../../styles/Components/Modal.module.scss";
import { useRouter } from "next/router";
import scrollToElementWithText from "@/helpers/ScrollToHighlight";
import cleanAuthor from "@/helpers/cleanAuthor";
import Modal_Centered_Select from "./Modal_Centered_Select";

interface Modal_Book_SearchProps {
  closeModal: () => void;
}

const Modal_Book_Search = ({ closeModal }: Modal_Book_SearchProps) => {
  const router = useRouter();
  const { books } = useContext(KTON_CONTEXT);
  const [searchValue, setSearchValue] = useState("");
  const libraryRoute = router.pathname === "/Library";
  const bookRoute = router.pathname.includes("/Book/");

  //Get book id from url
  const idMatch = router.asPath.match(/\/Book\/([a-fA-F0-9]+)/);
  const bookId = idMatch ? idMatch[1] : null;

  //Display Author Modal
  const [displayAuthorModal, setDisplayAuthorModal] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState("");

  let book;

  useEffect(() => {
    //Auto focus on input
    const input = document.getElementById("autoFocus");
    if (input) {
      input.focus();
    }

    //Add overflow hidden to element behind when modal is open
    const scrollHalf = libraryRoute
      ? document.getElementById("Library")
      : document.getElementById("scrollHighlight");

    if (scrollHalf) {
      scrollHalf.style.overflow = "hidden";
      return () => {
        scrollHalf.style.overflow = "auto";
      };
    }
  }, []);

  //Both routes require books to be loaded
  if (!books) return null;

  //If on the book route, find the book
  if (bookId) {
    book = books.find((eachBook) => eachBook._id === bookId);
  }

  //Check if passed author has multiple books
  const checkIfAuthorHasMultipleBooks = (author: string) => {
    const authorBooks = books.filter((eachBook) => eachBook.author === author);
    if (authorBooks.length === 1) {
      router.push(`/Book/${authorBooks[0]._id}`);
    } else {
      setDisplayAuthorModal(true);
      setSelectedAuthor(author);
    }
  };

  return (
    <>
      {displayAuthorModal && (
        <Modal_Centered_Select
          optionsData={books.filter(
            (eachBook) => eachBook.author === selectedAuthor
          )}
          closeModal={() => setDisplayAuthorModal(false)}
        />
      )}
      <div
        className={`${genericModalStyles.modal} ${genericModalStyles.Modal_Book_Search}`}
      >
        <div className={genericModalStyles.mobileHeader}>
          <h3>{libraryRoute ? "Find Book" : "Find Highlight"}</h3>
          <h3 onClick={() => closeModal()} id={genericModalStyles.done}>
            done
          </h3>
        </div>
        <div className={genericModalStyles.searchSection}>
          <input
            type="text"
            placeholder={
              libraryRoute
                ? "Search by book, or author"
                : "Searh for a highlight"
            }
            id="autoFocus"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        {
          //If on the library route, show books and authors
        }
        {libraryRoute && (
          <>
            {
              //Show book titles
            }
            {books.filter((eachBook) =>
              eachBook.title
                .toLocaleUpperCase()
                .includes(searchValue.toLocaleUpperCase())
            ).length !== 0 && (
              <div className={genericModalStyles.listItemType}>
                <h2>Book Titles</h2>
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
            {
              //Show authors
            }
            {books.filter((eachBook) =>
              eachBook.author
                .toLocaleUpperCase()
                .includes(searchValue.toLocaleUpperCase())
            ).length !== 0 && (
              <div className={genericModalStyles.listItemType}>
                <h2>Authors</h2>
              </div>
            )}
            {libraryRoute &&
              [
                ...new Set(
                  books
                    .filter((eachBook) =>
                      eachBook.author
                        .toLocaleUpperCase()
                        .includes(searchValue.toLocaleUpperCase())
                    )
                    .map((eachBook) => eachBook.author)
                ),
              ].map((eachItem, i) => (
                <div
                  key={i}
                  className={`${genericModalStyles.listItem}`}
                  onClick={() => {
                    checkIfAuthorHasMultipleBooks(eachItem);
                  }}
                >
                  <p>{cleanAuthor(eachItem)}</p>
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
