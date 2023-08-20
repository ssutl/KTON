import React, { useRef, useState, useContext, useEffect } from "react";
import genericModalStyles from "../../styles/Components/Modal.module.scss";
import DeleteUserApi from "@/api/Users/DeleteUser";
import Router from "next/router";
import { KTON_CONTEXT } from "../../context/KTONContext";

interface Modal_ConfirmationProps {
  closeModal: () => void;
  closeSettingModal: () => void;
}

const Modal_Confirmation = ({
  closeModal,
  closeSettingModal,
}: Modal_ConfirmationProps) => {
  const { updateBooks } = useContext(KTON_CONTEXT);
  const [searchValue, setSearchValue] = useState<string>("");

  const deleteAccount = async () => {
    if (searchValue !== JSON.parse(localStorage.getItem("username") as string))
      return null;

    try {
      const res = await DeleteUserApi();

      if (res === "success") {
        closeSettingModal();
        closeModal();
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        sessionStorage.removeItem("clippings");
        Router.push("/");
        updateBooks(undefined);
      }
    } catch (error) {}
  };

  return (
    <div
      className={genericModalStyles.modalBackgroundBlur}
      onMouseDown={(e) => {
        e.stopPropagation();
        closeModal();
      }}
    >
      <div
        className={`${genericModalStyles.modal} ${genericModalStyles.Modal_Confirmation}`}
        onMouseDown={(e) => {
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
