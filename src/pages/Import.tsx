import AllowedRoute from "@/helpers/AllowedRoute";
import React, { useEffect } from "react";

const ImportPage = () => {
  useEffect(() => {
    //check if this is an allowed route
    AllowedRoute();
  }, []);

  return (
    <div>
      <h1>Import Page</h1>
    </div>
  );
};

export default ImportPage;
