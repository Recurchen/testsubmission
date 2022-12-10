import './style.css'
import {useContext, useEffect, useState} from "react";
import React from "react"
import StudiosTable from "./StudiosTable";
import { useNavigate, useLocation } from "react-router-dom";
// import { StyleSheet, Text, View } from "react-native";
// import MapView from "react-native-maps";


// import { StyleSheet, Text, View } from "react-native";
// import MapView from "react-native-maps";

import './style.css';
import StudiosAPIContext from '../../Contexts/StudiosAPIContext';



const StudiosNearMe = () => {
    const { state } = useLocation();
    const { setStudios } = useContext(StudiosAPIContext);
    // const [params, setParams] = useState({page: 1, input: ""})
    // const [params, setParams] = useState({input: "", check:false})
    const [params, setParams] = useState({input: ""})
    // const perPage = 5;
    // const [params, setParams] = useState({page: 1});
    const navigate = useNavigate();
    const toFilter = (keyword)=>{
        navigate('/studios/filter', {state: {keyword:keyword}})
    }



    // const [hasNext, setHasNext] = useState(false);
    // const [hasPrev, setHasPrev] = useState(false);

    useEffect(() => {

        const { input} = params;

        // const { page } = params;
        console.log(input)
        // if (input !== ''){
        //     console.log("search ", input)
        
        fetch(`http://localhost:8000/studio/all/`, 
            {
                method:"POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify({location:input},
                )
            })
            .then(res => res.json())
            .then(json => {
                console.log(json);
                setStudios(json);
            })}
        // }
        , [params])




    return (
        <>
        <div className="plan">

            <h3 color="white"> Enter your address or postal code </h3>
  
            <input   type="text"
                   placeholder="Search Closest Studios"
                   value={params.input}
                   onChange={(event) => {
                       setParams({
                        ...params,
                           input: event.target.value,
                        //    page: 1,
                       })
                   }} />
                   {/* <button id="search"
                   value={params.check}
                   onClick={() => {
                    setParams({
                        check: true
                     //    page: 1,
                    }
                ); console.log('clicked')
                }}
                > Enter</button> */}
            
            

            <StudiosTable id="plans-table"params={params}/>
            {/* <div>
                <button className="change-page-btn" hidden={!hasPrev}
                    onClick={() => setParams({
                    ...params,
                    page: Math.max(1, params.page - 1)
                })}>
                    Go Back
                </button>
                <button className="change-page-btn" hidden={!hasNext}
                    onClick={() => setParams({
                    ...params,
                    page: params.page + 1
                })}>
                    View More
                </button>
            </div> */}
        </div>
        </>)

    
}


export default StudiosNearMe;