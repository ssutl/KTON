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

  useEffect(() => {
    setRestrictions(userAuthenticated());

    // Fetch data from your database and update the context state variables
    const fetchData = async () => {
      try {
        // Example API call to fetch user info
        const userResponse = await getUserInfo();
        updateUserInfo(userResponse);

        // Example API call to fetch books
        const booksResponse = await getAllBooks();
        updateBooks(booksResponse);

        // Example API call to fetch highlights
        const highlightsResponse = await getAllHighlights();
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
};

export default Home;
