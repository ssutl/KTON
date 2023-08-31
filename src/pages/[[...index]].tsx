import styles from "../styles/Pages/LoginPage.module.scss";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import LoginComponent from "@/components/Login/LoginComponent";
// import totalHighlightsApi from "@/api/Highlights/TotalHighlights";

export default function LoginPage() {
  const router = useRouter();
  const { index } = router.query;

  //If we land on login/Demo then we need to set local storage to true and redirect to library
  useEffect(() => {
    localStorage.removeItem("Demo");

    if (router.isReady) {
      if (index && index[0] === "Demo") {
        localStorage.setItem("Demo", "true");
        router.push("/Library");
      }
    }
  }, [router.isReady]);

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
