import "../styles/globals.scss";
import type { AppProps } from "next/app";
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout/Layout";
import { KTON_Provider } from "@/context/KTONContext";

export default function App({ Component, pageProps }: AppProps) {
  const [isMobileLandScape, setIsMobileLandScape] = useState(false);

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsMobileLandScape(
        window.matchMedia("(orientation: landscape)").matches &&
          window.innerWidth <= 768
      );
    };

    console.log(
      window.matchMedia("(orientation: landscape)").matches &&
        window.innerWidth <= 768
    );

    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  console.log("isMobileLandScape", isMobileLandScape);

  useEffect(() => {
    if (isMobileLandScape)
      alert("请使用竖屏浏览 (Please use portrait mode to browse)");
  }, [isMobileLandScape]);

  if (isMobileLandScape)
    return (
      <div>
        <h1>请使用竖屏浏览</h1>
      </div>
    );

  return (
    <KTON_Provider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </KTON_Provider>
  );
}
