import React, { useRef, useState, useContext, useEffect } from "react";
import { KTON_CONTEXT } from "../context/KTONContext";
import genericModalStyles from "../styles/Modal.module.scss";
import genreColors from "@/helpers/sortGenreColors";

interface Modal_Filter_SearchProps {
  onItemClick: (item: any) => void;
  selectedFilter: string | undefined;
  closeModal: () => void;
}

const Modal_Filter_Search = ({
  onItemClick,
  selectedFilter,
  closeModal,
}: Modal_Filter_SearchProps) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const { userinfo, books } = useContext(KTON_CONTEXT);
  const { colorConverter, randomColorGenerator, mapTable } = genreColors();

  const filteredData = books && [
    ...new Set(
      books
        .map((book) => book.genre)
        .reduce((acc, curr) => acc.concat(curr), [])
        .filter((eachGenre) =>
          eachGenre.toLowerCase().includes(searchValue.toLowerCase())
        )
    ),
  ];

  return (
    <>
      <div
        className={`${genericModalStyles.modal} ${genericModalStyles.Modal_Filter_Search}`}
      >
        <div className={genericModalStyles.header}>
          <h3>Filter by..</h3>
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
                    {
                      "--background-color": colorConverter(
                        userinfo.genres[eachItem]
                      ),
                    } as React.CSSProperties
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
