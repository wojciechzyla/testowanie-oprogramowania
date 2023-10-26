import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom'; 

function Register(props) {
	const navigate = useNavigate()
    const [loginForm, setloginForm] = useState({
      login: "",
      password: ""
    })

    function register(event) {
      axios({
        method: "POST",
        url:"http://127.0.0.1:5000/register",
        data:{
          login: loginForm.login,
          password: loginForm.password
         }
      })
      .then((response) => {
        navigate("/");
      }).catch((error) => {
        if (error.response) {
          console.error(error.response)
          console.error(error.response.status)
          console.error(error.response.headers)
          }
      })

      setloginForm(({
        login: "",
        password: ""}))

      event.preventDefault()
    }

    function handleChange(event) { 
      const {value, name} = event.target
      setloginForm(prevNote => ({
          ...prevNote, [name]: value})
      )}

    return (
      <div>
        <h1>Podaj dane</h1>
          <form className="login">
              <input onChange={handleChange} 
                    type="login"
                    data-testid="test-login"
                    text={loginForm.login} 
                    name="login" 
                    placeholder="Login" 
                    value={loginForm.login} />
              <input onChange={handleChange} 
                    type="password"
                    data-testid="test-password"
                    text={loginForm.password} 
                    name="password" 
                    placeholder="Password" 
                    value={loginForm.password} />
            <button onClick={register}>Wyślij</button>
          </form>
      </div>
    );
}

export default Register;