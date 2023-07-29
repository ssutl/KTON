import Router from "next/router";

const AllowedRoute = () => {
  //Quick check to see what data user has
  const authToken = localStorage.getItem("token");
  const clippings = localStorage.getItem("clippings");

  if (authToken || clippings) {
    //Pass user into the app without restrictions
    return true;
    //If they dont have both and there not on verify page send them to login.
    //Use regex to check if they are on verify page as it has a dynamic route
  } else if (!clippings && !authToken) {
    Router.push("/login");
    return false;
  }
};

export default AllowedRoute;
