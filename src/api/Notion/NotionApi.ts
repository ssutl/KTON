import axios from "axios";

const notionApi = (auth_code: string) => {
  //Get token from local storage
  const authToken = localStorage.getItem("token");

  if (authToken === null) throw new Error("No token found");
};
export default notionApi;
