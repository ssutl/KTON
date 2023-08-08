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
  screen.orientation.lock("portrait-primary");

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
