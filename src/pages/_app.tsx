import "../styles/globals.scss";
import type { AppProps } from "next/app";
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout/Layout";
import { KTON_Provider } from "@/context/KTONContext";

export default function App({ Component, pageProps }: AppProps) {
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);
  const [isOrientationStable, setIsOrientationStable] = useState(false);

  useEffect(() => {
    handleOrientationChange();

    function handleOrientationChange() {
      if (
        window.matchMedia("(orientation: landscape)").matches &&
        window.matchMedia("(hover: none)").matches
      ) {
        setIsMobileLandscape(true);
      } else {
        setIsMobileLandscape(false);
      }
    }

    function handleResize() {
      handleOrientationChange();

      // Check if the orientation change is stable after a brief delay
      setTimeout(() => {
        setIsOrientationStable(true);
      }, 500);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!isOrientationStable && isMobileLandscape) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "100vh",
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
