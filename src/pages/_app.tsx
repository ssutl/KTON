import "../styles/globals.scss";
import type { AppProps } from "next/app";
import React from "react";
import Layout from "@/components/Layout";
import { KTON_Provider } from "@/context/KTONContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <KTON_Provider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </KTON_Provider>
  );
}
