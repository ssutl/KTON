import axios from "axios";

export interface verifyUserApiProps {
  id: string;
  token: string;
}

const verifyUserApi = async ({ id, token }: verifyUserApiProps) => {
  //   Simple request to login user
  try {
    const res = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BACKENDURL}/users/verify/${id}/${token}`,
      headers: { "Content-Type": "application/json" },
    });

    if (res.data.JWT_token) {
      console.log("res.data: ", res.data);
      //Add token to local storage
      localStorage.setItem("token", res.data.JWT_token);
      localStorage.setItem("user", JSON.stringify(res.data.user.username));
      //On success
      return "verified";
    }
  } catch (err) {
    console.log("err: ", err);
    throw err;
  }
};
export default verifyUserApi;
