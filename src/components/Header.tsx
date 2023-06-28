import styles from "../styles/Header.module.scss";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import userAuthenticated from "@/helpers/UserAuthenticated";

//interface HeaderProps {}

export default function Header() {
  const router = useRouter();
  const [restrictions, setRestrictions] = useState<boolean>(true);

  useEffect(() => {
    setRestrictions(!userAuthenticated());
  });

  if (router.pathname === "/") {
    return (
      <div className={styles.header}>
        <div className={styles.headerWidth}>
          <p>OVER 10,000 IMPORTED HIGHLIGHTS</p>
        </div>
      </div>
    );
  } else if (router.pathname === "/Home") {
    return (
      <div className={styles.header}>
        <div className={styles.headerWidth}>
          {`Welcome to KTON, ${
            restrictions
              ? `your account has restrictions, login to ensure you can access all features!`
              : `your account is totally un-restricted, happy annotating!`
          }`}
        </div>
      </div>
    );
  } else {
    return null;
  }
}
