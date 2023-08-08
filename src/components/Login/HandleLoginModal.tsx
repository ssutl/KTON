import LoginComponent from "./LoginComponent";
import styles from "../../styles/Components/LoginModal.module.scss";
import { useState } from "react";

const HandleLoginModal = () => {
  const [display, setDisplay] = useState(false);

  const setLoginModal = () => {
    setDisplay(true);
  };

  //Modal which holds the login component for when the user is not authenticated
  const LoginModal = () => {
    if (display) {
      return (
        <div className={styles.LoginModal} onClick={() => setDisplay(false)}>
          <LoginComponent />
        </div>
      );
    } else return null;
  };

  //Returning the function to set the modal and the modal itself
  return {
    setLoginModal,
    LoginModal,
  };
};

export default HandleLoginModal;
