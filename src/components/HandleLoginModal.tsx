import LoginComponent from "./LoginComponent";
import styles from "../styles/LoginModal.module.scss";
import { useState } from "react";

const HandleLoginModal = () => {
  const [display, setDisplay] = useState(false);

  const setModal = () => {
    setDisplay(true);
  };

  const LoginModal = () => {
    if (display) {
      return (
        <div className={styles.LoginModal} onClick={() => setDisplay(false)}>
          <LoginComponent />
        </div>
      );
    } else return null;
  };

  return {
    setModal,
    LoginModal,
  };
};

export default HandleLoginModal;
