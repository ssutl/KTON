import "../styles/globals.scss";
import type { AppProps } from "next/app";
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout/Layout";
import { KTON_Provider } from "@/context/KTONContext";
import { set } from "lodash";

export default function App({ Component, pageProps }: AppProps) {
  const [isMobileLandScape, setIsMobileLandScape] = useState(false);

  useEffect(() => {
    function handleOrientationChange() {
      console.log("orientationchange");
      if (
        window.matchMedia("(orientation: landscape)").matches &&
        !window.matchMedia("(hover: none)").matches &&
        window.matchMedia("(pointer: coarse)").matches
      ) {
        setIsMobileLandScape(true);
      } else {
        setIsMobileLandScape(false);
      }
    }

    // Listen for the orientationchange event and call the handler function
    window.addEventListener("orientationchange", handleOrientationChange);

    // Call the handler function initially to check the current orientation
    handleOrientationChange();

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  return (
    <KTON_Provider>
      <Layout>
        {isMobileLandScape ? (
          <div>
            <h1>请使用竖屏浏览</h1>
          </div>
        ) : (
          <Component {...pageProps} />
        )}
      </Layout>
    </KTON_Provider>
  );
}
