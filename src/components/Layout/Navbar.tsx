import styles from "../../styles/Layout/Navbar.module.scss";
import React, { useState, useEffect, useContext } from "react";
import { KTON_CONTEXT } from "../../context/KTONContext";
import { useRouter } from "next/router";
import userAuthenticated from "@/helpers/UserAuthenticated";

export interface NavbarProps {
  handleSettingsModal: () => void;
}

export default function Navbar({ handleSettingsModal }: NavbarProps) {
  const { updateBooks, books } = useContext(KTON_CONTEXT);
  const router = useRouter();
  // getting the current route
  const isIndexRoute = router.pathname === "/";
  const isImportRoute = router.pathname === "/Import";
  const isHome = router.pathname === "/Home";
  const isLibr = router.pathname === "/Library";
  const isBook = router.pathname.includes("/Book/");
  const isExport = router.pathname === "/Export";
  const DisplayAll =
    isHome ||
    isLibr ||
    isBook ||
    isExport ||
    (isImportRoute &&
      books?.filter((eachBook) => eachBook.deleted).length !== 0);

  //Display the navbar
  if (router.pathname === "/verify/[...id]") return null;

  return (
    <div className={styles.navbar}>
      <div className={styles.navbarWidth}>
        <h3
          onClick={() =>
            router.push(`${isIndexRoute ? "https://kton.xyz" : "/Home"}`)
          }
        >
          KTON
        </h3>
        {DisplayAll && (
          <div className={styles.navigationButtons}>
            <p onClick={() => router.push("/Library")}>Library</p>
            <p onClick={() => handleSettingsModal()}>Settings</p>
          </div>
        )}
      </div>
    </div>
  );
}
