import Router from "next/router";

const AllowedRoute = () => {
  //Quick check to see what data user has
  const authToken = localStorage.getItem("token");
  const isDemo = localStorage.getItem("Demo");

  if (!authToken && isDemo === null) {
    Router.push("/");
  }
};

export default AllowedRoute;
