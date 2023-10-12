import Router from "next/router";

const AllowedRoute = () => {
  //Quick check to see what data user has
  const authToken = localStorage.getItem("token");
  const isDemo = localStorage.getItem("Demo") === "true";

  if (!authToken && !isDemo) {
    Router.replace("/");
  }
};

export default AllowedRoute;
