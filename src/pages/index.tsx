import styles from "../styles/LoginPage.module.scss";
import { useEffect, useState } from "react";
import Router from "next/router";
import Head from "next/head";
import LoginComponent from "@/components/LoginComponent";
// import totalHighlightsApi from "@/api/Highlights/TotalHighlights";

export default function LoginPage({
  TotalHighlights,
}: {
  TotalHighlights: number;
}) {
  //UseEffect to check if there's already an authToken
  function preventRotation() {
    if (window.orientation !== undefined) {
      if (window.orientation === 90 || window.orientation === -90) {
        // Landscape orientation, force portrait
        document.body.style.transform = "rotate(0)";
      }
    }
  }

  // Attach event listeners
  window.addEventListener("orientationchange", preventRotation);
  window.addEventListener("resize", preventRotation);

  // Initial call to prevent rotation
  preventRotation();

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    const clippings = sessionStorage.getItem("clippings");

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
        <LoginComponent />
      </div>
    </>
  );
}
