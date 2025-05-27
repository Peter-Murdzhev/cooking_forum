import axios from 'axios';
import { React, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Auth'

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();


  const registerUser = async () => {
    if (password != repeatPassword) {
      setErrors(["both passwords don't match."])
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/v1/auth/register",
        {
          username: username,
          email: email,
          password: password
        }, { withCredentials: true }
      )

      //removes the errors on successful register request
      setErrors([])
      setSuccess(true);

      setTimeout(() => {
        navigate("/login", { replace: true })
      }, 5000)

    } catch (error) {
      if (error.response) {
        const messages = error.response.data;
        setErrors(messages);
      }
    }
  }

  const handleKeyDown = event => {
    if (event.key === "Enter") {
      event.preventDefault();
      registerUser();
    }
  };

  return (
    <div>
      <form className="register" action="/register" method="POST" autoComplete="off"
        onSubmit={e => e.preventDefault()}>

        <input type="text" name="account" value={username}
          onChange={e => setUsername(e.target.value)} placeholder="Enter username" onKeyDown={handleKeyDown} />
        <br />
        {errors.username ? <>{errors.username} <br /><br /></> : <br />}
        <input type="password" name="fake_password" style={{ display: "none" }} autoComplete="off" />
        <input type="text" name="email" value={email}
          onChange={e => setEmail(e.target.value)} placeholder="Enter email" onKeyDown={handleKeyDown} />
        <br />
        {errors.email ? <>{errors.email} <br /><br /></> : <br />}
        <input type="password" name="password" value={password}
          onChange={e => setPassword(e.target.value)} placeholder="Enter password" onKeyDown={handleKeyDown} />
        <br />
        {errors.password ? <>{errors.password} <br /><br /></> : <br />}
        <input type="password" name="password" value={repeatPassword}
          onChange={e => setRepeatPassword(e.target.value)} placeholder="Repeat password" onKeyDown={handleKeyDown} />
        <br />

        {errors.length > 0 && errors.map((error, index) => <p key={index}>{error}</p>)}
        {success && <p>Successfully registered! You will be redirected in 5 seconds.</p>}

        <button type="submit" name="Register" onClick={registerUser} >Register</button>
      </form>
    </div>

  )
}

export default RegisterPage;