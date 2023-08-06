import axios from "axios";

//API TO ADD CATEGORY (FOR HIGHLIGHTS) TO USER

const addUserCategoryApi = async ({ data }: { data: string[] }) => {
  //Get token
  const authToken = localStorage.getItem("token");

  //If token is null, throw error
  if (authToken === null) throw new Error("No token found");

  //Simple request to update the categories field of user, these will be options for user to choose from when adding categories to highlights
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
