import axios, { Axios, AxiosError } from "axios";
import Router from "next/router";

export type LoginApiReturnType =
  | "Pending verification"
  | "Invalid Credentials"
  | "Password must be at least 8 characters long"
  | undefined;

export interface LoginApiProps {
  type: "Login" | "SignUp";
  email: string;
  password: string;
}

//API TO LOGIN OR SIGNUP

const LoginApi = async ({
  type,
  email,
  password,
}: LoginApiProps): Promise<LoginApiReturnType> => {
  //Try to login user
  try {
    const res = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKENDURL}/${
        type === "Login" ? `login` : `users`
      }`,
      headers: { "Content-Type": "application/json" },
      data: { username: email, password: password },
    });

    //On success for login and signup there are 2 possible responses, for login: User exists well done heres a token pass into app. For signup: User created, please verify email.

    //If token is returned, store it in local storage and redirect to home page
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", JSON.stringify(res.data.user.username));
      Router.push("/Home");
      //If user is not verified, return "Pending verification"
    } else if (res.data.msg === "An email has been sent to the user account") {
      return "Pending verification";
    } else {
      throw new Error("Unexpected error occurred");
    }
  } catch (err: any) {
    //On failure for login and signup there are 4 possible responses, for login: Invalid credentials, user does not exist or email not verified. For signup: User already exists.

    if (err.response && err.response.status === 400) {
      if (
        err.response.data.msg === "invalid credentials" ||
        err.response.data.msg === "user does not exist"
      ) {
        throw "Invalid Credentials";
      } else if (err.response.data.msg === "user already exists") {
        throw "User already exists";
      } else if (
        err.response.data.msg === "Please verify your email before logging in"
      ) {
        throw "Please verify your email before logging in";
      } else {
        throw new Error("Unexpected error occurred");
      }
    } else {
      throw new Error("Unexpected error occurred");
    }
  }
};

export default LoginApi;
