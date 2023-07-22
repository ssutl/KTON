import axios, { Axios, AxiosError } from "axios";
import Router from "next/router";

export type LoginApiReturnType =
  | "pending verification"
  | "Invalid Credentials"
  | "Password must be at least 8 characters long"
  | undefined;

const LoginApi = async ({
  type,
  email,
  password,
}: {
  type: "Login" | "SignUp";
  email: string;
  password: string;
}): Promise<LoginApiReturnType> => {
  try {
    const res = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKENDURL}/${
        type === "Login" ? `login` : `users`
      }`,
      headers: { "Content-Type": "application/json" },
      data: { username: email, password: password },
    });

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      Router.push("/Home");
    } else if (res.data.msg === "An email has been sent to the user account") {
      return "pending verification";
    } else {
      throw new Error("Unexpected error occurred");
    }
  } catch (err: any) {
    if (err.response && err.response.status === 400) {
      if (
        err.response.data.msg === "invalid credentials" ||
        err.response.data.msg === "user already exists"
      ) {
        throw "Invalid Credentials";
      } else if (
        err.response.data.msg === "Please verify your email before logging in"
      ) {
        throw "Please verify your email before logging in";
      } else {
        throw "Invalid email";
      }
    } else {
      throw err;
    }
  }
};

export default LoginApi;
