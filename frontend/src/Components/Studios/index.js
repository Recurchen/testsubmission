import './style.css'
import {useContext, useEffect, useState} from "react";
import StudiosTable from "./StudiosTable";
import { useNavigate } from "react-router-dom";

import './style.css';
import StudiosAPIContext from '../../Contexts/StudiosAPIContext';

const Studios = () => {
    // const perPage = 5;
    const [params, setParams] = useState({page: 1});
    const navigate = useNavigate();
    const toFilter = (keyword)=>{
        navigate('/studios/filter', {state: {keyword:keyword}})
    }
    const toNearMe = () => {
        navigate('/studios/nearme')
    }

    const [hasNext, setHasNext] = useState(false);
    const [hasPrev, setHasPrev] = useState(false);

    const { setStudios } = useContext(StudiosAPIContext);
    useEffect(() => {
        // const { page } = params;
        fetch(`http://localhost:8000/studio/all1/`)
            .then(res => res.json())
            .then(json => {
                console.log(json);
                setStudios(json.results);
                json.next?setHasNext(true):setHasNext(false);
                json.previous?setHasPrev(true):setHasPrev(false);
            })
    }, [params])

    return (
        <>
        <div className="plan">
            <table class="buttonTable">
                <tr>
                    <td> <button  class="button-5" onClick={() => toFilter('name')}> Search by Studio Name </button></td>
                    <td> <button  class="button-5"  onClick={() => toFilter('amenities')}> Search by Amenities </button> </td>
                    <td> <button  class="button-5" onClick={() => toFilter('class')}> Search by Classess </button></td>
                    <td> <button  class="button-5" onClick={() => toFilter('coach')}> Search by Coaches </button></td>
                    <td> <button  class="button-5" onClick={() => toNearMe()}> Find Studios Near Me </button></td>
                </tr>

            </table>
            
        
            
            
            
            
            {/* <StudiosTable id="plans-table" perPage={perPage} params={params} /> */}
            <StudiosTable id="plans-table"/>
            {<div>
                <button className="change-page-btn" hidden={!hasPrev}
                    onClick={() => setParams({
                    ...params,
                    page: Math.max(1, params.page - 1)
                })}>
                    Prev
                </button>
                <button className="change-page-btn" hidden={!hasNext}
                    onClick={() => setParams({
                    ...params,
                    page: params.page + 1
                })}>
                    Next
                </button>
            </div>}
        </div>
        </>)

    
}
export default Studios;
