import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/Navbar.module.scss";
import { KTON_CONTEXT } from "../context/KTONContext";
import QuoteBanner from "@/components/QuoteBanner";
import userAuthenticated from "@/helpers/UserAuthenticated";
import InitApi from "../api/InitAPI";

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
  const displayBanner =
    userinfo !== undefined &&
    books !== undefined &&
    highlights !== undefined &&
    !restrictions;

  console.log("DISPLAYBANNER", displayBanner);

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

  useEffect(() => {
    console.log("User Info:", userinfo);
    console.log("Books:", books);
    console.log("Highlights:", highlights);
  }, [userinfo, books, highlights]);

  if (displayBanner) {
    return (
      <div className={styles.Home}>
        {`Welcome to KTON, ${
          restrictions
            ? `your account has restrictions, login to ensure you can access all feature`
            : `your account is totally un-restricted`
        }`}
        <QuoteBanner />
      </div>
    );
  } else {
    return <div>Loading</div>;
  }
};

export default Home;
