import TextareaAutosize from "react-textarea-autosize";
import styles from "../styles/SummarySection.module.scss";
import { KTON_CONTEXT } from "../context/KTONContext";
import React, { useState, useEffect, useContext, useRef } from "react";
import summariseBookApi from "@/api/Books/Summary";
import HandleLoginModal from "./HandleLoginModal";
import userAuthenticated from "@/helpers/UserAuthenticated";
import HandleChanges from "@/helpers/HandleChanges";
//Random Change

const SummarySection: React.FC<{ id: string | undefined }> = ({ id }) => {
  const { books, userinfo, updateBooks, updateUserInfo } =
    useContext(KTON_CONTEXT);
  const { LoginModal, setModal } = HandleLoginModal();
  const [inputSummary, setInputSummary] = useState<string | undefined>(
    books?.filter((book) => book._id === id)[0].summary
  );
  const [restrictions, setRestricitons] = useState<boolean>(true);
  const { addSummaryToBook } = HandleChanges();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // Perform any action you want to execute when Enter is pressed
      addSummaryToBook({ data: inputSummary, book_id: id });
    }
  };

  useEffect(() => {
    setRestricitons(!userAuthenticated());
  }, []);

  return (
    <div className={styles.summarySection}>
      <TextareaAutosize
        value={inputSummary}
        placeholder="Add a quick summary here"
        onChange={(e) => setInputSummary(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className={styles.buttonsSection}>
        <p
          onClick={() => {
            restrictions
              ? setModal()
              : addSummaryToBook({ data: inputSummary, book_id: id });
          }}
        >
          Save
        </p>
        <p onClick={() => setInputSummary("")}>Clear</p>
      </div>
    </div>
  );
};

export default SummarySection;
