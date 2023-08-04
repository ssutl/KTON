import styles from "../styles/Navbar.module.scss";
import React, { useState, useEffect, useContext } from "react";
import { KTON_CONTEXT } from "../context/KTONContext";
import { useRouter } from "next/router";
import userAuthenticated from "@/helpers/UserAuthenticated";

export default function Navbar() {
  const { updateBooks } = useContext(KTON_CONTEXT);
  const [hasClippings, setHasClippings] = useState(false);
  const [hasAuthenticated, setHasAuthenticated] = useState(false);
  const router = useRouter();
  const isIndexRoute = router.pathname === "/";
  const isImportRoute = router.pathname === "/Import";
  const isVerifyRoute = /^\/verify\/\d+$/.test(router.asPath);
  const isMembershipRoute = router.pathname === "/Membership";
  const demoUser = hasClippings && !hasAuthenticated;

  useEffect(() => {
    if (sessionStorage.getItem("clippings")) {
      setHasClippings(true);
    }
    if (userAuthenticated()) {
      setHasAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    //Setting restrictionHeader to true if user not authenticated
    if (sessionStorage.getItem("clippings")) {
      setHasClippings(true);
    }
    if (userAuthenticated()) {
      setHasAuthenticated(true);
    }
  }, [router.pathname]);

  //Display the navbar
  if (router.pathname === "/verify/[...id]") return null;
  return (
    <div className={styles.navbar}>
      <div className={styles.navbarWidth}>
        <h3 onClick={() => router.push("/Home")}>KTON</h3>
        <div className={styles.navigationButtons}>
          {isIndexRoute ||
          isImportRoute ||
          isVerifyRoute ||
          (isMembershipRoute && (!hasAuthenticated || !hasClippings)) ? null : (
            <>
              <p onClick={() => router.push("/Library")}>Library</p>
            </>
          )}
          {/* {isImportRoute ? null : (
            <p onClick={() => router.push("/Membership")}>Pricing</p>
          )} */}
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
              {hasAuthenticated ? "Logout" : "Landing"}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
