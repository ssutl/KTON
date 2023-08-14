import "../styles/globals.scss";
import type { AppProps } from "next/app";
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout/Layout";
import { KTON_Provider } from "@/context/KTONContext";

export default function App({ Component, pageProps }: AppProps) {
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);

  useEffect(() => {
    if (
      window.matchMedia("(orientation: landscape)").matches &&
      window.matchMedia("(hover: none)").matches
    ) {
      setIsMobileLandscape(true);
    } else {
      setIsMobileLandscape(false);
    }

    screen.orientation.addEventListener("change", (event) => {
      //Set body to display none for 300ms
      document.body.style.display = "none";
      //background  black
      document.body.style.backgroundColor = "black";
      //Set body to display block after 300ms
      setTimeout(() => {
        document.body.style.display = "block";
      }, 300);
      //make window reload
      setTimeout(() => {
        window.location.reload();
      }, 300);
    });
  }, []);

  if (isMobileLandscape) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "100dvh",
          width: "100vw",
        }}
      >
        <h1>请使用竖屏浏览</h1>
        <p>(please use portrait mode to browse)</p>
      </div>
    );
  }

  return (
    <KTON_Provider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </KTON_Provider>
  );
}
