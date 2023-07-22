import styles from "../styles/Highlight.module.scss";
import React, { useEffect, useState, useRef, useContext } from "react";
import { KTON_CONTEXT } from "../context/KTONContext";
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
import addHighlightCategoryApi from "@/api/Highlights/AddCategories";
import addUserCategoryApi from "@/api/Users/AddCategories";

interface highlightProps {
  highlight: Book_highlight;
  setModal: () => void;
}

const Highlight = ({ highlight, setModal }: highlightProps) => {
  const [screenWidth, setScreenWidth] = useState(1024);
  const [restrictions, setRestrictions] = useState(true);
  //Setting the state of the highlight from what is passed in from the context, i.e the db, allowing it to be locally updated
  const { userinfo } = useContext(KTON_CONTEXT);
  const [deleted, setDeleted] = useState(highlight.deleted);
  const [favourited, setFavourited] = useState(highlight.starred);
  const [userCategories, setUserCategories] = useState(
    userinfo ? userinfo.categories : undefined
  );
  const [HighlightCategories, setHighlightCategories] = useState(
    highlight.category
  );
  const [dropdown, setDropdown] = useState<"Annotate" | "Categorise" | false>(
    false
  );
  const [hoveredOption, setHoveredOption] = useState("");
  const [inputAnnotation, setInputAnnotation] = useState(highlight.notes);
  const [annotation, setAnnotation] = useState(highlight.notes);
  const [categoryInput, setCategoryInput] = useState("");
  const highlightRef = useRef(null);
  const router = useRouter();
  const book_id = router.query.id;

  //Set restrictions on page load
  useEffect(() => {
    setRestrictions(!userAuthenticated());

    //Have to set screenwidth to conditionally change size of heat map
    setScreenWidth(window.innerWidth);
    window.addEventListener("resize", () => setScreenWidth(window.innerWidth));
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
    setDropdown(false);
  };

  //Function to handle when the user clicks annotate button
  const handleAddCategoryToHighlight = ({
    type,
    category,
  }: {
    type: "add" | "remove";
    category: string;
  }) => {
    //Handling request locally
    let data = [...HighlightCategories];

    if (type === "add") {
      data.push(category);
    } else if (type === "remove") {
      data = data.filter((eachCategory) => eachCategory !== category);
    }

    setHighlightCategories(data);

    //Handling request on server
    addHighlightCategoryApi({
      book_id,
      highlight_id: highlight._id,
      data: data,
    });
  };

  const handleAddCategoryToUser = ({
    type,
    category,
  }: {
    type: "add" | "remove";
    category: string;
  }) => {
    //Handling request locally
    if (userinfo) {
      let data = [...userinfo.categories];

      if (type === "add") {
        data.push(category);
      } else if (type === "remove") {
        data = data.filter((eachCategory) => eachCategory !== category);
      }

      setUserCategories(data);

      //Handling request on server
      addUserCategoryApi({
        book_id,
        highlight_id: highlight._id,
        data: data,
      });

      //Also need to add/remove to highlight
      //We could be removing from user categories but it may not be on the highlight, so we need to check before removing and wasting a request
      //When we add to user categories, we also need to add to highlight categories, so we can just add to highlight categories
      if (
        (type === "remove" && HighlightCategories.includes(category)) ||
        (type === "add" && !HighlightCategories.includes(category))
      ) {
        handleAddCategoryToHighlight({ type, category });
      }
    }
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

  //Drop down annotation section for each highlight
  const categorySection = () => {
    if (userCategories) {
      return (
        <div className={styles.categoryDropdown}>
          <div className={styles.searchItem}>
            <input
              placeholder="Search for tags, or type to create..."
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
            />
          </div>
          <div className={styles.categoryScroll}>
            {userCategories
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
                        handleAddCategoryToHighlight({
                          type: "add",
                          category: ExistingCategory,
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
                          handleAddCategoryToUser({
                            type: "remove",
                            category: ExistingCategory,
                          });
                        }
                        //We need to delete from the userInfo history
                      }
                    />
                  ) : null}
                </div>
              ))}
            {!userCategories
              .map((eachGenre) => eachGenre.toLowerCase())
              .includes(categoryInput.toLowerCase()) &&
              categoryInput !== "" && (
                <div
                  className={styles.categoryItem}
                  onClick={() => {
                    handleAddCategoryToUser({
                      type: "add",
                      category: categoryInput,
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
  useOutsideAlerter(highlightRef, setDropdown);

  //If highlight is not deleted, display it
  if (!deleted)
    return (
      <div className={styles.Highlight} ref={highlightRef}>
        <div className={styles.mainHalf}>
          <h2>{highlight.Text}</h2>
          {restrictions ? null : <h3>{annotation}</h3>}
          {restrictions || !HighlightCategories.length
            ? null
            : HighlightCategories.length && (
                <div className={styles.tagsHolder}>
                  {HighlightCategories.map((eachCategory, i) => (
                    <p key={i} className={styles.tag}>
                      {eachCategory}{" "}
                      <span
                        onClick={() => {
                          handleAddCategoryToHighlight({
                            type: "remove",
                            category: eachCategory,
                          });
                        }}
                      >
                        x
                      </span>
                    </p>
                  ))}
                </div>
              )}
          <div className={styles.highlightOptions}>
            <p
              onClick={() =>
                restrictions ? setModal() : setDropdown("Annotate")
              }
            >
              <NotesIcon />
            </p>
            <p
              onClick={() =>
                restrictions ? setModal() : setDropdown("Categorise")
              }
            >
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
          {dropdown === "Annotate"
            ? annotationSection()
            : dropdown === "Categorise"
            ? categorySection()
            : null}
        </div>
        <div className={styles.metaHalf}>
          <p>{new Date(highlight.Date).toDateString()}</p>
        </div>
      </div>
    );
  else return null;
};
export default Highlight;
