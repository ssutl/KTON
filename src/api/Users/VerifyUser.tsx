import axios from "axios";
import Router from "next/router";

const verifyUserApi = (id: string) => {
  //   Simple request to login user

  const authToken = localStorage.getItem("token");

  if (authToken === null) return console.log("No auth token found");

  //   axios({
  //     method: "POST",
  //     url: `${process.env.NEXT_PUBLIC_BACKENDURL}/verify/${id}/${authToken}`,
  //     headers: { "Content-Type": "application/json" },
  //     data: { username: email, password: password },
  //   })
  //     .then((res) => {

  //     })
  //     .catch((err) => {
  //       console.log("err: ", err);
  //     });
};
export default verifyUserApi;
