import React, { useRef, useState, useContext, useEffect } from "react";
import { KTON_CONTEXT } from "../../context/KTONContext";
import genericModalStyles from "../../styles/Components/Modal.module.scss";
import genreColors from "@/helpers/sortGenreColors";
import { useRouter } from "next/router";

interface Modal_Filter_SearchProps {
  onItemClick: (item: any) => void;
  selectedFilter: string | undefined;
  closeModal: () => void;
  position: "above" | "below";
}

const Modal_Filter_Search = ({
  onItemClick,
  selectedFilter,
  closeModal,
  position,
}: Modal_Filter_SearchProps) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<string>("");
  const { userinfo, books } = useContext(KTON_CONTEXT);
  const { colorConverter, randomColorGenerator, mapTable } = genreColors();
  const libraryRoute = router.pathname === "/Library";
  //Get book id from url
  const idMatch = router.asPath.match(/\/Book\/([a-fA-F0-9]+)/);
  const bookId = idMatch ? idMatch[1] : null;

  console.log(position);

  const filteredData = books && [
    ...new Set(
      libraryRoute
        ? books
            .map((book) => book.genre)
            .reduce((acc, curr) => acc.concat(curr), [])
            .filter((eachGenre) =>
              eachGenre.toLowerCase().includes(searchValue.toLowerCase())
            )
        : books
            .filter((eachBook) => eachBook._id === bookId)[0]
            .highlights.map((eachHiglight) => eachHiglight.category)
            .reduce((acc, curr) => acc.concat(curr), [])
            .filter((eachGenre) =>
              eachGenre.toLowerCase().includes(searchValue.toLowerCase())
            )
    ),
  ];

  //Add overflow hidden to element behind when modal is open
  useEffect(() => {
    //Add overflow hidden to element behind when modal is open
    const scrollHalf = libraryRoute
      ? document.getElementById("Library")
      : document.getElementById("scrollHighlight");

    if (scrollHalf) {
      scrollHalf.style.overflow = "hidden";
      return () => {
        scrollHalf.style.overflow = "auto";
      };
    }
  }, []);

  return (
    <>
      <div
        className={`${genericModalStyles.modal} ${genericModalStyles.Modal_Filter_Search} ${genericModalStyles[position]}`}
      >
        <div className={genericModalStyles.mobileHeader}>
          <h3>Filter by...</h3>
          <h3 onClick={() => closeModal()} id={genericModalStyles.done}>
            done
          </h3>
        </div>
        <div className={genericModalStyles.searchSection}>
          <input
            type="text"
            placeholder={"Filter by genre.."}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        {filteredData &&
          filteredData.map((eachItem, i) => (
            <div
              key={i}
              className={`${genericModalStyles.listItem} ${
                genericModalStyles.hoverItem
              } ${
                selectedFilter === eachItem
                  ? genericModalStyles.selectedItem
                  : ""
              }`}
              onClick={() => {
                //If type is filter search, then set the filter
                if (selectedFilter === eachItem) {
                  onItemClick!(undefined);
                } else {
                  onItemClick!(eachItem);
                }
              }}
            >
              {userinfo && (
                <div
                  style={
                    libraryRoute
                      ? ({
                          "--background-color": colorConverter(
                            userinfo.genres[eachItem]
                          ),
                        } as React.CSSProperties)
                      : {
                          backgroundColor: "#769f9d",
                        }
                  }
                  className={genericModalStyles.tag}
                >
                  <p>{eachItem}</p>
                </div>
              )}
            </div>
          ))}
      </div>
      <div
        className={genericModalStyles.modalBackground}
        onClick={() => closeModal()}
      />
    </>
  );
};
export default Modal_Filter_Search;
