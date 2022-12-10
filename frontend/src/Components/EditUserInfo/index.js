import React, { useState, useEffect } from "react";
import './style.css';
import {Link, Outlet} from "react-router-dom";
import PopUp from '../Popup'; 
import useToken from "../../useToken";
import useUserId from "../../useUserId";
import { useNavigate } from "react-router-dom";

const EditUserInfo = (props) => {

    const token = useToken();
    const id = useUserId();

    const [params, setParams] = useState({page: 1});
    const [currUser, setCurrUser] = useState('');

    const userDetailHeaders = new Headers({
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token.token}`
    })

    useEffect(() => {
        const { page } = params;
        fetch(`http://127.0.0.1:8000/accounts/users/${id.userId}/detail/`,
        {headers: userDetailHeaders
        })
        .then(res => res.json())
        .then(json => {
            setCurrUser(json);  
        })
    }, [params])

    const editHeaders = new Headers({
        'Authorization' : `Bearer ${token.token}`
    })

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [avatar, setAvatar] = useState(null);

    const navigate = useNavigate();
    const navToUserCenter = ()=>{
        navigate('/usercenter', {})
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        if(firstname){formData.append("first_name", `${firstname}`);}
        if(lastname){formData.append("last_name", `${lastname}`);}
        if(email){formData.append("email", `${email}`);}
        if(phone){formData.append("phone_number", `${phone}`);}

        fetch(`http://localhost:8000/accounts/users/${id.userId}/detail/`, {
            method: 'PUT',
            body: formData,
            headers: editHeaders})
            .then(res=>{
                console.log(res);
              if(res.status === 200){
                     navToUserCenter();
              }
            })
    }

    return (
        <div className="auth-form-container">
            <h2 className="log-reg-title" >Change Your Personal Info Here</h2>
            <div>
              </div>
        <form className="register-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input value={email} 
                   onChange={(e) => setEmail(e.target.value)}
                   type="email" 
                   placeholder= {`${currUser.email}`}
                   id="email" 
                   name="email" />
            <label htmlFor="firstname">First Name</label>
            <input value={firstname} 
                   onChange={(e) => setFirstname(e.target.value)}
                   placeholder= {`${currUser.first_name}`}
                   id="firstname" 
                   name="firstname" />
            <label htmlFor="lastname">Last Name</label>
            <input value={lastname} 
                   onChange={(e) => setLastname(e.target.value)}
                   placeholder= {`${currUser.last_name}`}
                   id="lastname" 
                   name="lastname" />
            <label htmlFor="phone">Phone Number</label>
            <input value={phone} 
                   onChange={(e) => setPhone(e.target.value)}
                   placeholder= {`${currUser.phone_num}`}
                   type="tel"
                   id="phone" 
                   name="phone" />
            <label htmlFor="avatar">Upload Your Avatar</label>   
            <input 
              //      value={avatar} 
                   onChange={(e) => setAvatar(e.target.files[0])}
                   type="file"
                   id="avatar" 
                   name="avatar"
                   accept="image/png, image/jpeg" />           
            <button className="reg-log-btn" id="submit" type="submit">Update</button>
        </form>
    </div>
    )
}

export default EditUserInfo;
