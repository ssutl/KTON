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
  const loaded =
    (userinfo !== undefined &&
      books !== undefined &&
      highlights !== undefined &&
      !restrictions) ||
    restrictions;

  //Initialising App by making data call on page load
  useEffect(() => {
    setRestrictions(!userAuthenticated());
    InitialiseApp();
  }, []);

  //If the data is in the context, or the user is not authenticated we pass them into app, else loading
  if (loaded) {
    return (
      <div className={styles.Home}>
        <QuoteBanner />
        <HeatMapBanner />
        <HomeStatBanner />
      </div>
    );
  } else {
    return <div>Loading</div>;
  }
};

export default Home;
