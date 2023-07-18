import React, { useState, useEffect } from "react";
import styles from "../styles/Navbar.module.scss";
import Head from "next/head";
import AllowedRoute from "@/helpers/AllowedRoute";

//interface StatsProps {}

const Stats = () => {
  useEffect(() => {
    // check if this is an allowed route
    AllowedRoute();
  }, []);
  //add stats here
  return (
    <>
      <Head>
        <title>Export</title>
      </Head>
      <div>Stats</div>;
    </>
  );
};

export default Stats;
