import styles from "../styles/Navbar.module.scss";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Navbar() {
  const [screenWidth, setScreenWidth] = useState(0);

  const router = useRouter();
  const isIndexRoute = router.pathname === "/";

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
        <ul>
          <li>{screenWidth < 1024 ? `KTON` : `KINDLE NOTES MANAGER`}</li>
        </ul>
        <div className={styles.navigationButtons}>
          {isIndexRoute ? null : (
            <span className={styles.hoverMenu}>
              <p>Menu</p>
              <Modal />
            </span>
          )}
          <p>Login</p>
        </div>
      </div>
    </div>
  );
}
