import { Book } from "@/api/Interface";
import genericModalStyles from "../../styles/Components/Modal.module.scss";
import { useRouter } from "next/router";

interface Modal_Author_SelectProps {
  optionsData: Book[];
  closeModal: () => void;
}

const Modal_Author_Select = ({
  optionsData,
  closeModal,
}: Modal_Author_SelectProps) => {
  const router = useRouter();

  return (
    <div
      className={genericModalStyles.modalBackgroundBlur}
      onClick={closeModal}
    >
      <div
        className={`${genericModalStyles.modal} ${genericModalStyles.Modal_Author_Select}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={genericModalStyles.header}>
          <h3>Select Book</h3>
        </div>
        {optionsData.map((eachItem, i) => (
          <div
            key={i}
            className={`${genericModalStyles.listItem}`}
            onClick={() => {
              router.push(`/Book/${optionsData[i]._id}`);
            }}
          >
            <p>{eachItem.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Modal_Author_Select;
