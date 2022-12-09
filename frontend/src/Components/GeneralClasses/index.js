import React from 'react';
import {useEffect, useState, useContext} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import GeneralClassesTable from './GeneralClassesTable';

import './style.css';
import GeneralClassesAPIContext from '../../Contexts/GeneralClassesAPIContext';

const GeneralClasses = () => {
    const [params, setParams] = useState();
    const navigate = useNavigate();
    // const { state } = useLocation();
    // const { studio_id } = state;
    // const [ studioName, setStudioName ] = useState('');
    
    const { setGeneralClasses } = useContext(GeneralClassesAPIContext);

    useEffect(() => {

        // else {
            fetch(`http://localhost:8000/classes/all/`)
            .then(res => res.json())
            .then(json => {
                console.log(json.results);
                setGeneralClasses(json.results);
                // setStudioName(json.name);
                // console.log(json.count);
                // json.next?setHasNext(true):setHasNext(false);
                // json.previous?setHasPrev(true):setHasPrev(false);
            })
        
       
    }, [params])


    return(
    <>
        <div>
            <h1>Classes</h1>
            <button> Know More</button>
            <GeneralClassesTable id="plans-table"/>
        </div>
    </>
    )

}

export default GeneralClasses;
