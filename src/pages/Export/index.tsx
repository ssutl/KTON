import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import notionApi from "@/api/Notion/NotionApi";
import Head from "next/head";
import AllowedRoute from "@/helpers/AllowedRoute";

const Export = () => {
  const router = useRouter();

  //Get the code from the url
  const getCodeFromUrl = () => {
    const codeIndex = window.location.href.indexOf("code=");
    const cdIndex = window.location.href.indexOf("&", codeIndex);
    const code = window.location.href.substring(
      codeIndex + "code=".length,
      cdIndex
    );
    notionApi(code);
  };

  //On page load check if there is a code in the url
  useEffect(() => {
    AllowedRoute();

    if (window.location.href.includes("code=")) {
      getCodeFromUrl();
    }
  }, []);

  return (
    <>
      <Head>
        <title>Export</title>
      </Head>
      <div>
        <a href="https://api.notion.com/v1/oauth/authorize?client_id=7081a522-2c1f-445b-8a37-d73e11076dcd&response_type=code&owner=user&redirect_uri=https%3A%2F%2Fkton-revolutions.vercel.app%2FExport">
          notion
        </a>
      </div>
    </>
  );
};

export default Export;
