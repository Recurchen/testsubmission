import React, { useState } from "react";
import Header from '../header';
import Footer from '../footer';
import Top_Nav_Menu from "../top_nav_menu";
import {Link, useNavigate} from "react-router-dom";
import PropTypes from 'prop-types';
import './style.css';

async function loginUser(credentials) {
    var succ = false;
    return fetch('http://localhost:8000/accounts/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify(credentials)})
        .then(res => {
            if (res.status === 200){
                succ = true;
            }
            return res.json()
        }).then(json => {
            if(succ){
                return json;
            }
            else{
                alert(json.detail);
            }
        })
}

export default function Login({ setToken, setUserId }) {
    const [username, setUsername] = useState('');
    const [pass, setPass] = useState('');
    // const [userId, setUserId] = useState('')
    // const [token, setToken] = useState();

    const navigate = useNavigate();
    const navToMain = ()=>{
        navigate('/', {});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = {"username": `${username}`,
                    "password":`${pass}`};
        const response = await loginUser(body);
        const token = response.tokens.access;
        setUserId(response.id);
        setToken(token);
        navToMain();
    }

    return (
        <div>
            <Header />
            <Top_Nav_Menu />
            <div className="auth-form-container">
                
                <h2 className="log-reg-title">Login</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <label className="login-label" htmlFor="username">Username</label>
                    <input className="login-input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="enter your username here" id="username" name="username" />
                    <label className="login-label" htmlFor="password">Password</label>
                    <input className="login-input" value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                    <button className="reg-log-btn" id="submit" type="submit">Log In</button>
                </form>
                <Link to="/register" className="link-btn">Don't have an account? Register here.</Link>
                
            </div>
            <Footer />
        </div>
    )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired, 
    setUserId: PropTypes.func.isRequired
  };