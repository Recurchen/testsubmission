import './style.css'
import {useContext, useEffect, useState} from "react";
import StudiosTable from "./StudiosTable";
import { useNavigate } from "react-router-dom";

import './style.css';
import StudiosAPIContext from '../../Contexts/StudiosAPIContext';

const Studios = () => {
    const perPage = 5;
    const [params, setParams] = useState({page: 1});
    const navigate = useNavigate();
    const toFilter = (method, studio_id)=>{
        navigate('/classes/filter', { state: { method:method, studio_id:{studio_id}} })
    }

    // const [hasNext, setHasNext] = useState(false);
    // const [hasPrev, setHasPrev] = useState(false);

    const { setStudios } = useContext(StudiosAPIContext);
    useEffect(() => {
        // const { page } = params;
        fetch(`http://localhost:8000/studio/all/`)
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
            {/* <StudiosTable id="plans-table" perPage={perPage} params={params} /> */}
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
export default Studios;