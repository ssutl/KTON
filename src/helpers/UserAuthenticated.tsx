const userAuthenticated = () => {
  //Quick check to see if the user is authenticated or not

  let authToken;
  let clippings;

  // if (typeof window !== "undefined") {
  authToken = localStorage.getItem("token");
  clippings = localStorage.getItem("clippings");
  // }

  if (authToken) {
    //Pass user into the app without restrictions
    return true;
  } else if (clippings && !authToken) {
    return false;
  } else {
    return false;
  }
};

export default userAuthenticated;
