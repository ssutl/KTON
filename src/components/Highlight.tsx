import styles from "../styles/Highlight.module.scss";
import React, { useEffect, useState, useRef } from "react";
import { Book_highlight } from "@/api/Interface";
import userAuthenticated from "@/helpers/UserAuthenticated";
import ShareIcon from "@mui/icons-material/Share";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import TagIcon from "@mui/icons-material/Tag";
import CommentIcon from "@mui/icons-material/Comment";
import NotesIcon from "@mui/icons-material/Notes";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TextareaAutosize from "react-textarea-autosize";

interface highlightProps {
  highlight: Book_highlight;
  index: number;
}

const Highlight = ({ highlight, index }: highlightProps) => {
  const [restrictions, setRestrictions] = useState(true);
  const [deleted, setDeleted] = useState(highlight.deleted);
  const [favourited, setFavourited] = useState(highlight.starred);
  const [displayAnnotation, setDisplayAnnotation] = useState(false);
  const [inputAnnotation, setInputAnnotation] = useState(highlight.notes);
  const [annotation, setAnnotation] = useState(highlight.notes);
  const highlightRef = useRef(null);

  useEffect(() => {
    setRestrictions(!userAuthenticated());
  }, []);

  const loginModal = () => {
    alert("login modal");
  };

  function useOutsideAlerter(
    ref: any,
    modalState: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    useEffect(() => {
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          modalState(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mouseup", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mouseup", handleClickOutside);
      };
    }, [ref]);
  }

  const handleFavourite = () => {
    //Handling request locally
    setFavourited(!favourited);
    //Handling request on server
  };

  const handleDelete = () => {
    //Handling request locally
    setDeleted(true);
    //Handling request on server
  };

  const handleAnnotate = () => {
    setAnnotation(inputAnnotation);
    //Clearing input
    setInputAnnotation("");
    setDisplayAnnotation(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // Perform any action you want to execute when Enter is pressed
      handleAnnotate();
    }
  };

  const annotationSection = () => {
    return (
      <div className={styles.annotationDropdown}>
        <TextareaAutosize
          value={inputAnnotation}
          placeholder="Add a quick summary here"
          onChange={(e) => setInputAnnotation(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className={styles.buttonsSection}>
          <p
            onClick={() => {
              handleAnnotate();
            }}
          >
            Save
          </p>
          <p onClick={() => setInputAnnotation("")}>Clear</p>
        </div>
      </div>
    );
  };

  /**Custom hook which takes in a ref and a setState action which gets triggered when the user clicks outside of the ref */
  useOutsideAlerter(highlightRef, setDisplayAnnotation);

  if (!deleted)
    return (
      <div className={styles.Highlight} ref={highlightRef}>
        <div className={styles.mainHalf}>
          <h2>{highlight.Text}</h2>
          {restrictions ? null : <h3>{annotation}</h3>}
          <div className={styles.highlightOptions}>
            <p
              onClick={() =>
                restrictions
                  ? loginModal()
                  : setDisplayAnnotation(!displayAnnotation)
              }
            >
              <NotesIcon />
            </p>
            <p onClick={() => (restrictions ? loginModal() : null)}>
              <TagIcon />
            </p>
            <p
              onClick={() => (restrictions ? loginModal() : handleFavourite())}
            >
              {favourited ? <StarIcon /> : <StarBorderIcon />}
            </p>
            <p onClick={() => (restrictions ? loginModal() : null)}>
              <ShareIcon />
            </p>
            <p onClick={() => (restrictions ? loginModal() : handleDelete())}>
              <DeleteOutlineIcon />
            </p>
          </div>
          {displayAnnotation ? annotationSection() : null}
        </div>
        <div className={styles.metaHalf}>
          <p>{new Date(highlight.Date).toDateString()}</p>
        </div>
      </div>
    );
  else return null;
};
export default Highlight;
