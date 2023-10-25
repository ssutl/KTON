import React, { useRef, useState, useContext, useEffect } from "react";
import genericModalStyles from "../../styles/Components/Modal.module.scss";
import HandleChanges from "@/helpers/HandleChanges";
import { Book } from "@/api/Interface";
import { useAlert } from "react-alert";

interface Modal_Type_SaveProps {
  closeModal: () => void;
  mainBook: Book;
}

const Modal_Type_Save = ({ closeModal, mainBook }: Modal_Type_SaveProps) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const { updateBookCover } = HandleChanges();
  const alert = useAlert();

  useEffect(() => {
    //Auto focus on input
    const input = document.getElementById("autoFocus");
    if (input) {
      input.focus();
    }
  }, []);

  return (
    <>
      <div
        className={`${genericModalStyles.modal} ${genericModalStyles.Modal_Type_Save}`}
      >
        {
          //Just header for phone modals
        }
        <div className={genericModalStyles.mobileHeader}>
          <h3>Update Image</h3>
          <h3 onClick={() => closeModal()} id={genericModalStyles.done}>
            done
          </h3>
        </div>

        <div className={genericModalStyles.searchSection}>
          <input
            id="autoFocus"
            type="text"
            placeholder="Input an image URL"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        <div className={genericModalStyles.buttonSection}>
          <p
            className={genericModalStyles.button}
            onClick={() => {
              if (searchValue.length) {
                updateBookCover({
                  book_id: mainBook!._id,
                  data: searchValue,
                });
                closeModal();
              } else {
                alert.show("Invalid image URL", {
                  type: "error",
                });
              }
            }}
          >
            Save
          </p>
        </div>
      </div>
      <div
        className={genericModalStyles.modalBackground}
        onClick={() => closeModal()}
      />
    </>
  );
};
export default Modal_Type_Save;
