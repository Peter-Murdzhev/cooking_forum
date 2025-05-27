import { React, useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../components/Auth'
import axios from 'axios';

const LoginPage = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("")
	const auth = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const redirectPath = location.state?.path || "/";

	useEffect(() => {
		if (auth.user) {
			navigate(redirectPath, { replace: true });
		}
	}, [auth.user]);

	const handleLogin = async () => {
		try {
			const response = await axios.post("http://localhost:8080/api/v1/auth/login",
				{
					username: username,
					password: password
				},
				{
					withCredentials: true,
					headers: { Authorization: `Basic ${btoa(username + ":" + password)}` }
					//"Authorization": "Basic " + btoa(`${username}:${password}`)
				})

			auth.login(response.data);
			navigate(redirectPath, { replace: true });
		} catch (error) {
			if (error.response) {
				setErrorMessage(error.response.data.authentication);
			}
		}
	}

	const handleKeyDown = event => {
		if (event.key === "Enter") {
			event.preventDefault();
			handleLogin();
		}
	};

	return (
		<div>
			<form className="login" action="/login" method="POST" onSubmit={e => e.preventDefault()}>
				<input type="text" name="account" value={username}
					onChange={e => setUsername(e.target.value)} onKeyDown={handleKeyDown}
					placeholder="Enter username" />
				<br /><br />
				<input type="password" name="password" value={password}
					onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyDown}
					placeholder="Enter password" />
				{errorMessage ? <p>{errorMessage}</p> : <br />}
				<button type="submit" name="Log in" onClick={handleLogin}>Login</button>
				<br /><br />
				<Link id="register_link" to="/register">Click here to create an account</Link>
			</form>
		</div>
	)
}

export default LoginPage;