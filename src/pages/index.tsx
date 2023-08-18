import styles from "../styles/Pages/LoginPage.module.scss";
import { useEffect, useState } from "react";
import Router from "next/router";
import Head from "next/head";
import LoginComponent from "@/components/Login/LoginComponent";
// import totalHighlightsApi from "@/api/Highlights/TotalHighlights";

export default function LoginPage() {
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
