import React from 'react';
import {useEffect, useState, useContext} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import GeneralClassesTable from './GeneralClassesTable';

import './style.css';
import GeneralClassesAPIContext from '../../Contexts/GeneralClassesAPIContext';

const GeneralClasses = () => {
    const [params, setParams] = useState({page: 1});
    const { setGeneralClasses } = useContext(GeneralClassesAPIContext);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrev, setHasPrev] = useState(false);

    useEffect(() => {
            fetch(`http://localhost:8000/classes/all/?page=${params.page}`)
            .then(res => res.json())
            .then(json => {
                console.log(json.results);
                setGeneralClasses(json.results);
                json.next?setHasNext(true):setHasNext(false);
                json.previous?setHasPrev(true):setHasPrev(false);
            })
    }, [params])


    return(
    <>
        <div>
            <h1>Classes</h1>
            <button className={'filter'}> Know More</button>
            <GeneralClassesTable id="plans-table"/>
            <button hidden={!hasPrev} className={'prev'}
                    onClick={() => setParams({
                        page: Math.max(1, params.page - 1)
                    })}>
                prev
            </button>
            <button hidden={!hasNext} className={'next'}
                    onClick={() =>
                    {console.log(params.page);
                        setParams({
                        page: params.page + 1
                    })}}>
                next
            </button>
        </div>
    </>
    )

}

export default GeneralClasses;
