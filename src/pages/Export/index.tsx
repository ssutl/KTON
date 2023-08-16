import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import notionApi from "@/api/Notion/NotionApi";
import Head from "next/head";
import AllowedRoute from "@/helpers/AllowedRoute";
import styles from "../../styles/Pages/Export.module.scss";
import ExportCard from "@/components/Export/ExportCard";
import excelIcon from "../../../public/image/excel.png";
import notionIcon from "../../../public/image/notion.png";
import ankiIcon from "../../../public/image/anki.png";
import ankiApi from "@/api/Anki/AnkiApi";
import csvApi from "@/api/CSV/csvApi";

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
    console.log("called with code", code);
  };

  //On page load check if there is a code in the url
  useEffect(() => {
    AllowedRoute();

    if (window.location.href.includes("code=")) {
      getCodeFromUrl();
    }
  }, []);

  //Create an array of kton export options with the name, description and onclick function
  const exportOptions = [
    {
      name: "Notion",
      description:
        "Integrate with Notion and easily copy your digital library to a notion database",
      image: notionIcon,
      onClick: () => {
        //Open in new tab instead
        window.open(
          "https://api.notion.com/v1/oauth/authorize?client_id=7081a522-2c1f-445b-8a37-d73e11076dcd&response_type=code&owner=user&redirect_uri=https%3A%2F%2Fapp.kton.xyz%2FExport",
          "_blank"
        );
      },
    },
    {
      name: "Excel CSV",
      description:
        "Create a CSV database with book titles and highlights for easy management.",
      image: excelIcon,
      onClick: () => {
        csvApi();
      },
    },
  ];

  return (
    <>
      <Head>
        <title>Export</title>
      </Head>
      <div className={styles.exportPage}>
        <div className={styles.exportPageWidth}>
          <div className={styles.exportPageTitle}>
            <h1 id={styles.title}>Export Library</h1>
            <p id={styles.description}>
              Connect KTON to other tools you use, stay versatile.
            </p>
          </div>
          <div className={styles.exportPageContent}>
            {exportOptions.map((option, index) => (
              <ExportCard option={option} key={index} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Export;
