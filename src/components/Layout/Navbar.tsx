import styles from "../../styles/Layout/Navbar.module.scss";
import React, { useState, useEffect, useContext } from "react";
import { KTON_CONTEXT } from "../../context/KTONContext";
import { useRouter } from "next/router";

export interface NavbarProps {
  handleSettingsModal: () => void;
}

export default function Navbar({ handleSettingsModal }: NavbarProps) {
  const { updateBooks } = useContext(KTON_CONTEXT);
  const router = useRouter();
  // getting the current route
  const isIndexRoute = router.pathname === "/";
  const isImportRoute = router.pathname === "/Import";
  const isVerifyRoute = /^\/verify\/\d+$/.test(router.asPath);
  const isMembershipRoute = router.pathname === "/Membership";

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
        <div className={styles.navigationButtons}>
          {isIndexRoute || isVerifyRoute ? null : (
            <>
              <p onClick={() => router.push("/Library")}>Library</p>
              <p onClick={() => router.push("/Export")}>Export</p>
              <p onClick={() => handleSettingsModal()}>Settings</p>
            </>
          )}
          {!isIndexRoute ? (
            <p
              onClick={() => {
                router.push("/");
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                sessionStorage.removeItem("clippings");
                updateBooks(undefined);
              }}
            >
              Logout
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
