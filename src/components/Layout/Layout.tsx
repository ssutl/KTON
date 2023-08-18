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
    console.log("handle settings modal", !displaySettings);
    setDisplaySettings(!displaySettings);
    localStorage.setItem("displaySettings", JSON.stringify(!displaySettings));
  };

  useEffect(() => {
    setAuthed(userAuthenticated());

    //Persist settings modal on page refresh
    const local_displaySettings =
      localStorage.getItem("displaySettings") === "true";
    setDisplaySettings(local_displaySettings);
  }, [router.pathname]);

  const closeModal = () => {
    setFeedbackModal(false);
  };

  //Quick default layout in order to persist navbar and header on every page

  return (
    <>
      <Navbar handleSettingsModal={() => handleSettingsModal()} />
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
    </>
  );
};

export default Layout;
