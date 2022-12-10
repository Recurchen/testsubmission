import React, { useState } from "react";
import './style.css';
import {Link, Outlet} from "react-router-dom";
import PopUp from "../Popup";
import Header from '../header';
import Footer from '../footer';
import Top_Nav_Menu from "../top_nav_menu";



const Register = (props) => {
    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [pass1, setPass1] = useState('');
    const [pass2, setPass2] = useState('');
    const [success, setSuccess] = useState();

    function showSuccess(){
       setSuccess(!success);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append("username", `${username}`);
        formData.append("password", `${pass1}`);
        formData.append("password2", `${pass2}`);
        formData.append("email", `${email}`);
        formData.append("first_name", `${firstname}`);
        formData.append("last_name", `${lastname}`);
        if(phone){ formData.append("phone_number", `${phone}`);}
        if(avatar){formData.append('avatar', avatar);}

        for (const pair of formData.entries()){
              console.log(`${pair[0]},${pair[1]}`);
        }

        var registered = false;
        var message = "Sorry, register failed as: \n";

        fetch('http://localhost:8000/accounts/register/', {
            method: 'POST',
            body: formData,
            redirect: "follow" })
            .then(res=>{
              if(res.status === 200){
                     registered = true;
              }
              return res.json();
            }).then(json => {
              console.log(json);

              if(registered){showSuccess();
              }else{
              for (const [key, value] of Object.entries(json)){
                     if(key === 'password2'){
                            message = message + "confrim password: This field may not be blank.\n"
                     }
                     else{const temp = `${key}: ${value}\n`;
                     message = message + temp;}
              }
              alert(message);
              }});
    }

    return (
       <div>
       < Header />
       < Top_Nav_Menu />
        <div className="auth-form-container">
            <h2 className="log-reg-title" >Register</h2>
            <div>
              {success ? <PopUp /> : null}
              </div>
        <form className="register-form" onSubmit={handleSubmit}>
            <label htmlFor="username">Username*</label>
            <input className="reg-input" value={username} 
                   onChange={(e) => setUsername(e.target.value)}
                   name="username" 
                   id="username" 
                   placeholder="enter your username" />
            <label htmlFor="email">Email*</label>
            <input className="reg-input" value={email} 
                   onChange={(e) => setEmail(e.target.value)}
                   type="email" 
                   placeholder="enter your email" 
                   id="email" 
                   name="email" />
            <label htmlFor="firstname">First Name*</label>
            <input value={firstname} 
                   onChange={(e) => setFirstname(e.target.value)}
                   placeholder="enter your first name"
                   id="firstname" 
                   name="firstname"
                   className="reg-input" />
            <label htmlFor="lastname">Last Name*</label>
            <input value={lastname} 
                   onChange={(e) => setLastname(e.target.value)}
                   placeholder="enter your last name"
                   id="lastname" 
                   name="lastname"
                   className="reg-input" />
            <label htmlFor="phone">Phone Number</label>
            <input value={phone} 
                   onChange={(e) => setPhone(e.target.value)}
                   placeholder="enter your phone number"
                   type="tel"
                   id="phone" 
                   name="phone" 
                   className="reg-input"/>
            <label id="avatar-label" htmlFor="avatar">Upload Your Avatar</label>   
            <input 
              //      value={avatar} 
                   onChange={(e) => setAvatar(e.target.files[0])}
                   type="file"
                   id="avatar" 
                   name="avatar"
                   accept="image/png, image/jpeg" 
                   className="reg-input"/>           
            <label htmlFor="pass1">Password*</label>
            <input value={pass1} 
                   onChange={(e) => setPass1(e.target.value)} 
                   type="password" 
                   placeholder="enter your password" 
                   id="pass1" 
                   name="pass1" 
                   className="reg-input"/>
            <label htmlFor="pass1">Confirm Password*</label>
            <input value={pass2} 
                   onChange={(e) => setPass2(e.target.value)} 
                   type="password" 
                   placeholder="confirm your password" 
                   id="pass2" 
                   name="pass2" 
                   className="reg-input"/>
            <button className="reg-log-btn" id="submit" type="submit">Sign Up</button>
        </form>
        <Link to="/login" className="link-btn">Already have an account? Login here.</Link>
    </div>
     <Footer />
    </div>
    )
}

export default Register;
