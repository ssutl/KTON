import React, { useState, useEffect, useContext } from "react";
import notionApi from "@/api/Notion/NotionApi";
import Head from "next/head";
import AllowedRoute from "@/helpers/AllowedRoute";
import styles from "../../styles/Pages/Export.module.scss";
import ExportCard from "@/components/Export/ExportCard";
import notionIcon from "../../../public/image/notion.png";
import { KTON_CONTEXT } from "../../context/KTONContext";
import InitApi from "../../api/InitAPI";
import { useAlert } from "react-alert";

const Export = () => {
  const { books, userinfo } = useContext(KTON_CONTEXT);
  const { InitialiseApp } = InitApi();
  const alert = useAlert();

  //Get the code from the url
  const getCodeFromUrl = async () => {
    const codeIndex = window.location.href.indexOf("code=");
    const cdIndex = window.location.href.indexOf("&", codeIndex);
    const code = window.location.href.substring(
      codeIndex + "code=".length,
      cdIndex
    );

    try {
      const response = await notionApi(code);
      if (response === "success") {
        alert.show("Successfully connected to Notion", {
          type: "success",
        });
      }
    } catch (err) {
      alert.show("Error connecting to Notion", {
        type: "error",
      });
    }
  };

  //On page load check if there is a code in the url
  useEffect(() => {
    AllowedRoute();

    if (window.location.href.includes("code=")) {
      getCodeFromUrl();
    }

    if (!books) {
      InitialiseApp();
    }
  }, []);

  //Create an array of kton export options with the name, description and onclick function
  const exportOptions = [
    {
      name: "Notion",
      description: userinfo?.subscription
        ? "Integrate with Notion and easily copy your digital library to a notion database"
        : "Notion integration is only available for premium users",
      image: notionIcon,
      onClick: () => {
        if (userinfo?.subscription === true) {
          //Open in new tab instead
          window.open(
            "https://api.notion.com/v1/oauth/authorize?client_id=7081a522-2c1f-445b-8a37-d73e11076dcd&response_type=code&owner=user&redirect_uri=https%3A%2F%2Fapp.kton.xyz%2FExport",
            "_blank"
          );
        } else {
          alert.show("Only premium members can access notion exporting", {
            type: "info",
          });
        }
      },
    },
    // {
    //   name: "Excel CSV",
    //   description:
    //     "Create a CSV database with book titles and highlights for easy management.",
    //   image: excelIcon,
    //   onClick: () => {
    //     csvApi();
    //   },
    // },
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
