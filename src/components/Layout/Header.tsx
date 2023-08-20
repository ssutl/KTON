import styles from "../styles/Header.module.scss";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();

  //If on landing page we display default header
  if (router.pathname === "/Home") {
    return (
      <div className={`${styles.header} ${styles.headerExpand}`}>
        <div className={styles.headerWidth}>
          <p>Here we can do feature updates etc</p>
        </div>
      </div>
    );
  }
}
