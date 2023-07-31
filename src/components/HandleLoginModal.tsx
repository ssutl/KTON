import LoginComponent from "./LoginComponent";
import styles from "../styles/LoginModal.module.scss";
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
          <div className={styles.width}>
            <LoginComponent />
          </div>
        </div>
      );
    } else return null;
  };

  return {
    setLoginModal,
    LoginModal,
  };
};

export default HandleLoginModal;
