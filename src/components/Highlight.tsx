import styles from "../styles/Highlight.module.scss";
import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback,
} from "react";
import { KTON_CONTEXT } from "../context/KTONContext";
import { Book_highlight } from "@/api/Interface";
import userAuthenticated from "@/helpers/UserAuthenticated";
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

interface highlightProps {
  highlight: Book_highlight;
  setLoginModal: () => void;
  index: number;
}

const Highlight = ({ highlight, setLoginModal, index }: highlightProps) => {
  const { userinfo } = useContext(KTON_CONTEXT);
  const [screenWidth, setScreenWidth] = useState(1024);
  const [restrictions, setRestrictions] = useState(true);
  const {
    favouriteHighlight,
    deleteHighlight,
    annotateHighlight,
    addCategoryToHighlight,
    addCategoryToUser,
  } = HandleChanges();
  const [dropdown, setDropdown] = useState<"Annotate" | "Categorise" | false>(
    false
  );
  const [hoveredOption, setHoveredOption] = useState("");
  const [inputAnnotation, setInputAnnotation] = useState(highlight.notes);
  const [categoryInput, setCategoryInput] = useState("");
  const [displayShareOverlay, setDisplayShareOverlay] = useState(false);

  //Refrence to the dropdowns and their buttons
  const tagDropDownRef = useRef(null);
  const tagButtonRef = useRef(null);
  const notesDropDownRef = useRef(null);
  const notesButtonRef = useRef(null);
  const router = useRouter();
  const book_id = router.query.id;

  //Set restrictions on page load
  useEffect(() => {
    setRestrictions(!userAuthenticated());

    //Have to set screenwidth to conditionally change size of heat map
    setScreenWidth(window.innerWidth);
    window.addEventListener("resize", () => setScreenWidth(window.innerWidth));
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

  //Drop down annotation section for each highlight
  const categorySection = () => {
    if (userinfo?.categories) {
      return (
        <div className={styles.categoryDropdown} ref={tagDropDownRef}>
          <div className={styles.searchItem}>
            <input
              placeholder="Search for tags, or type to create..."
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
            />
          </div>
          <div className={styles.categoryScroll}>
            {userinfo?.categories
              .filter((eachHighlightCategory) =>
                eachHighlightCategory
                  .toLowerCase()
                  .includes(categoryInput.toLowerCase())
              )
              .map((ExistingCategory, index) => (
                <div
                  key={index}
                  className={`${styles.categoryItem} ${styles.spaceBetween}`}
                  onMouseOver={() => setHoveredOption(ExistingCategory)}
                  onMouseLeave={() => setHoveredOption("")}
                >
                  <div
                    className={styles.tag}
                    onClick={() => {
                      //Check if category is already in highlight
                      if (!highlight.category.includes(ExistingCategory)) {
                        addCategoryToHighlight({
                          type: "add",
                          data: ExistingCategory,
                          book_id,
                          highlight_id: highlight._id,
                        });
                      }
                    }}
                  >
                    <p>{ExistingCategory}</p>
                  </div>
                  {hoveredOption === ExistingCategory || screenWidth < 1024 ? (
                    <DeleteOutlineIcon
                      id={styles.trashIcon}
                      onClick={
                        () => {
                          addCategoryToUser({
                            type: "remove",
                            data: ExistingCategory,
                            book_id,
                            highlight_id: highlight._id,
                          });
                        }
                        //We need to delete from the userInfo history
                      }
                    />
                  ) : null}
                </div>
              ))}
            {!userinfo?.categories
              .map((eachGenre) => eachGenre.toLowerCase())
              .includes(categoryInput.toLowerCase()) &&
              categoryInput !== "" && (
                <div
                  className={styles.categoryItem}
                  onClick={() => {
                    addCategoryToUser({
                      type: "add",
                      data: categoryInput,
                      book_id,
                      highlight_id: highlight._id,
                    });
                  }}
                >
                  <p id={styles.createText}>Create</p>
                  <div className={styles.tag}>
                    <p>{categoryInput}</p>
                  </div>
                </div>
              )}
          </div>
        </div>
      );
    } else return null;
  };

  //Attaching click outside function to highlight
  useOutsideAlerter(notesDropDownRef, setDropdown, notesButtonRef);
  useOutsideAlerter(tagDropDownRef, setDropdown, tagButtonRef);

  //If highlight is not deleted, display it
  return (
    <>
      {displayShareOverlay && (
        <ShareOverlay
          closeModal={closeModal}
          highlightText={highlight.Text}
          index={index}
        />
      )}
      <div className={styles.Highlight}>
        <div className={styles.mainHalf}>
          <h2>{highlight.Text}</h2>
          {restrictions ? null : <h3>{highlight.notes}</h3>}
          {restrictions || !highlight.category.length ? null : (
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
              onMouseDown={() =>
                //if the dropdown is already set to annotate, then we want to close it
                restrictions
                  ? setLoginModal()
                  : setDropdown(dropdown === "Annotate" ? false : "Annotate")
              }
              data-tooltip-id={`my-tooltip-${index}`}
              data-tooltip-content="Annotate"
            >
              <NotesIcon ref={notesButtonRef} />
            </p>
            {
              //Tag option
            }
            <p
              onMouseDown={() =>
                //if dropdown is already set to categorise, then we want to close it
                restrictions
                  ? setLoginModal()
                  : setDropdown(
                      dropdown === "Categorise" ? false : "Categorise"
                    )
              }
              data-tooltip-id={`my-tooltip-${index}`}
              data-tooltip-content="Categorise"
            >
              <TagIcon ref={tagButtonRef} />
            </p>
            {
              //Favourite option
            }
            <p
              onMouseDown={() =>
                restrictions
                  ? setLoginModal()
                  : favouriteHighlight({
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
              onClick={() =>
                restrictions
                  ? setLoginModal()
                  : screenWidth < 1024
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
              onClick={() =>
                restrictions
                  ? setLoginModal()
                  : deleteHighlight({
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
          {dropdown === "Annotate"
            ? annotationSection()
            : dropdown === "Categorise"
            ? categorySection()
            : null}
        </div>
        <div className={styles.metaHalf}>
          <p>{new Date(highlight.Date).toDateString()}</p>
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
