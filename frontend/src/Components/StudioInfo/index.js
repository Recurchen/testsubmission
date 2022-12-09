import React from 'react';
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

const StudioInfo = () => {
    const { state } = useLocation();
    const { studio_id } = state;
    const [ studioName, setStudioName ] = useState('');
    

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
                // json.next?setHasNext(true):setHasNext(false);
                // json.previous?setHasPrev(true):setHasPrev(false);
            })
        }
       
    })


    return(
    <>
        <div>
            <h1>{studioName}</h1>
        </div>
    </>
    )

}

export default StudioInfo;
