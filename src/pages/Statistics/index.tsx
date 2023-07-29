import React, { useState, useEffect } from "react";
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
        <title>Statistics</title>
      </Head>
      <div>Stats</div>;
    </>
  );
};

export default Stats;
