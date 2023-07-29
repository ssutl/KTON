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

  //Display the navbar
  if (router.pathname === "/verify/[...id]") return null;
  return (
    <div className={styles.navbar}>
      <div className={styles.navbarWidth}>
        <h3 onClick={() => router.push("/Home")}>KTON</h3>
        <div className={styles.navigationButtons}>
          {isIndexRoute || isImportRoute || isVerifyRoute ? null : (
            <>
              <p onClick={() => router.push("/Library")}>Library</p>
            </>
          )}
          {!isIndexRoute ? (
            <p
              onClick={() => {
                router.push("/");
                localStorage.removeItem("token");
                localStorage.removeItem("clippings");
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
