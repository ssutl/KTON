import TextareaAutosize from "react-textarea-autosize";
import styles from "../../styles/Components/SummarySection.module.scss";
import { KTON_CONTEXT } from "../../context/KTONContext";
import React, { useState, useEffect, useContext, useRef } from "react";
import { useRouter } from "next/router";
import HandleChanges from "@/helpers/HandleChanges";

const SummarySection = () => {
  const router = useRouter();
  const id = router.query.id;
  const { books } = useContext(KTON_CONTEXT);
  //Setting the summary to the current summary of the book on load
  const bookSummary = books?.filter((book) => book._id === id)[0].summary;
  const [inputSummary, setInputSummary] = useState<string>(
    bookSummary ? bookSummary : ""
  );
  const [lastSummary, setLastSummary] = useState<string>("");
  const { addSummaryToBook } = HandleChanges();

  if (bookSummary === undefined) return;

  return (
    <div className={styles.summarySection}>
      <TextareaAutosize
        value={inputSummary}
        placeholder="Add a quick summary here"
        onChange={(e) => setInputSummary(e.target.value)}
        // onKeyDown={handleKeyDown}
      />
      <div className={styles.buttonsSection}>
        {inputSummary.replace(/\s/g, "") !== bookSummary.replace(/\s/g, "") && (
          <p
            onClick={() => {
              addSummaryToBook({ data: inputSummary, book_id: id });
            }}
          >
            Save
          </p>
        )}
        {inputSummary.replace(/\s/g, "") !== "" && (
          <p
            onClick={() => {
              setLastSummary(inputSummary);
              setInputSummary("");
            }}
          >
            Clear
          </p>
        )}
        {lastSummary.replace(/\s/g, "") !== "" &&
          inputSummary !== lastSummary && (
            <p
              onClick={() => {
                setInputSummary(lastSummary);
              }}
            >
              Undo clear
            </p>
          )}
      </div>
    </div>
  );
};

export default SummarySection;
