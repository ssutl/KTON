import styles from "../../styles/Components/Highlight.module.scss";
import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback,
} from "react";
import { KTON_CONTEXT } from "../../context/KTONContext";
import { Book_highlight } from "@/api/Interface";
import TagIcon from "@mui/icons-material/Tag";
import NotesIcon from "@mui/icons-material/Notes";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShareIcon from "@mui/icons-material/Share";
import TextareaAutosize from "react-textarea-autosize";
import { useRouter } from "next/router";
import useOutsideAlerter from "@/helpers/ClickOutsideFunction";
import HandleChanges from "@/helpers/HandleChanges";
import ShareOverlay from "./ShareOverlay";
import { Tooltip } from "react-tooltip";
import Modal_Add_Genre from "../Modals/Modal_Add_Genre";
import Modal_Add_Category from "../Modals/Modal_Add_Category";

interface highlightProps {
  highlight: Book_highlight;
  setLoginModal: () => void;
  index: number;
}

const Highlight = ({ highlight, index }: highlightProps) => {
  const [screenWidth, setScreenWidth] = useState<number | undefined>(undefined);
  const {
    favouriteHighlight,
    deleteHighlight,
    annotateHighlight,
    addCategoryToHighlight,
    addCategoryToUser,
  } = HandleChanges();
  const [annotationDropdown, setAnnotationDropdown] = useState<boolean>(false);
  const [inputAnnotation, setInputAnnotation] = useState(highlight.notes);
  const [displayShareOverlay, setDisplayShareOverlay] = useState(false);
  const [displayCategoryModal, setDisplayCategoryModal] = useState(false);

  //Refrence to the dropdowns and their buttons
  const tagButtonRef = useRef(null);
  const notesDropDownRef = useRef(null);
  const notesButtonRef = useRef(null);
  const router = useRouter();
  const book_id = router.query.id as string;

  //Modal Positon
  const [divAboveHalf, setDivAboveHalf] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    //Have to set screenwidth to disable share feature for mobile
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", () => handleResize());

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //Need to save highlight whenever the user clicks the enter key
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      annotateHighlight({
        data: inputAnnotation,
        book_id,
        highlight_id: highlight._id,
      });
    }
  };

  const closeModal = () => {
    setDisplayShareOverlay(false);
  };

  //Drop down annotation section for each highlight
  const annotationSection = () => {
    return (
      <div className={styles.annotationDropdown} ref={notesDropDownRef}>
        <TextareaAutosize
          value={inputAnnotation}
          placeholder="Add a quick summary here"
          onChange={(e) => setInputAnnotation(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className={styles.buttonsSection}>
          <p
            onClick={() => {
              annotateHighlight({
                data: inputAnnotation,
                book_id,
                highlight_id: highlight._id,
              });
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
  useOutsideAlerter(notesDropDownRef, setAnnotationDropdown, notesButtonRef);

  //Determining the position of the highlight
  function determineHighlightPosition(
    event: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) {
    const windowHeight = window.innerHeight;
    const clickedDiv = event.currentTarget;

    const divRect = clickedDiv.getBoundingClientRect();
    const divTop = divRect.top;
    const divHeight = divRect.height;

    const divCenterY = divTop + divHeight / 2;
    const isAboveHalfway = divCenterY < windowHeight / 2;

    if (isAboveHalfway) {
      setDivAboveHalf(true);
    } else {
      setDivAboveHalf(false);
    }
  }

  if (!screenWidth) return null;

  return (
    <>
      {displayShareOverlay && (
        <ShareOverlay
          closeModal={closeModal}
          highlightText={highlight.Text}
          index={index}
        />
      )}
      <div className={styles.Highlight} id={`highlight-${index}`}>
        <div className={styles.mainHalf}>
          <h2>{highlight.Text}</h2>
          <h3>{highlight.notes}</h3>
          {!highlight.category.length ? null : (
            //Displaying tags in tags holder
            <div className={styles.tagsBanner}>
              {highlight.category.map((eachCategory, i) => (
                <p key={i} className={styles.tag}>
                  {eachCategory}{" "}
                  <span
                    onClick={() => {
                      addCategoryToHighlight({
                        type: "remove",
                        data: eachCategory,
                        book_id,
                        highlight_id: highlight._id,
                      });
                    }}
                  >
                    x
                  </span>
                </p>
              ))}
            </div>
          )}
          {
            //These are the options that appear at the bottom of each highlight, allowing you to edit it
          }
          <div className={styles.highlightOptions}>
            {
              //Annotate option
            }
            <p
              className={styles.highlightButton}
              onMouseDown={() =>
                //if the dropdown is already set to annotate, then we want to close it
                setAnnotationDropdown(!annotationDropdown)
              }
              data-tooltip-id={`my-tooltip-${index}`}
              data-tooltip-content="Annotate"
            >
              <NotesIcon ref={notesButtonRef} />
            </p>
            {
              //Tag option
            }
            <span>
              <p
                className={styles.highlightButton}
                onMouseDown={
                  (e) => {
                    determineHighlightPosition(e);
                    setDisplayCategoryModal(true);
                  }
                  //if dropdown is already set to categorise, then we want to close it
                }
                data-tooltip-id={`my-tooltip-${index}`}
                data-tooltip-content="Categorise"
              >
                <TagIcon ref={tagButtonRef} />
              </p>
              {displayCategoryModal && (
                <Modal_Add_Category
                  highlight={highlight}
                  closeModal={() => setDisplayCategoryModal(false)}
                  position={divAboveHalf ? "below" : "above"}
                />
              )}
            </span>
            {
              //Favourite option
            }
            <p
              className={styles.highlightButton}
              onMouseDown={() =>
                favouriteHighlight({
                  data: !highlight.starred,
                  book_id,
                  highlight_id: highlight._id,
                })
              }
              data-tooltip-id={`my-tooltip-${index}`}
              data-tooltip-content="Favourite"
            >
              {highlight.starred ? <StarIcon /> : <StarBorderIcon />}
            </p>
            {
              //Share option
            }
            <p
              className={styles.highlightButton}
              onClick={() =>
                screenWidth < 1024
                  ? alert(
                      "This feature is not available on mobile yet (I'm working on it loool, shi not easy). Please use a desktop device."
                    )
                  : setDisplayShareOverlay(true)
              }
              data-tooltip-id={`my-tooltip-${index}`}
              data-tooltip-content="Share"
            >
              <ShareIcon />
            </p>
            {
              //Delete option
            }
            <p
              className={styles.highlightButton}
              onClick={() =>
                deleteHighlight({
                  book_id,
                  highlight_id: highlight._id,
                })
              }
              data-tooltip-id={`my-tooltip-${index}`}
              data-tooltip-content="Delete"
            >
              <DeleteOutlineIcon />
            </p>
          </div>
          {
            //Dropdowns for annotate and categorise
          }
          {annotationDropdown ? annotationSection() : null}
        </div>
        <div className={styles.metaHalf}>
          <p>{new Date(highlight.Date).toDateString()}</p>
          <p>Loc: {highlight.LocationEnd}</p>
        </div>
        <Tooltip
          id={`my-tooltip-${index}`}
          className="toolTip"
          noArrow
          hidden={screenWidth < 1024}
        />
      </div>
    </>
  );
};
export default Highlight;
