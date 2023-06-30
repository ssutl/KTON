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
  const {
    userinfo,
    books,
    highlights,
    updateBooks,
    updateUserInfo,
    updateHighlights,
  } = useContext(KTON_CONTEXT);

  const { getAllBooks, getAllHighlights, getUserInfo } = InitApi();
  const [restrictions, setRestrictions] = useState<boolean>(true);
  const loaded =
    (userinfo !== undefined &&
      books !== undefined &&
      highlights !== undefined &&
      !restrictions) ||
    restrictions;

  //If user is logged in we will fetch their data and pass it into context
  useEffect(() => {
    setRestrictions(!userAuthenticated());

    // Fetch data from your database and update the context state variables
    const fetchData = async () => {
      try {
        const [userResponse, booksResponse, highlightsResponse] =
          await Promise.all([getUserInfo(), getAllBooks(), getAllHighlights()]);
        updateUserInfo(userResponse);
        updateBooks(booksResponse);
        updateHighlights(highlightsResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (userAuthenticated()) {
      fetchData();
    }
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
