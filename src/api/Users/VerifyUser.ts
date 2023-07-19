import axios from "axios";

const verifyUserApi = async ({ id, token }: { id: string; token: string }) => {
  //   Simple request to login user
  try {
    const res = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BACKENDURL}/users/verify/${id}/${token}`,
      headers: { "Content-Type": "application/json" },
    });

    if (res.data.JWT_token) {
      //Add token to local storage
      localStorage.setItem("token", res.data.JWT_token);
      //On success
      return "verified";
    }
  } catch (err) {
    console.log("err: ", err);
    throw err;
  }
};
export default verifyUserApi;
