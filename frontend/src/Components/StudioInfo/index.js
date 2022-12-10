import React from 'react';
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "./style.css"

const StudioInfo = () => {
    const { state } = useLocation();
    const { studio_id } = state;
    const [ studioName, setStudioName ] = useState('');
    const [ studioAddress, setStudioAddress] = useState('')
    const [ studioImage, setStudioImage] = useState('')
    const [ studioPCode, setStudioPcode] = useState('')
    const [ studioNumber, setStudioNumber] = useState('')


    const navigate = useNavigate();
    const toClassSchedule = (studio_id)=>{
        navigate('/classes/',{ state: {studio_id:studio_id} })
    }
    const toStudios = ()=>{
        navigate('/studios')
    }
    

    useEffect(() => {
        if (studio_id === null) {
            console.log("illegal entry");
        }
        else {
            fetch(`http://localhost:8000/studio/${studio_id}/`)
            .then(res => res.json())
            .then(json => {
                setStudioName(json.name);
                setStudioNumber(json.phone_number);
                setStudioPcode(json.postal_code);
                setStudioAddress(json.address);
                setStudioImage(json.images[0].image);
                console.log(json.images[0].image);
            })
        }
       
    })


    return(
    <>
        <div>
            

            <div id="studio_detail">
            <button display="inline-block" className={'back'} onClick={()=>toStudios()}>
                Back
            </button>
            <h1 display="inline">{studioName}</h1>

            <img id="studio_image"  src={ studioImage} ></img>
            

            <h3> Address: {studioAddress} </h3>
            <h3> Phone Number: {studioNumber} </h3>
            <h3> Postal Code: {studioPCode} </h3>


            <button className={'back'} onClick={()=>toClassSchedule(studio_id)}
            > Check Classes Happening Now!</button>

            </div>

        </div>
    </>
    )

}

export default StudioInfo;
