import axios from "axios";

const csvApi = async () => {
  //Get token from local storage
  const authToken = localStorage.getItem("token");

  if (authToken === null) throw new Error("No token found");

  try {
    const response = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BACKENDURL}/books/csv`,
      headers: {
        "x-auth-token": authToken.replace(/\"/g, ""),
      },
    });

    return response.data;
  } catch (err) {
    throw new Error("Failed generating CSV");
  }
};
export default csvApi;
