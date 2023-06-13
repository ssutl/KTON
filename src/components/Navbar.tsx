import styles from "../styles/Navbar.module.scss";
import React from "react";

export default function Navbar() {
  return (
    <div className={styles.navbar}>
      <div className={styles.navbarWidth}>
        <div className={styles.navigationTitle}>
          <div className={styles.circle}></div>
          <p>KTON</p>
        </div>
        <div className={styles.navigationButtons}>
          <p>Menu</p>
          <p>Login</p>
        </div>
      </div>
    </div>
  );
}
