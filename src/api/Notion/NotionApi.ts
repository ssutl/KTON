import axios from "axios";

const notionApi = async (auth_code: string) => {
  //Get token from local storage
  const authToken = localStorage.getItem("token");

  if (authToken === null) throw new Error("No token found");

  try {
    axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKENDURL}/books/notion`,
      headers: {
        "x-auth-token": authToken.replace(/\"/g, ""),
      },
      data: { code: auth_code },
    });
  } catch (err) {
    throw new Error("Failed publishing to Notion");
  }
};
export default notionApi;
