import React, { useRef, useState, useContext, useEffect } from "react";
import { KTON_CONTEXT } from "../../context/KTONContext";
import genericModalStyles from "../../styles/Components/Modal.module.scss";
import { useRouter } from "next/router";

interface Modal_Book_SearchProps {
  closeModal: () => void;
}

const Modal_Book_Search = ({ closeModal }: Modal_Book_SearchProps) => {
  const router = useRouter();
  const { userinfo, books } = useContext(KTON_CONTEXT);
  const [searchValue, setSearchValue] = useState("");

  if (!books) return null;

  return (
    <>
      <div
        className={`${genericModalStyles.modal} ${genericModalStyles.Modal_Book_Search}`}
      >
        <div className={genericModalStyles.header}>
          <h3>Find book</h3>
        </div>
        <div className={genericModalStyles.searchSection}>
          <input
            type="text"
            placeholder={"Search for a book"}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
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
      </div>
      <div
        className={genericModalStyles.modalBackground}
        onClick={() => closeModal()}
      />
    </>
  );
};
export default Modal_Book_Search;
