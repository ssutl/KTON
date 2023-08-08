import genericModalStyles from "../../styles/Components/Modal.module.scss";

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
  return (
    <>
      <div
        className={`${genericModalStyles.modal} ${genericModalStyles.Modal_Select}`}
      >
        <div className={genericModalStyles.header}>
          <h3>Sort by</h3>
        </div>
        {optionsData.map((eachItem, i) => (
          <div
            key={i}
            className={`${genericModalStyles.listItem}  ${
              selectedSort === eachItem ? genericModalStyles.selectedItem : ""
            }`}
            onClick={() => {
              if (selectedSort === eachItem && selectedSort !== "Recent") {
                onItemClick!("Recent");
              } else if (
                selectedSort === eachItem &&
                selectedSort === "Recent"
              ) {
                onItemClick!("Oldest");
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
