import './style.css'
import {useContext, useEffect, useState} from "react";
import StudiosTable from "./StudiosTable";
import { useNavigate, useLocation } from "react-router-dom";

import './style.css';
import StudiosAPIContext from '../../Contexts/StudiosAPIContext';

const StudiosNearMe = () => {
    const { state } = useLocation();
    const { setStudios } = useContext(StudiosAPIContext);
    // const [params, setParams] = useState({page: 1, input: ""})
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
        const { input } = params;
        // const { page } = params;
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
                // json.next?setHasNext(true):setHasNext(false);
                // json.previous?setHasPrev(true):setHasPrev(false);
            })
    }, [params])

    return (
        <>
        <div className="plan">
            {/* <button onClick={() => toFilter('name')}> Search by Studio Name </button>
            <button onClick={() => toFilter('amenities')}> Search by Amenities </button>
            <button onClick={() => toFilter('class')}> Search by Classess </button>
            <button onClick={() => toFilter('coach')}> Search by Coaches </button>
            <button onClick={() => toNearMe()}> Find Studios Near Me </button> */}
            {/* <StudiosTable id="plans-table" perPage={perPage} params={params} /> */}
            <input   type="text"
                   placeholder="Search Near"
                   value={params.input}
                   onChange={(event) => {
                       setParams({
                           input: event.target.value,
                        //    page: 1,
                       })
                   }} />
            <StudiosTable id="plans-table"/>
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