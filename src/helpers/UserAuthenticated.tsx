import Router from "next/router";

const userAuthenticated = () => {
  //Quick check to see if the user is authenticated or not
  const authToken = localStorage.getItem("token");
  const clippings = localStorage.getItem("clippings");

  if (authToken) {
    //Pass user into the app without restrictions
    return true;
  } else if (clippings && !authToken) {
    return false;
  } else {
    Router.push("/");
    return false;
  }
};

export default userAuthenticated;
