import axios from "axios";

const addUserCategoryApi = async ({ data }: { data: string[] }) => {
  //Get token
  const authToken = localStorage.getItem("token");

  if (authToken === null) throw new Error("No token found");

  //Simple request to update User annotations
  try {
    axios({
      method: "PUT",
      url: `${process.env.NEXT_PUBLIC_BACKENDURL}/users/info`,
      headers: {
        "x-auth-token": authToken.replace(/\"/g, ""),
      },
      data: { categories: data },
    });
  } catch (err) {
    throw new Error("Failed adding category to user");
  }
};
export default addUserCategoryApi;
