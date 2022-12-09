import React from 'react';
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

const StudioInfo = () => {
    const { state } = useLocation();
    const { studio_id } = state;
    const [ studioName, setStudioName ] = useState('');

    const navigate = useNavigate();
    const toClassSchedule = (studio_id)=>{
        navigate('/classes/',{ state: {studio_id:studio_id} })
    }
    

    useEffect(() => {
        if (studio_id === null) {
            console.log("illegal entry");
        }
        else {
            fetch(`http://localhost:8000/studio/${studio_id}/`)
            .then(res => res.json())
            .then(json => {
                console.log(json);
                setStudioName(json.name);
                console.log(json.name);
                console.log(studio_id)
                // json.next?setHasNext(true):setHasNext(false);
                // json.previous?setHasPrev(true):setHasPrev(false);
            })
        }
       
    })


    return(
    <>
        <div>
            <h1>{studioName}</h1>
            <button onClick={()=>toClassSchedule(studio_id)}
            > Check Classes Happening Now!</button>
        </div>
    </>
    )

}

export default StudioInfo;
