import React, { useRef, useState, useContext, useEffect } from "react";
import genericModalStyles from "../../styles/Components/Modal.module.scss";
import HandleChanges from "@/helpers/HandleChanges";
import DeleteUserApi from "@/api/Users/DeleteUser";
import Router from "next/router";

interface Modal_ConfirmationProps {
  closeModal: () => void;
}

const Modal_Confirmation = ({ closeModal }: Modal_ConfirmationProps) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const { updateBookCover } = HandleChanges();

  const deleteAccount = async () => {
    if (searchValue !== JSON.parse(localStorage.getItem("username") as string))
      return null;

    try {
      const res = await DeleteUserApi();

      if (res === "success") {
        closeModal();
        Router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={genericModalStyles.modalBackgroundBlur}>
      <div
        className={`${genericModalStyles.modal} ${genericModalStyles.Modal_Confirmation}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {
          //Just header for phone modals
        }
        <div className={genericModalStyles.header}>
          <h3>{`To confirm, type ${localStorage.getItem(
            "username"
          )} in the box below`}</h3>
        </div>
        <div className={genericModalStyles.searchSection}>
          <input
            type="text"
            placeholder="Input required to delete account"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className={genericModalStyles.buttonSection}>
          <p
            className={genericModalStyles.button}
            onClick={() => {
              deleteAccount();
            }}
          >
            Delete this account
          </p>
        </div>
      </div>
    </div>
  );
};
export default Modal_Confirmation;
