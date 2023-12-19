import React, { useRef, useState, useContext, useEffect } from "react";
import { KTON_CONTEXT } from "../../context/KTONContext";
import genericModalStyles from "../../styles/Components/Modal.module.scss";
import genreColors from "@/helpers/sortGenreColors";
import { Book, Book_highlight, Meta_con_highlight } from "@/api/Interface";
import HandleChanges from "@/helpers/HandleChanges";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useRouter } from "next/router";
import { filter } from "lodash";

interface Modal_Add_CategoryProps {
  highlight: Book_highlight;
  closeModal: () => void;
  position: "above" | "below";
}

const Modal_Add_Category = ({
  highlight,
  closeModal,
  position,
}: Modal_Add_CategoryProps) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const { userinfo, books } = useContext(KTON_CONTEXT);
  const { colorConverter, randomColorGenerator, mapTable } = genreColors();
  const { addCategoryToHighlight, addCategoryToUser } = HandleChanges();
  const [randomColor, setRandomColor] = useState(randomColorGenerator());
  const router = useRouter();
  const book_id = router.query.id;

  const userSubscribed =
    userinfo &&
    userinfo.subscription_end !== null &&
    new Date(userinfo.subscription_end) > new Date();

  //When the genreInput changes, we want to change the color of the randomColor
  useEffect(() => {
    if (searchValue === "") {
      setRandomColor(randomColorGenerator());
    }
  }, [searchValue]);

  const filteredData =
    userinfo &&
    userinfo.categories.filter((eachHighlightCategory) =>
      eachHighlightCategory.toLowerCase().startsWith(searchValue.toLowerCase())
    );

  //Add overflow hidden to element behind when modal is open
  useEffect(() => {
    const scrollHalf = document.getElementById("scrollHighlight");
    if (scrollHalf) {
      scrollHalf.style.overflow = "hidden";
      return () => {
        scrollHalf.style.overflow = "auto";
      };
    }
  }, []);

  if (!userinfo || !filteredData) return null;

  return (
    <>
      <div
        className={`${genericModalStyles.modal} ${genericModalStyles.Modal_Add_Category} ${genericModalStyles[position]}`}
      >
        <div className={genericModalStyles.mobileHeader}>
          <h3>Add Category</h3>
          <h3 onClick={() => closeModal()} id={genericModalStyles.done}>
            done
          </h3>
        </div>
        <div className={genericModalStyles.searchSection}>
          <input
            type="text"
            value={searchValue}
            placeholder={"Search for a genre, or type in your own..."}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        {
          //List of items for all modals except type_save
        }
        {filteredData.map((userInfoCategory, i) => (
          <div
            key={i}
            className={`${genericModalStyles.listItem} ${genericModalStyles.spaceBetween}`}
            onClick={() => {
              //Check if category is already in highlight
              if (!highlight.category.includes(userInfoCategory)) {
                addCategoryToHighlight({
                  type: "add",
                  data: userInfoCategory,
                  book_id,
                  highlight_id: highlight._id,
                });
                setSearchValue("");
              }
            }}
          >
            <div className={genericModalStyles.tag}>
              <p>{userInfoCategory}</p>
            </div>
            <DeleteOutlineIcon
              id={genericModalStyles.trashIcon}
              onClick={(e) => {
                e.stopPropagation();
                addCategoryToUser({
                  type: "remove",
                  data: userInfoCategory,
                  book_id,
                  highlight_id: highlight._id,
                });
              }}
            />
          </div>
        ))}
        {!userinfo.categories.includes(searchValue) && searchValue !== "" && (
          <div
            className={genericModalStyles.listItem}
            onClick={() => {
              if (!userSubscribed && userinfo.categories.length >= 5) {
                closeModal();
                document.getElementById("settingBTN")?.click();
                setTimeout(() => {
                  document.getElementById("Upgrade")?.click();
                }, 20);
              } else {
                addCategoryToUser({
                  type: "add",
                  data: searchValue,
                  book_id,
                  highlight_id: highlight._id,
                });
                setSearchValue("");
              }
            }}
          >
            <p id={genericModalStyles.createText}>
              {!userSubscribed && userinfo.categories.length >= 5
                ? "You have reached the limit of 5 highlight categories, feel free to upgrade to access unlimited category creation!"
                : "Create"}
            </p>
            {!userSubscribed && userinfo.categories.length >= 5 ? null : (
              <div className={genericModalStyles.tag}>
                <p>{searchValue}</p>
              </div>
            )}
          </div>
        )}
      </div>
      <div
        className={genericModalStyles.modalBackground}
        onClick={() => closeModal()}
      />
    </>
  );
};
export default Modal_Add_Category;
