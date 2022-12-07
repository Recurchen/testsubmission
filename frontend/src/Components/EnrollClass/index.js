import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import './style.css';
import useToken from "../../useToken";

const EnrollClass = () =>{
    const { state } = useLocation();
    const { class_id, class_date } = state;
    const [className, setClassName] = useState('');
    const [coach, setCoach] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [numEnrolled, setNumEnrolled] = useState(0);
    const [classDateList, setClassDateList] = useState([]);
    const [errorMsg, setErrorMsg] = useState();
    let sent = false;
    const token = useToken();
    const navigate = useNavigate();
    const Back = ()=>{
        navigate('/classes/')
    }
    const toLogin = ()=>{
        navigate('/login');
    }
    useEffect(()=>{
        if(token.token === null){
            toLogin();
        }
        else{
            if (sent === false){
            fetch(`http://localhost:8000/classes/enroll/?class_id=${class_id}&class_date=${class_date}`,
                {method:'post',headers: new Headers({
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token.token}`
                    })
                })
                .then(res=>{
                    if (res.status==='301'){
                        console.log(res.status);
                        toLogin();
                    } else{return res;}
            })
                .then(res => res.json())
                .then(json => {
                    if(json.length === 1){
                        setErrorMsg(json);
                    }else if(json.length === 7){
                        setNumEnrolled(json[0]['enroll']);
                        setClassName(json[2]['class_name']);
                        setCoach(json[3]['coach']);
                        setStartTime(json[4]['start_time']);
                        setEndTime(json[5]['end_time']);
                        let arr =[];
                        for(let i = 0; i < json[6]['class_dates'].length; i++){
                            arr.push(json[6]['class_dates'][i]);
                        }
                        setClassDateList(arr);

                    }
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
                    <h2> You have enrolled in <b>{numEnrolled}</b> occurrence of:</h2>
                    <h3>
                        Class Name: {className} <br/>
                        Coach: {coach}<br/>
                        Start time: {startTime}<br/>
                        End time: {endTime}<br/>
                    </h3>
                    {classDateList &&
                        <div className={'classDatesList'}>
                            <h3> Class dates:</h3>
                            <ul className={'classDates'}>
                                {classDateList.map((d, index) => (<li key={index}>{d}</li>))}
                            </ul>
                        </div>
                    }
                    <button className={'back'} onClick={Back}>Back</button>
                </div>
            }


        </div>

    )
}
export default EnrollClass;