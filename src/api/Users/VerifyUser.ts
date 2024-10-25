import axios from "axios";

export interface verifyUserApiProps {
  id: string;
  token: string;
}
//API TO VERIFY USER
const verifyUserApi = async ({ id, token }: verifyUserApiProps) => {
  //Simple to verify user
  try {
    const res = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BACKENDURL}/users/verify/${id}/${token}`,
      headers: { "Content-Type": "application/json" },
    });

    if (res.data.JWT_token) {
      //Add token to local storage
      localStorage.setItem("token", res.data.JWT_token);
      localStorage.setItem("username", JSON.stringify(res.data.user.username));
      //On success
      return "verified";
    }
  } catch (err) {
    throw new Error("Failed verifying user");
  }
};
export default verifyUserApi;
