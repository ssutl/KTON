import "../styles/globals.scss";
import type { AppProps } from "next/app";
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout/Layout";
import { KTON_Provider } from "@/context/KTONContext";

export default function App({ Component, pageProps }: AppProps) {
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);

  useEffect(() => {
    window.addEventListener("resize", function (event) {
      if (
        window.matchMedia("(orientation: landscape)").matches &&
        window.matchMedia("(hover: none)").matches
      ) {
        setIsMobileLandscape(true);
      } else {
        setIsMobileLandscape(false);
      }
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
          width: "100%",
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
