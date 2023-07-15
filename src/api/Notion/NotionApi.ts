import axios from "axios";

const notionApi = (auth_code: string) => {
  //Get token from locla storage
  const authToken = localStorage.getItem("token");

  if (authToken === null) return console.log("No auth token found");
};
export default notionApi;
