import styles from "../styles/Highlight.module.scss";
import React, { useEffect, useState, useRef } from "react";
import { Book_highlight } from "@/api/Interface";
import userAuthenticated from "@/helpers/UserAuthenticated";
import ShareIcon from "@mui/icons-material/Share";
import TagIcon from "@mui/icons-material/Tag";
import NotesIcon from "@mui/icons-material/Notes";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TextareaAutosize from "react-textarea-autosize";
import favouriteHighlightApi from "@/api/Highlights/Favourite";
import { useRouter } from "next/router";
import deleteHighlightApi from "@/api/Highlights/Delete";
import annotateHighlightApi from "@/api/Highlights/Annotate";
import useOutsideAlerter from "@/helpers/ClickOutsideFunction";
import HandleLoginModal from "@/components/HandleLoginModal";

interface highlightProps {
  highlight: Book_highlight;
  setModal: () => void;
}

const Highlight = ({ highlight, setModal }: highlightProps) => {
  const [restrictions, setRestrictions] = useState(true);
  //Setting the state of the highlight from what is passed in from the context, i.e the db, allowing it to be locally updated
  const [deleted, setDeleted] = useState(highlight.deleted);
  const [favourited, setFavourited] = useState(highlight.starred);
  const [displayAnnotation, setDisplayAnnotation] = useState(false);
  const [inputAnnotation, setInputAnnotation] = useState(highlight.notes);
  const [annotation, setAnnotation] = useState(highlight.notes);
  const highlightRef = useRef(null);
  const router = useRouter();
  const book_id = router.query.id;

  //Set restrictions on page load
  useEffect(() => {
    setRestrictions(!userAuthenticated());
  }, []);

  //Function to handle when the user clicks favourite button
  const handleFavourite = () => {
    //Handling request locally
    setFavourited(!favourited);
    //Handling request on server
    favouriteHighlightApi({
      book_id,
      highlight_id: highlight._id,
      data: !favourited,
    });
  };

  //Function to handle when the user clicks delete button
  const handleDelete = () => {
    //Handling request locally
    setDeleted(true);
    //Handling request on server
    deleteHighlightApi({
      book_id,
      highlight_id: highlight._id,
      data: true,
    });
  };

  //Function to handle when the user clicks annotate button
  const handleAnnotate = () => {
    //Handling request locally
    setAnnotation(inputAnnotation);

    //Handling request on server
    annotateHighlightApi({
      book_id,
      highlight_id: highlight._id,
      data: inputAnnotation,
    });

    //Clearing input
    setInputAnnotation("");
    setDisplayAnnotation(false);
  };

  //Need to save highlight whenever the user clicks the enter key
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAnnotate();
    }
  };

  //Drop down annotation section for each highlight
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

  //Attaching click outside function to highlight
  useOutsideAlerter(highlightRef, setDisplayAnnotation);

  //If highlight is not deleted, display it
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
                  ? setModal()
                  : setDisplayAnnotation(!displayAnnotation)
              }
            >
              <NotesIcon />
            </p>
            <p onClick={() => (restrictions ? setModal() : null)}>
              <TagIcon />
            </p>
            <p onClick={() => (restrictions ? setModal() : handleFavourite())}>
              {favourited ? <StarIcon /> : <StarBorderIcon />}
            </p>
            <p onClick={() => (restrictions ? setModal() : null)}>
              <ShareIcon />
            </p>
            <p onClick={() => (restrictions ? setModal() : handleDelete())}>
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
