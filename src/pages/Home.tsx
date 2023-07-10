import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/Home.module.scss";
import { KTON_CONTEXT } from "../context/KTONContext";
import QuoteBanner from "@/components/QuoteBanner";
import userAuthenticated from "@/helpers/UserAuthenticated";
import InitApi from "../api/InitAPI";
import HomeStatBanner from "@/components/HomeStatBanner";
import HeatMapBanner from "@/components/HeatMapBanner";

//interface HomeProps {}

const Home = () => {
  const { userinfo, books, highlights } = useContext(KTON_CONTEXT);
  const { InitialiseApp } = InitApi();
  const [restrictions, setRestrictions] = useState<boolean>(true);

  //Initialising App by making data call on page load
  useEffect(() => {
    setRestrictions(!userAuthenticated());

    //If the user is logged in but the book data is empty then we gotta refresh context, this way we can keep initial load fast by not loading books off of navigation
    if (userAuthenticated() && !books) {
      InitialiseApp();
    }
  }, []);

  //If the data is in the context, or the user is not authenticated we pass them into app, else loading
  if (
    (userinfo !== undefined &&
      books !== undefined &&
      highlights !== undefined &&
      !restrictions) ||
    restrictions
  ) {
    return (
      <div className={styles.Home}>
        <QuoteBanner />
        <HeatMapBanner />
        <HomeStatBanner />
      </div>
    );
  } else {
    return <div>Home Loading</div>;
  }
};

export default Home;
