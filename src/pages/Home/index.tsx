import React, { useState, useEffect, useContext } from "react";
import styles from "../../styles/Pages/Home.module.scss";
import { KTON_CONTEXT } from "../../context/KTONContext";
import QuoteBanner from "@/components/Home/QuoteBanner";
import InitApi from "../../api/InitAPI";
import HomeStatBanner from "@/components/Home/HomeStatBanner";
import HeatMapBanner from "@/components/Home/HeatMapBanner";
import Head from "next/head";
import AllowedRoute from "@/helpers/AllowedRoute";
import LoadingPage from "@/components/Loading/LoadingPage";
import MostReadBanner from "@/components/Home/MostReadBanner";

const Home = () => {
  const { userinfo, books, highlights } = useContext(KTON_CONTEXT);
  const { InitialiseApp } = InitApi();

  //Initialising App by making data call on page load
  useEffect(() => {
    //check if this is an allowed route
    AllowedRoute();

    //If the user is logged in but the book data is empty then we gotta refresh context, this way we can keep initial load fast by not loading books off of navigation
    if (!books) {
      InitialiseApp();
    }
  }, []);

  //If the data is in the context, or the user is not authenticated we pass them into app, else loading
  if (
    userinfo !== undefined &&
    books !== undefined &&
    highlights !== undefined
  ) {
    return (
      <>
        <Head>
          <title>KTON Home</title>
        </Head>
        <div className={styles.Home}>
          <QuoteBanner />
          <MostReadBanner />
          {/* <HeatMapBanner />
          <HomeStatBanner /> */}
        </div>
      </>
    );
  } else {
    return <LoadingPage Text="KTON" />;
  }
};

export default Home;
