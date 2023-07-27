import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import FeedbackModal from "./FeedbackModal";
import styles from "../styles/Layout.module.scss";
import RateReviewIcon from "@mui/icons-material/RateReview";
import React, { useState } from "react";
import userAuthenticated from "@/helpers/UserAuthenticated";

const Layout = ({ children }: any) => {
  const [feedbackModal, setFeedbackModal] = useState(false);

  //Quick default layout in order to persist navbar and header on every page
  const closeModal = () => {
    setFeedbackModal(false);
  };

  return (
    <>
      <Navbar />
      <Header />
      {children}
      {feedbackModal && userAuthenticated() ? (
        <FeedbackModal closeModal={closeModal} />
      ) : null}
      {userAuthenticated() ? (
        <div
          className={styles.feedbackPopup}
          onClick={(e) => {
            e.stopPropagation();
            setFeedbackModal(!feedbackModal);
          }}
        >
          <RateReviewIcon />
        </div>
      ) : null}
    </>
  );
};

export default Layout;
