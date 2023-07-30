import React, { useState, useEffect, useContext } from "react";
import styles from "../../styles/Home.module.scss";
import { KTON_CONTEXT } from "../../context/KTONContext";
import QuoteBanner from "@/components/QuoteBanner";
import userAuthenticated from "@/helpers/UserAuthenticated";
import InitApi from "../../api/InitAPI";
import HomeStatBanner from "@/components/HomeStatBanner";
import HeatMapBanner from "@/components/HeatMapBanner";
import Head from "next/head";
import AllowedRoute from "@/helpers/AllowedRoute";
import LoadingPage from "@/components/LoadingPage";

const Home = () => {
  const { userinfo, books, highlights } = useContext(KTON_CONTEXT);
  console.log("user subscribed", userinfo?.subscription);
  const { InitialiseApp } = InitApi();
  const [restrictions, setRestrictions] = useState<boolean>(true);

  //Initialising App by making data call on page load
  useEffect(() => {
    setRestrictions(!userAuthenticated());

    //check if this is an allowed route
    if (!AllowedRoute())
      throw new Error("Unauthed users cannot access this route");

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
      <>
        <Head>
          <title>Home</title>
        </Head>
        <div className={styles.Home}>
          <QuoteBanner />
          <HeatMapBanner />
          <HomeStatBanner />
        </div>
      </>
    );
  } else {
    return <LoadingPage Text="KTON" />;
  }
};

export default Home;
