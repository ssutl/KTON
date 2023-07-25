import Tag from "@/components/Tag";
import styles from "../styles/LoginPage.module.scss";
import ImportButton from "@/components/ImportButton";
import { useEffect, useState } from "react";
import Router from "next/router";
import Head from "next/head";
import SiteDescription from "@/components/SiteDescription";
import LoginComponent from "@/components/LoginComponent";
import ImportComponent from "@/components/ImportComponent";
import KindleOverlay from "@/components/KindleOverlay";

export default function LoginPage() {
  const [feedbackModal, setFeedbackModal] = useState(false);
  //UseEffect to check if there's already an authToken
  useEffect(() => {
    const authToken = localStorage.getItem("token");
    const clippings = localStorage.getItem("clippings");

    if (authToken || clippings) {
      // Pass user into the app
      Router.push("Home");
    }
  }, []);

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className={styles.main}>
        <div className={styles.main_left}>
          <ul>
            <li>A website designed to organise your kindle highlights</li>
          </ul>
          <SiteDescription />
        </div>
        <div className={styles.main_right}>
          <div className={styles.widthContainer}>
            <LoginComponent />
            <p id={styles.or}>or</p>
            <ImportComponent />
          </div>
        </div>
        <KindleOverlay />
      </div>
    </>
  );
}
