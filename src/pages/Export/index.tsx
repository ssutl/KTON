import React, { useState, useEffect, useContext } from "react";
import notionApi from "@/api/Notion/NotionApi";
import Head from "next/head";
import AllowedRoute from "@/helpers/AllowedRoute";
import styles from "../../styles/Pages/Export.module.scss";
import ExportCard from "@/components/Export/ExportCard";
import notionIcon from "../../../public/images/notion.png";
import excelIcon from "../../../public/images/excel.png";
import ankiIcon from "../../../public/images/anki.png";
import { KTON_CONTEXT } from "../../context/KTONContext";
import InitApi from "../../api/InitAPI";
import { useAlert } from "react-alert";
import csvApi from "@/api/CSV/csvApi";

const Export = () => {
  const { books, userinfo } = useContext(KTON_CONTEXT);
  const { InitialiseApp } = InitApi();
  const alert = useAlert();
  const userSubscribed =
    userinfo &&
    userinfo.subscription_end !== null &&
    new Date(userinfo.subscription_end) > new Date();

  const handleCSVApi = async () => {
    try {
      const response = await csvApi();
      if (response === "success") {
        alert.show("Successfully exported to CSV", {
          type: "success",
        });
      }
    } catch (err) {
      alert.show("Error exporting to CSV", {
        type: "error",
      });
    }
  };

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
      description: userSubscribed
        ? "Integrate with Notion and easily copy your digital library to a notion database"
        : "Notion integration is only available for premium users, please subscribe to use this feature.",
      image: notionIcon,
      onClick: () => {
        if (userSubscribed) {
          //Open in new tab instead
        } else {
          alert.show("Only premium members can access anki exporting", {
            type: "info",
          });
        }
      },
    },
    {
      name: "Excel CSV",
      description:
        "Create a CSV database with book titles and highlights for easy management.",
      image: excelIcon,
      onClick: () => {
        handleCSVApi();
      },
    },
    {
      name: "Anki Book Summaries",
      description: userSubscribed
        ? `Create an anki deck containing all your books and their corresponding summaries: Front: Book Title, Back: Summary`
        : "Anki integration is only available for premium users, please subscribe to use this feature.",
      image: ankiIcon,
      onClick: () => {
        if (userSubscribed) {
          //Open in new tab instead
        } else {
          alert.show("Only premium members can access anki exporting", {
            type: "info",
          });
        }
      },
    },
    {
      name: "Anki Book Highlights",
      description: userSubscribed
        ? `Create an anki deck containing all highlights from your favourite books: Front: Book Title, Back: starred quote`
        : "Anki integration is only available for premium users, please subscribe to use this feature.",
      image: ankiIcon,
      onClick: () => {
        if (userSubscribed) {
          //Open in new tab instead
        } else {
          alert.show("Only premium members can access anki exporting", {
            type: "info",
          });
        }
      },
    },
    {
      name: "Anki Vocab Builder",
      description: userSubscribed
        ? `Create an anki deck containing all the words and their defintions which you didn't know: Front: Word, Back: Definition`
        : "Anki integration is only available for premium users, please subscribe to use this feature.",
      image: ankiIcon,
      onClick: () => {
        if (userSubscribed) {
          //Open in new tab instead
        } else {
          alert.show("Only premium members can access notion exporting", {
            type: "info",
          });
        }
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
