import {useContext, useEffect, useState} from "react";
import { Avatar } from '@material-ui/core';

import { useNavigate } from "react-router-dom";
import './style.css';
import useToken from "../../useToken";
import useUserId from "../../useUserId";

const UserCenter = () => {
    // const navigate = useNavigate();
    // const toFilter = (method)=>{
    //     navigate('/classes/filter', { state: { method:method } })
    // }
    const token = useToken();
    const id = useUserId();
    const [userInfo, setUserInfo] = useState('');
    const [params, setParams] = useState({page: 1});

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
            console.log(json);
            setUserInfo(json);    
        })
    }, [params])

    const sub = (userInfo) => {
        if(userInfo.is_subscribed){
            return (
                <p className="detailed">
                    Welcome back our TFC Member!
                </p>
            )
        }
        else{
            return (
                <p className="detailed">
                    Subscribe now to become our member! 
                </p>
            )
        }
    }

    return (
        
        <div className="user_center">
            <Avatar size="48" 
                        name= {userInfo.username}
                        src= {userInfo.avatar} />
            <h2>{userInfo.username}</h2>
            <br></br>
            <div className="detailed">
                <p className="detailed">Phone Number: {userInfo.phone_number}</p>
                <p className="detailed">Email: {userInfo.email}</p>
                <p className="detailed">First Name: {userInfo.first_name}</p>
                <p className="detailed">Last Name: {userInfo.last_name}</p>
                {sub(userInfo)}
            </div>
        </div>
    )
}

export default UserCenter;