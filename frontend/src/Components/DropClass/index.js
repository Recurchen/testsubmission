import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";


const DropClass = () =>{
    const { state } = useLocation();
    const { class_id, class_date } = state;
    const [numDropped, setNumDropped] = useState(0);
    const [classDateList, setClassDateList] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [sent, setSent] = useState(false);
    useEffect(()=>{
            if (sent === false){
                fetch(`http://localhost:8000/classes/drop/?class_id=${class_id}&class_date=${class_date}`,
                    {method:'post',
                    })
                    .then(res => res.json())
                    .then(json => {
                        if(json.length === 1){
                            setErrorMsg(json);
                        }else if(json.length === 3){
                            setNumDropped(json[0]['dropped']);
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
                    <h3> You have dropped {numDropped} class occurrence with class dates:</h3>
                    <br/>
                    <h5>{classDateList}</h5>
                </div>}
        </>
    )
}
export default DropClass;