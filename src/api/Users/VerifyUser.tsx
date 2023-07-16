import axios from "axios";
import Router from "next/router";

const verifyUserApi = ({ id, token }: { id: string; token: string }) => {
  //   Simple request to login user

  axios({
    method: "GET",
    url: `${process.env.NEXT_PUBLIC_BACKENDURL}/user/verify/${id}/${token}`,
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => {
      console.log("res: ", res);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        Router.push("/Home");
        //This is going to be available in the then block of the function call
      }
    })
    .catch((err) => {
      console.log("err: ", err);
    });
};
export default verifyUserApi;
