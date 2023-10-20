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
import ImgGenerator from "../../../img_gen/src/Components/ImgGenerator/ImgGenerator";
import { Tooltip } from "react-tooltip";
import Modal_Add_Category from "../Modals/Modal_Add_Category";
import { set } from "lodash";

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
  const [lastAnnotation, setLastAnnotation] = useState<string>("");

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

    setInputAnnotation(highlight.notes);

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
      setInputAnnotation("");
      setAnnotationDropdown(false);
    }
  };

  const closeModal = () => {
    setDisplayShareOverlay(false);
  };

  //Drop down annotation section for each highlight
  const annotationSection = () => {
    setTimeout(() => {
      const input = document.getElementById("autFocus");
      if (input) {
        input.focus();
      }
    }, 50);
    return (
      <div className={styles.annotationDropdown} ref={notesDropDownRef}>
        <TextareaAutosize
          id="autFocus"
          value={inputAnnotation}
          placeholder="Add a quick summary here"
          onChange={(e) => setInputAnnotation(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className={styles.buttonsSection}>
          {inputAnnotation.replace(/\s/g, "") !==
            highlight.notes.replace(/\s/g, "") && (
            <p
              onClick={() => {
                annotateHighlight({
                  data: inputAnnotation,
                  book_id,
                  highlight_id: highlight._id,
                });
                setInputAnnotation("");
                setAnnotationDropdown(false);
              }}
            >
              Save
            </p>
          )}
          {inputAnnotation.replace(/\s/g, "") !== "" && (
            <p
              onClick={() => {
                setLastAnnotation(inputAnnotation);
                setInputAnnotation("");
              }}
            >
              Clear
            </p>
          )}
          {lastAnnotation.replace(/\s/g, "") !== "" &&
            inputAnnotation !== lastAnnotation && (
              <p
                onClick={() => {
                  setInputAnnotation(lastAnnotation);
                }}
              >
                Undo clear
              </p>
            )}
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
      {displayShareOverlay && <ImgGenerator />}
      <div className={styles.Highlight} id={`highlight-${index}`}>
        <div className={styles.mainHalf}>
          <h2 id={styles.highlightText}>{highlight.Text}</h2>
          <h3 id={styles.highlightNote}>{highlight.notes}</h3>
          {!highlight.category.length ? null : (
            //Displaying tags in tags holder
            <div className={styles.tagsBanner}>
              {highlight.category.map((eachCategory, i) => (
                <div key={i} className={styles.tag}>
                  <p>{eachCategory} </p>
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
                </div>
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
              onClick={() => setDisplayShareOverlay(true)}
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
