import axios from "axios";
import Router from "next/router";

const LoginApi = ({
  type,
  email,
  password,
}: {
  type: "Login" | "SignUp";
  email: string;
  password: string;
}) => {
  //   Simple request to update summaries
  axios({
    method: "POST",
    url: `${process.env.NEXT_PUBLIC_BACKENDURL}/${
      type === "Login" ? `login` : `users`
    }`,
    headers: { "Content-Type": "application/json" },
    data: { username: email, password: password },
  })
    .then((res) => {
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        Router.push("/Home");
      } else if (res.data === "An email has been sent to the user account") {
        alert("An email has been sent to the user account, verify dere");
      } else throw new Error("No token returned");
    })
    .catch((err) => {
      console.log("err: ", err);
    });
};
export default LoginApi;
