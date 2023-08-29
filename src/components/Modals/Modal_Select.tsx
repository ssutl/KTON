import genericModalStyles from "../../styles/Components/Modal.module.scss";
import React, { useEffect } from "react";

interface Modal_SelectProps {
  onItemClick: (item: any) => void;
  optionsData: string[];
  selectedSort: string;
  closeModal: () => void;
}

const Modal_Select = ({
  onItemClick,
  optionsData,
  selectedSort,
  closeModal,
}: Modal_SelectProps) => {
  //Add overflow hidden to element behind when modal is open
  useEffect(() => {
    const scrollHalf = document.getElementById("Library");
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
        className={`${genericModalStyles.modal} ${genericModalStyles.Modal_Select}`}
      >
        <div className={genericModalStyles.mobileHeader}>
          <h3>Sort by...</h3>
          <h3 onClick={() => closeModal()} id={genericModalStyles.done}>
            done
          </h3>
        </div>
        {optionsData.map((eachItem, i) => (
          <div
            key={i}
            className={`${genericModalStyles.listItem}  ${
              selectedSort === eachItem ? genericModalStyles.selectedItem : ""
            }`}
            onClick={() => {
              if (selectedSort === eachItem && selectedSort === "Recent") {
                onItemClick!("Oldest");
              } else if (
                selectedSort === eachItem &&
                selectedSort !== "Recent"
              ) {
                onItemClick!(undefined);
              } else {
                onItemClick!(eachItem);
              }
            }}
          >
            <p>{eachItem}</p>
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
export default Modal_Select;
