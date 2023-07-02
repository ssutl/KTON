import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import React from "react";

const Layout = ({ children }: any) => {
  //Quick default layout in order to persist navbar and header on every page
  return (
    <>
      <Navbar />
      <Header />
      {children}
    </>
  );
};

export default Layout;
