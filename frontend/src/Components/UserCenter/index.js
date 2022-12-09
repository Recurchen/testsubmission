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
    const [subscribe, setSubscribe] = useState(false);
    const [subInfo, setSubInfo] = useState(null);

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
            if(json.is_subscribed === true){
                setSubscribe(true);
            }
            else{
                setSubscribe(false);
            }  
        })
    }, [params])

    useEffect(() => {
        if(subscribe === true){
            fetch(`http://127.0.0.1:8000/subscriptions/users/${id.userId}/details/`,
            {headers: userDetailHeaders
            })
            .then(response => {
                if(response.status === 200){
                    return response.json();  
                }
                else if(response.status === 403){
                    alert("user session ended, close to log in");
                }
            }).then(info_json => {
                console.log(info_json);
                console.log("get sub info succee");
                console.log(info_json.plan_name);
                const temp = (
                    <div>
                    <p className="detailed">Subscribed Plan: {info_json.plan_name}</p >
                    <p className="detailed">Plan Start Time: {info_json.start_time.split('T')[0]+'  '+
                        info_json.start_time.split('T')[1].split('-')[0].split('.')[0] }</p >
                    </div>
                )
                setSubInfo(temp);
            })
        }
    }, [subscribe])

    const navigate = useNavigate();
    const navToEditInfo = ()=>{
        navigate('/usercenter/edit')
    }
    const navToAddPay = ()=>{
        navigate('/payment/method/add')
    }
    const navToEnrollmentHistory = ()=>navigate('/enrollments/')

    const navToEditPay = ()=>{
        navigate('/payment/method/edit')
    }

    const sub = (userInfo) => {
        if(userInfo.is_subscribed){
                return (
                    <div className="detailed">
                        Welcome back our TFC Member!
                        {subInfo}
                    </div >
                )
        }
        else{
            return (
                <p className="detailed">
                    Subscribe now to become our member! 
                </p >
            )
        }
    }
    return (
        <div className="user_center">
        <div className="info">
            <Avatar size="48" 
                        name= {userInfo.username}
                        src= {userInfo.avatar} />
            <h2>{userInfo.username}</h2>
            <br></br>
            <div className="detailed">
                <p className="detailed">Phone Number: {userInfo.phone_number}</p >
                <p className="detailed">Email: {userInfo.email}</p >
                <p className="detailed">First Name: {userInfo.first_name}</p >
                <p className="detailed">Last Name: {userInfo.last_name}</p >
                <div className="detailed">{sub(userInfo)}</div >
            </div>
        </div>
        <div className="buttons">
            <button className="uc-btn" onClick={navToEditInfo}> Edit Personal Info</button>
            <button className="uc-btn" onClick={navToAddPay}> Add Payment Method</button>
            <button className="uc-btn" onClick={navToEditPay}> View/Edit Payment Method</button>
            <button className="uc-btn" onClick={navToEnrollmentHistory}> View Enrollment History</button>

        </div>
        </div>
    )
}

export default UserCenter;