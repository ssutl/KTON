import TextareaAutosize from "react-textarea-autosize";
import styles from "../styles/SummarySection.module.scss";
import { KTON_CONTEXT } from "../../context/KTONContext";
import React, { useState, useEffect, useContext, useRef } from "react";
import { useRouter } from "next/router";
import HandleChanges from "@/helpers/HandleChanges";

const SummarySection = () => {
  const router = useRouter();
  const id = router.query.id;
  const { books } = useContext(KTON_CONTEXT);
  //Setting the summary to the current summary of the book on load
  const [inputSummary, setInputSummary] = useState<string | undefined>(
    books?.filter((book) => book._id === id)[0].summary
  );
  const { addSummaryToBook } = HandleChanges();

  //Handling when user presses enter to save summary
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addSummaryToBook({ data: inputSummary, book_id: id });
    }
  };

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
            addSummaryToBook({ data: inputSummary, book_id: id });
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
