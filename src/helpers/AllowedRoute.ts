import Router from "next/router";

const AllowedRoute = () => {
  //Quick check to see what data user has
  const authToken = localStorage.getItem("token");
  const clippings = sessionStorage.getItem("clippings");

  if (!authToken) {
    Router.push("/");
  }
};

export default AllowedRoute;
