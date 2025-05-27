import axios from 'axios';
import { useState } from 'react'
import { useAuth } from './Auth';
import { useNavigate } from 'react-router-dom';

const ChangeUserInfoForm = () => {
  const auth = useAuth();
  const [passwordEntity, setPasswordEntity] = useState({
    oldPassword: "",
    password: "",
    repeatPassword: ""
  });
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handlePasswordInputs = (e) => {
    const { name, value } = e.target;

    setPasswordEntity(entity => ({
      ...entity,
      [name]: value
    }))
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordEntity.password !== passwordEntity.repeatPassword) {
      setMessage("passwords don't match!");
      return;
    }

    await axios.put(`http://localhost:8080/api/v1/user/change-password/${auth.user.id}`, {
      oldPassword: passwordEntity.oldPassword,
      newPassword: passwordEntity.password
    },
      { withCredentials: true }
    ).then(response =>{
      setMessage(response.data)
      setPasswordEntity(() =>({
          oldPassword: "",
          password: "",
          repeatPassword: ""
      })
      )
    } 
    ).catch(error => {
      setMessage(error.response.data)
    }) 
  }

  const deleteAccount = async (e) => {
    e.preventDefault();
    const isConfirmed = window.confirm("Are you sure you want to delete your account?")

    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/v1/user/delete/${auth.user.id}`,
          { withCredentials: true })

        await axios.post("http://localhost:8080/api/v1/auth/logout", {},
          { withCredentials: true })
        auth.logout()
        navigate("/", { replace: true })
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleKeyDown = event => {
    if (event.key === "Enter")
    event.preventDefault();
    handlePasswordChange();
  }

  return (
    <>
      <div className="password_change">
        <h3>Change password</h3>

        <form>
          <input name="oldPassword" type="password" value={passwordEntity.oldPassword}
            onChange={handlePasswordInputs} placeholder="Enter old password"></input>
          <input name="password" type="password" value={passwordEntity.password}
            onChange={handlePasswordInputs} placeholder="Enter new password"></input>
          <input name="repeatPassword" type="password" value={passwordEntity.repeatPassword}
            onChange={handlePasswordInputs} placeholder="Repeat new password"
            onKeyDown={handleKeyDown}></input>
          <br />
          {message && <p>{message}</p>}
          <button onClick={handlePasswordChange}>Send</button>
        </form>
      </div>

      <div className="delete_account">
        <button onClick={deleteAccount}>Delete Account</button>
      </div>
    </>

  )
}

  export default ChangeUserInfoForm;