import React, { useState, useEffect } from "react";
import styles from "../styles/Navbar.module.scss";
import Router from "next/router";

//interface HomeProps {}

const Home = () => {
  const [restrictions, setRestrictions] = useState<boolean>(true);

  //Checking whether to apply restrictions
  useEffect(() => {
    const authToken = localStorage.getItem("token");
    const clippings = localStorage.getItem("clippings");

    if (authToken) {
      //Pass user into the app without restrictions
      setRestrictions(false);
    } else if (clippings && !authToken) {
      setRestrictions(true);
    } else {
      Router.push("/");
    }
  }, []);

  return (
    <div className={styles.Home}>{`Welcome to KTON, ${
      restrictions
        ? `your account has restrictions, login to ensure you can access all feature`
        : `your account is totally un-restricted`
    }`}</div>
  );
};

export default Home;
