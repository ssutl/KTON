import styles from "../styles/Navbar.module.scss";
import React, { useState, useEffect } from "react";

export default function Navbar() {
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    handleResize(); // Initial screen width

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const Modal = () => {
    return (
      <div className={styles.modal}>
        <div className={styles.modal_height}>
          <div className={styles.modal_title}>
            <p>Pages</p>
          </div>
          <div className={styles.modal_item}>
            <p>Home</p>
          </div>
          <div className={styles.modal_item}>
            <p>Library</p>
          </div>
          <div className={styles.modal_item}>
            <p>Stats</p>
          </div>
          <div className={styles.modal_item}>
            <p>Export</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.navbarWidth}>
        <div className={styles.navigationTitle}>
          <div className={styles.circle}></div>
          <p>{screenWidth < 1024 ? `KTON` : `KINDLE NOTES MANAGER`}</p>
        </div>
        <div className={styles.navigationButtons}>
          <span className={styles.hoverMenu}>
            <p>Menu</p>
            <Modal />
          </span>
          <p>Login</p>
        </div>
      </div>
    </div>
  );
}
