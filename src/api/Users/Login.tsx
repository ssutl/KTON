import axios from "axios";
import Router from "next/router";

//specify the valid return values that the LoginApi function can provide.
export type LoginApiReturnType =
  | "pending verification"
  | "Incorrect password"
  | "Invalid email"
  | "Password must be at least 8 characters long"
  | undefined;

const LoginApi = ({
  type,
  email,
  password,
}: {
  type: "Login" | "SignUp";
  email: string;
  password: string;
}): Promise<LoginApiReturnType> => {
  //Creating a new promise to handle the async nature of axios
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKENDURL}/${
        type === "Login" ? `login` : `users`
      }`,
      headers: { "Content-Type": "application/json" },
      data: { username: email, password: password },
    })
      .then((res) => {
        console.log("res: ", res);
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          Router.push("/Home");
          //This is going to be available in the then block of the function call
        } else if (res.data === "An email has been sent to the user account") {
          //This is going to be available in the then block of the function call
          resolve("pending verification");
        } else {
          //This is going to be available in the catch block of the function call
          reject(new Error("Unexpected error occurred"));
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          if (err.response.data.msg === "invalid credentials") {
            reject("Incorrect password");
          } else if (err.response.data.msg === "user already exists") {
            reject("User already exists");
          } else if (
            err.response.data.msg ===
            "Please verify your email before logging in"
          ) {
            reject("Please verify your email before logging in");
          } else {
            reject("Invalid email");
          }
        } else {
          reject(err);
        }
      });
  });
};
export default LoginApi;
