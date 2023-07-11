import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import styles from "../styles/Navbar.module.scss";
import notionApi from "@/api/Notion/NotionApi";

//interface ExportProps {}

const Export = () => {
  // const [notionCode, setNotionCode] = useState<string>("");
  const router = useRouter();

  const getCodeFromUrl = () => {
    //the router may not contain the code, so we need to check if undefined

    const code = router.pathname.split("code=")[-1].split("&state=")[0];
    // setNotionCode(code);
    notionApi(code);
  };

  useEffect(() => {
    if (router.pathname === "/Export") {
    } else {
      getCodeFromUrl();
    }
  }, []);

  return (
    <div>
      <a href="https://api.notion.com/v1/oauth/authorize?client_id=7081a522-2c1f-445b-8a37-d73e11076dcd&response_type=code&owner=user&redirect_uri=https%3A%2F%2Fkton-revolutions.vercel.app%2FExport">
        notion
      </a>
    </div>
  );
};

export default Export;
