import styles from "../styles/Navbar.module.scss";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Navbar() {
  const [screenWidth, setScreenWidth] = useState(0);

  const router = useRouter();
  const isIndexRoute = router.pathname === "/";
  let userLoggedIn = false;

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    //UseEffect to see what the local storage state is after upload
    const authToken = localStorage.getItem("token");

    if (authToken) {
      userLoggedIn = true;
    }

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
          <div
            className={styles.modal_item}
            onClick={() => router.push("Home")}
          >
            <p>Home</p>
          </div>
          <div
            className={styles.modal_item}
            onClick={() => router.push("Library")}
          >
            <p>Library</p>
          </div>
          <div
            className={styles.modal_item}
            onClick={() => router.push("Stats")}
          >
            <p>Stats</p>
          </div>
          <div
            className={styles.modal_item}
            onClick={() => router.push("Export")}
          >
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
          {userLoggedIn ? null : <p>Login</p>}
        </div>
      </div>
    </div>
  );
}
