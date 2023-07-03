import styles from "../styles/Navbar.module.scss";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import userAuthenticated from "@/helpers/UserAuthenticated";

export default function Navbar() {
  const [screenWidth, setScreenWidth] = useState(0);

  const router = useRouter();
  const isIndexRoute = router.pathname === "/";
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    setScreenWidth(window.innerWidth);
    setUserLoggedIn(userAuthenticated());

    window.addEventListener("resize", () => setScreenWidth(window.innerWidth));

    //Setting user auth status

    return () => {
      window.removeEventListener("resize", () =>
        setScreenWidth(window.innerWidth)
      );
    };
  }, []);

  //The pop up menu
  const Modal = () => {
    return (
      <div className={styles.modal}>
        <div className={styles.modal_height}>
          <div className={styles.modal_title}>
            <p>Pages</p>
          </div>
          <div
            className={styles.modal_item}
            onClick={() =>
              router.pathname === "/Home" ? null : router.push("/Home")
            }
          >
            <p>Home</p>
          </div>
          <div
            className={styles.modal_item}
            onClick={() => router.push("/Library")}
          >
            <p>Library</p>
          </div>
          <div
            className={styles.modal_item}
            onClick={() => router.push("/Stats")}
          >
            <p>Stats</p>
          </div>
          <div
            className={styles.modal_item}
            onClick={() => router.push("/Export")}
          >
            <p>Import</p>
          </div>
          <div
            className={styles.modal_item}
            onClick={() => router.push("/Export")}
          >
            <p>Export</p>
          </div>
        </div>
      </div>
    );
  };

  //Display the navbar
  return (
    <div className={styles.navbar}>
      <div className={styles.navbarWidth}>
        <h3>{screenWidth < 1024 ? `KTON` : `KINDLE NOTES MANAGER`}</h3>
        <div className={styles.navigationButtons}>
          {isIndexRoute ? null : (
            <span className={styles.hoverMenu}>
              <h3>Menu</h3>
              <Modal />
            </span>
          )}
          {userLoggedIn ? <h3>Logout</h3> : <h3>Login</h3>}
        </div>
      </div>
    </div>
  );
}
