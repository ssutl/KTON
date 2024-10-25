import Navbar from "@/components/Layout/Navbar";
import FeedbackModal from "./FeedbackModal";
import styles from "../../styles/Layout/Layout.module.scss";
import RateReviewIcon from "@mui/icons-material/RateReview";
import React, { useState, useEffect } from "react";
import userAuthenticated from "@/helpers/UserAuthenticated";
import { useRouter } from "next/router";
import SettingModal from "../Settings/SettingModal";
import { set } from "lodash";

const Layout = ({ children }: any) => {
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [authed, setAuthed] = useState(false);
  const router = useRouter();
  const [displaySettings, setDisplaySettings] = useState(false);

  const handleSettingsModal = () => {
    setDisplaySettings(!displaySettings);
  };

  useEffect(() => {
    setAuthed(userAuthenticated());
  }, [router.pathname]);

  const closeModal = () => {
    setFeedbackModal(false);
  };

  //Quick default layout in order to persist navbar and header on every page
  return (
    <div className={styles.layout}>
      <Navbar
        handleSettingsModal={() => handleSettingsModal()}
        settingsDisplayed={displaySettings}
      />
      {children}
      {displaySettings && (
        <SettingModal handleSettingsModal={() => handleSettingsModal()} />
      )}
      {feedbackModal && authed ? (
        <FeedbackModal closeModal={closeModal} />
      ) : null}
      {authed && (
        <div
          className={styles.feedbackPopup}
          onClick={(e) => {
            e.stopPropagation();
            setFeedbackModal(!feedbackModal);
          }}
        >
          <RateReviewIcon />
        </div>
      )}
    </div>
  );
};

export default Layout;
