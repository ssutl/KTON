import styles from "../styles/Navbar.module.scss";
import React, { useState, useEffect } from "react";

export default function Navbar() {
  const screenwidth = 100;

  const Modal = () => {
    return (
      <div className={styles.modal}>
        {screenwidth < 200 ? (
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
        ) : (
          <>
            <div className={styles.modal_item}></div>
            <div className={styles.modal_item}></div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.navbarWidth}>
        <div className={styles.navigationTitle}>
          <div className={styles.circle}></div>
          <p>KTON</p>
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
