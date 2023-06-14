import "../styles/globals.scss";
import type { AppProps } from "next/app";
// pages/_app.js
import React from "react";
import Head from "next/head";
import Layout from "@/components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
