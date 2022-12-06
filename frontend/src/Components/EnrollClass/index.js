import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";


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
    useEffect(()=>{
        if (sent === false){
            fetch(`http://localhost:8000/classes/enroll/?class_id=${class_id}&class_date=${class_date}`,
                {method:'post',
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
        }
    },[state]
    )
    return (
        <>
            { errorMsg &&
                <span className="error"> { errorMsg } </span> }
            { !errorMsg &&
                <div>
                    <h1> Successful!</h1>
                    <br/>
                    <p> You have enrolled in {numEnrolled} occurrence of.</p>
                    <h3> Class Name: {className}
                        <br/> Coach: {coach}
                        <br/> Start time: {startTime}
                        <br/> End time: {endTime}
                    </h3>
                    <h4> Class dates:</h4>
                </div>
            }
            {classDateList &&
                <ul>
                    {classDateList.map((d, index) => (<li>{d}</li>))}
                </ul>
            }
        </>







    )
}
export default EnrollClass;