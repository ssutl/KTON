import { useState, useEffect } from 'react';
import styles from '../styles/LoginComponent.module.scss';
import LoginApi, { LoginApiReturnType } from '@/api/Users/Login';

const LoginComponent = () => {
	//Collecting information from the user
	const [loginType, setLoginType] = useState<'Login' | 'SignUp'>('Login');
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [loginStatus, setLoginStatus] = useState<LoginApiReturnType>(undefined);

	//Switch between login and signup
	const switchLoginState = () => {
		setLoginType((prevLoginType) => (prevLoginType === 'Login' ? 'SignUp' : 'Login'));
		setLoginStatus(undefined);
	};

	//Handle form submission
	const handleForm = async () => {
		try {
			if (password.length < 8) {
				setLoginStatus('Password must be at least 8 characters long');
			} else {
				const status = await LoginApi({
					type: loginType,
					email: email.toLowerCase(),
					password: password,
				});

				if (status === 'Pending verification') {
					alert('Please verify your email');
					setLoginStatus(status);
				}
			}
		} catch (error: any) {
			setLoginStatus(error);
		}
	};

	return (
		<form
			className={styles.loginSect}
			onClick={(e) => {
				e.stopPropagation();
			}}
			onSubmit={(e) => {
				e.preventDefault();
				handleForm();
			}}
		>
			<div className={styles.loginInfoSect}>
				<p>{loginType === 'Login' ? `Welcome Back` : `Start for free`}</p>
				<h1>
					{loginType === 'Login' ? `Log In` : `Create account`}
					<span>.</span>
				</h1>
				<p onClick={() => switchLoginState()}>
					{loginType === 'Login' ? `Haven't signed up yet?` : `Already a member?`}{' '}
					{loginType === 'Login' ? <span>Create an account</span> : <span>Log In</span>}
				</p>
			</div>
			<div className={styles.loginFormSect}>
				<input
					type="text"
					placeholder="Email"
					required
					value={email}
					autoComplete="off"
					onChange={(e) => {
						setEmail(e.target.value.replace(/\s/g, ''));
						setLoginStatus(undefined);
					}}
				/>
				<input
					type="password"
					placeholder="Password"
					autoComplete="off"
					required
					value={password}
					onChange={(e) => {
						setPassword(e.target.value.replace(/\s/g, ''));
						setLoginStatus(undefined);
					}}
				/>
			</div>
			{loginStatus !== 'Pending verification' && loginStatus ? (
				<div className={styles.loginStatusSect}>{loginStatus}</div>
			) : null}
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
