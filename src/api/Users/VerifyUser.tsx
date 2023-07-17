import axios from "axios";
import Router from "next/router";

const verifyUserApi = ({ id, token }: { id: string; token: string }) => {
  //   Simple request to login user

  return new Promise((resolve, reject) => {
    axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BACKENDURL}/users/verify/${id}/${token}`,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        console.log("res: ", res);
        if (res.data.token) {
          resolve("User verified");
          localStorage.setItem("token", res.data.token);
          Router.push("/Import");
          //This is going to be available in the then block of the function call
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export default verifyUserApi;
