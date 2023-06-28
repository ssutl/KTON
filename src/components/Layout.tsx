import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import React from "react";

const Layout = ({ children }: any) => {
  return (
    <>
      <Navbar />
      <Header />
      {children}
    </>
  );
};

export default Layout;
