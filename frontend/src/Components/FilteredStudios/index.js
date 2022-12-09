import React, { useContext } from 'react';
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import StudiosAPIContext from '../../Contexts/StudiosAPIContext';
import StudiosTable from '../Studios/StudiosTable';

const FiltedStudios = () => {
    const { state } = useLocation();
    const { keyword } = state;
    const { setStudios } = useContext(StudiosAPIContext);
    // const [params, setParams] = useState({page: 1, input: ""})
    const [params, setParams] = useState({input: ""})

    useEffect(() => {
        const { input } = params;

        if (keyword === 'name'){
            console.log('search name')
            fetch(`http://localhost:8000/studio/all/?name=${input}`)
            .then(res => res.json())
            .then(json => {
                setStudios(json);
                // json.next?setHasNext(true):setHasNext(false);
                // json.previous?setHasPrev(true):setHasPrev(false);
            })
        }

        if (keyword === 'amenities'){
            console.log('search amenities')
            fetch(`http://localhost:8000/studio/all/?amenities=${input}`)
            .then(res => res.json())
            .then(json => {
                setStudios(json);
                // json.next?setHasNext(true):setHasNext(false);
                // json.previous?setHasPrev(true):setHasPrev(false);
            })
        }

        if (keyword === 'class'){
            console.log('search amenities')
            fetch(`http://localhost:8000/studio/all/?class=${input}`)
            .then(res => res.json())
            .then(json => {
                setStudios(json);
                // json.next?setHasNext(true):setHasNext(false);
                // json.previous?setHasPrev(true):setHasPrev(false);
            })
        }



            // fetch(`http://localhost:8000/studio/all/?name=${input}`)
            // .then(res => res.json())
            // .then(json => {
            //     console.log(json);
            //     setStudios(json);
            //     console.log(json.name);
            //     // json.next?setHasNext(true):setHasNext(false);
            //     // json.previous?setHasPrev(true):setHasPrev(false);
            // })
    })


    return(
    <>
        <div>
            <h1>Filted Studios</h1>
            <input   type="text"
                   placeholder="Search ..."
                   value={params.input}
                   onChange={(event) => {
                       setParams({
                           input: event.target.value,
                        //    page: 1,
                       })
                   }} />
            <StudiosTable params={params} />
        </div>
    </>
    )

}

export default FiltedStudios;
