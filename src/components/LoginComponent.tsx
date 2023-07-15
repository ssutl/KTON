import { useState } from "react";
import styles from "../styles/LoginComponent.module.scss";
import LoginApi from "@/api/Users/Login";

const LoginComponent = () => {
  const [loginType, setLoginType] = useState<"Login" | "SignUp">("Login");
  const [email, setEmail] = useState<string>("");
  console.log("email: ", email);
  const [password, setPassword] = useState<string>("");
  console.log("password: ", password);

  const switchLoginState = () => {
    setLoginType((prevLoginType) =>
      prevLoginType === "Login" ? "SignUp" : "Login"
    );
  };

  const handleForm = () => {
    //presence check for email and password
    if (email !== "" && password !== "") {
      LoginApi({
        type: loginType,
        email: email.toLowerCase(),
        password: password,
      });
    }
  };

  return (
    <form
      className={styles.loginSect}
      onSubmit={(e) => {
        e.preventDefault();
        handleForm();
      }}
    >
      <div className={styles.loginInfoSect}>
        <p>{loginType === "Login" ? `Welcome Back` : `Start for free`}</p>
        <h1>{loginType === "Login" ? `Log In.` : `Create account.`}</h1>
        <p onClick={() => switchLoginState()}>
          {loginType === "Login"
            ? `Haven't signed up yet?`
            : `Already a member?`}{" "}
          {loginType === "Login" ? (
            <span>Create an account</span>
          ) : (
            <span>Log In</span>
          )}
        </p>
      </div>
      <div className={styles.loginFormSect}>
        <input
          type="text"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className={styles.loginButtonSect}>
        <input type="submit" value="Submit" id="loginSubmitInput"></input>
        <label htmlFor="loginSubmitInput" className={styles.submitBtn}>
          Submit
        </label>
      </div>
    </form>
  );
};

export default LoginComponent;
