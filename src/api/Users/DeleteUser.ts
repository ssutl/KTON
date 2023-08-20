import axios from "axios";

//API TO VERIFY USER
const DeleteUserApi = async () => {
  //Get token
  const authToken = localStorage.getItem("token");

  //If token is null, throw error
  if (authToken === null) throw new Error("No token found");
  //Simple to verify user
  try {
    const res = await axios({
      method: "DELETE",
      url: `${process.env.NEXT_PUBLIC_BACKENDURL}/users/delete`,
      headers: {
        "x-auth-token": authToken.replace(/\"/g, ""),
      },
    });

    return "success";
  } catch (err) {
    throw new Error("Failed to delete user");
  }
};
export default DeleteUserApi;
