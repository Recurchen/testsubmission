import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";


const EnrollClass = () =>{
    const { state } = useLocation();
    const { class_id, class_date } = state;
    const [numEnrolled, setNumEnrolled] = useState(0);
    const [classDateList, setClassDateList] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [sent, setSent] = useState(false);
    useEffect(()=>{
        if (sent === false){
            fetch(`http://localhost:8000/classes/enroll/?class_id=${class_id}&class_date=${class_date}`,
                {method:'post',
                })
                .then(res => res.json())
                .then(json => {
                    if(json.length === 1){
                        setErrorMsg(json);
                    }else if(json.length === 3){
                        setNumEnrolled(json[0]['enroll']);
                        setClassDateList(json[2]['class_dates']);
                    }
                });
            setSent(true);
        }
    },[sent]
    )
    return (
        <>
            { errorMsg &&
                <span className="error"> { errorMsg } </span> }
            { !errorMsg &&
                <div>
                <h1> Successful!</h1>
                <br/>
                <h3> You have enrolled in {numEnrolled} class occurrence with class dates:</h3>
                <br/>
                <h5>{classDateList}</h5>
            </div>}
        </>
    )
}
export default EnrollClass;