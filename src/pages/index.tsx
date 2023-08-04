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
// import totalHighlightsApi from "@/api/Highlights/TotalHighlights";

export default function LoginPage({
  TotalHighlights,
}: {
  TotalHighlights: number;
}) {
  console.log("TotalHighlights: ", TotalHighlights);
  //UseEffect to check if there's already an authToken
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
        {/* <div className={styles.main_left}></div> */}
        {/* <div className={styles.main_right}> */}
        <LoginComponent />
        {/* </div> */}
        {/* <KindleOverlay /> */}
      </div>
    </>
  );
}

// export async function getStaticProps() {
//   // Fetch data from an API or any data source
//   const TotalHighlights = await totalHighlightsApi();

//   // Return the fetched data as props
//   return {
//     props: {
//       TotalHighlights,
//     },
//   };
// }
