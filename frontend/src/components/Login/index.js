import React, { useState } from "react";
import {Link, Outlet} from "react-router-dom";
import './style.css';

const Login = (props) => {
    const [username, setUsername] = useState('');
    const [pass, setPass] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const b = {"username": `${username}`,
                    "password":`${pass}`};
        fetch('http://127.0.0.1:8000/accounts/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(b),})
            .then(res=>res.json())
            .then(json => console.log(json))
            // TODO: redirect
    }

    return (
        <div className="auth-form-container">
            <h2 className="log-reg-title">Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="enter your username here" id="username" name="username" />
                <label htmlFor="password">Password</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                <button className="reg-log-btn" id="submit" type="submit">Log In</button>
            </form>
            <Link to="/register" className="link-btn">Don't have an account? Register here.</Link>
        </div>
    )
}

export default Login;