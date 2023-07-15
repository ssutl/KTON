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
  const [screenWidth, setScreenWidth] = useState(1024);

  useEffect(() => {
    //Have to set screenwidth to conditionally change size of heat map
    setScreenWidth(window.innerWidth);
    window.addEventListener("resize", () => setScreenWidth(window.innerWidth));
  }, []);

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
          {/* <div className={styles.section3}>
            <Tag name="SSUTL" />
            <Tag name="CITRUS" />
          </div> */}
        </div>
        <div className={styles.main_right}>
          {screenWidth < 1024 ? <SiteDescription /> : null}
          <LoginComponent />
          <p>or</p>
          <ImportComponent />
        </div>
        <KindleOverlay />
      </div>
    </>
  );
}
