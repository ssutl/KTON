import "../styles/globals.scss";
import type { AppProps } from "next/app";
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout/Layout";
import { KTON_Provider } from "@/context/KTONContext";
import { positions, Provider, transitions } from "react-alert";
import { Alert } from "@mui/material";

const template = ({ options, message }: any) => {
  return (
    <Alert
      severity={options.type}
      style={{
        backgroundColor: "#262626",
        color: "#fff",
        marginTop: "20px",
        borderRadius: "3px",
        maxWidth: "400px",
        textAlign: "center",
      }}
    >
      {message}
    </Alert>
  );
};

const options = {
  timeout: 3500,
  position: positions.TOP_CENTER,
  transition: transitions.FADE,
};

export default function App({ Component, pageProps }: AppProps) {
  // const [isMobileLandscape, setIsMobileLandscape] = useState(false);

  // useEffect(() => {
  //   if (
  //     window.matchMedia("(orientation: landscape)").matches &&
  //     window.matchMedia("(hover: none)").matches
  //   ) {
  //     setIsMobileLandscape(true);
  //   } else {
  //     setIsMobileLandscape(false);
  //   }

  //   screen.orientation.addEventListener("change", (event) => {
  //     //make window reload
  //     window.location.reload();
  //   });
  // }, []);

  // if (isMobileLandscape) {
  //   return (
  //     <div
  //       style={{
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         flexDirection: "column",
  //         height: "100dvh",
  //         width: "100vw",
  //       }}
  //     >
  //       <h1>请使用竖屏浏览</h1>
  //       <p>(please use portrait mode to browse)</p>
  //     </div>
  //   );
  // }

  return (
    <KTON_Provider>
      <Provider template={template} {...options}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </KTON_Provider>
  );
}
