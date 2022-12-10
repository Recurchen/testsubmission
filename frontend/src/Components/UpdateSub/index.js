import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
// import './style.css';
import useToken from "../../useToken";
import useUserId from "../../useUserId";

const UpdateSub = () =>{
    const { state } = useLocation();
    const { plan_id, plan_name } = state;
    const [errorMsg, setErrorMsg] = useState();
    
    let sent = false;
    const token = useToken();
    const user_id = useUserId();
    const navigate = useNavigate();
    const Back = ()=>{
        navigate('/plans')
    }
    const toLogin = ()=>{
        navigate('/login');
    }

    const credentials = {"plan": plan_id}
    
    useEffect(()=>{
        console.log(credentials);
        if(token.token === null){
            toLogin();
        }
        else{
            if (sent === false){
            fetch(`http://127.0.0.1:8000/subscriptions/users/${user_id.userId}/update/`,
                {method:'post',
                headers: new Headers({
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token.token}`
                    }),
                body: JSON.stringify(credentials)
                })
                .then(res=>{
                    if (res.status==='301'){
                        console.log(res.status);
                        toLogin();
                    } else{return res;}
            })
                .then(res => res.json())
                .then(json => {
                    console.log(json);
                });
            sent = true;
        }}

    },[state]
    )
    return (
        <div className='confirmation'>
            { errorMsg &&
                <span className="error">
                    { errorMsg }  <br/>
                    <button className={'back'} onClick={Back}
                    >
                        Back</button>
                    <br/>

                </span> }
            { !errorMsg &&
                <div>
                    <h1 className={"success"}> Successful!</h1>
                    <br/>
                    <h2> You have updated to <b>{plan_name}</b></h2>
                    <button className={'back'} onClick={Back}>View Subscription</button>
                </div>
            }


        </div>

    )


}

export default UpdateSub;
