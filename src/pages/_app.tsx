import "../styles/globals.scss";
import type { AppProps } from "next/app";
import React, { useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import { KTON_Provider } from "@/context/KTONContext";

export default function App({ Component, pageProps }: AppProps) {
  const [isMobileLandscape, setIsMobileLandscape] = React.useState(false);

  useEffect(() => {
    window.addEventListener("resize", function (event) {
      if (
        window.matchMedia("(orientation: landscape)").matches &&
        window.matchMedia("(hover: none)").matches
      ) {
        setIsMobileLandscape(true);
      }
    });
  }, []);

  if (isMobileLandscape) {
    return (
      <div>
        <h1>请使用竖屏浏览</h1>
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
