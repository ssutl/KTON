import axios from "axios";

const notionApi = async (auth_code: string) => {
  //Get token from local storage
  const authToken = localStorage.getItem("token");

  if (authToken === null) throw new Error("No token found");

  // try {
  //   axios({
  //     method: "PUT",
  //     url: `${process.env.NEXT_PUBLIC_BACKENDURL}/books/notion`,
  //     headers: {
  //       "x-auth-token": authToken.replace(/\"/g, ""),
  //     },
  //     data: { category: data },
  //   });
  // } catch (err) {
  //   throw new Error("Failed adding category to highlight");
  // }
};
export default notionApi;
