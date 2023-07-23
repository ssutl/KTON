import styles from "../styles/Navbar.module.scss";
import React, { useState, useEffect, useContext } from "react";
import { KTON_CONTEXT } from "../context/KTONContext";
import { useRouter } from "next/router";
import userAuthenticated from "@/helpers/UserAuthenticated";

export default function Navbar() {
  const { updateBooks } = useContext(KTON_CONTEXT);
  const router = useRouter();
  const isIndexRoute = router.pathname === "/";
  const isImportRoute = router.pathname === "/Import";
  const isVerifyRoute = /^\/verify\/\d+$/.test(router.asPath);

  //On page load update screenwidth state && restrictions
  // useEffect(() => {
  //   // setRestrictions(!userAuthenticated());
  // }, [router.pathname]);

  //The navigation modal
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
        </div>
      </div>
    );
  };

  //Display the navbar
  return (
    <div className={styles.navbar}>
      <div className={styles.navbarWidth}>
        <h3>KTON</h3>
        <div className={styles.navigationButtons}>
          {isIndexRoute || isImportRoute || isVerifyRoute ? null : (
            <span className={styles.hoverMenu}>
              <h3>Menu</h3>
              <Modal />
            </span>
          )}
          {!isIndexRoute ? (
            <h3
              onClick={() => {
                router.push("/");
                localStorage.removeItem("token");
                localStorage.removeItem("clippings");
                updateBooks(undefined);
              }}
            >
              Logout
            </h3>
          ) : null}
        </div>
      </div>
    </div>
  );
}
