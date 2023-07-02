import styles from "../styles/Header.module.scss";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import userAuthenticated from "@/helpers/UserAuthenticated";

export default function Header() {
  const router = useRouter();
  const [restrictionHeader, setRestrictionHeader] = useState(false);

  useEffect(() => {
    //Setting restrictionHeader to true if user not authenticated
    setRestrictionHeader(!userAuthenticated());
  }, []);

  //If on landing page we display default header
  if (router.pathname === "/") {
    return (
      <div className={styles.header}>
        <div className={styles.headerWidth}>
          <p>OVER 10,000 IMPORTED HIGHLIGHTS</p>
        </div>
      </div>
    );

    //If on home page we need to display the restriction ting
  } else if (router.pathname === "/Home" && restrictionHeader) {
    return (
      <div className={styles.header}>
        <div className={styles.headerWidth}>
          <p>
            Welcome to KTON your account has restrictions, login to ensure you
            can access all features!
          </p>
          <span onClick={() => setRestrictionHeader(false)}>x</span>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
