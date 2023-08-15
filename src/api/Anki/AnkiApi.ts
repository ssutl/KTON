import axios from "axios";

const ankiApi = async () => {
  //Get token from local storage
  const authToken = localStorage.getItem("token");

  if (authToken === null) throw new Error("No token found");

  try {
    axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BACKENDURL}/books/generate-anki-deck`,
      headers: {
        "x-auth-token": authToken.replace(/\"/g, ""),
      },
    });
  } catch (err) {
    throw new Error("failed to generate anki deck");
  }
};
export default ankiApi;
