import { Book } from "@/api/Interface";
import genericModalStyles from "../../styles/Components/Modal.module.scss";
import { useRouter } from "next/router";
import HandleChanges from "@/helpers/HandleChanges";

interface Modal_Centered_SelectProps {
  optionsData: Book[] | string[];
  closeModal: () => void;
}

const Modal_Centered_Select = ({
  optionsData,
  closeModal,
}: Modal_Centered_SelectProps) => {
  const router = useRouter();
  const { markBookAsAnnotated, deleteBook } = HandleChanges();

  return (
    <div
      className={genericModalStyles.modalBackgroundBlur}
      onMouseDown={() => closeModal()}
    >
      <div
        className={`${genericModalStyles.modal} ${genericModalStyles.Modal_Centered_Select}`}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={genericModalStyles.mobileHeader}>
          {typeof optionsData[0] === "string" ? (
            <h3>Edit Book</h3>
          ) : (
            <h3>Select Book</h3>
          )}
          <h3 onClick={() => closeModal()} id={genericModalStyles.done}>
            done
          </h3>
        </div>
        {optionsData.map((eachItem, i) => (
          <div
            key={i}
            className={`${genericModalStyles.listItem}`}
            onClick={() => {
              if (typeof eachItem === "string") {
                // Render string
                if (eachItem === "Mark as annotated") {
                  // Mark as annotated
                  markBookAsAnnotated({ book_id: router.query.id as string });
                } else {
                  // Delete Book
                  //Push user to library
                  router.push("/Library");

                  deleteBook({ book_id: router.query.id as string });
                }
              } else {
                // Render Book title
                router.push(`/Book/${eachItem._id}`);
              }
            }}
          >
            <p>{typeof eachItem === "string" ? eachItem : eachItem.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Modal_Centered_Select;
