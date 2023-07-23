import { Book } from "@/api/Interface";
import userAuthenticated from "@/helpers/UserAuthenticated";
import React, { useState, useEffect, useContext, useRef } from "react";
import Highlight from "./Highlight";
import HandleLoginModal from "./HandleLoginModal";
import styles from "../styles/HighlightsList.module.scss";

const HighlightsList: React.FC<{ book: Book }> = ({ book }) => {
  const [restrictions, setRestricitons] = useState<boolean>(true);
  const { LoginModal, setModal } = HandleLoginModal();

  useEffect(() => {
    setRestricitons(!userAuthenticated());
  }, []);

  if (book)
    return (
      <>
        {book.highlights
          .slice(0, restrictions ? 50 : book.highlights.length)
          .map((eachHighlight, index) => (
            <Highlight
              highlight={eachHighlight}
              key={index}
              setModal={setModal}
            />
          ))}
        {restrictions && book.highlights.length > 50 ? (
          <div className={styles.highlightRestriction}>
            <h2>
              Your highlights have been limited to 50, login to see your full
              list
            </h2>
          </div>
        ) : null}
      </>
    );
  else null;
};

export default HighlightsList;
