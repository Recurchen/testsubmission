import {useContext, useEffect, useState} from "react";
import ClassInstancesTable from "./ClassInstancesTable";
import ClassInstancesAPIContext from "../../Contexts/ClassInstancesAPIContext";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import './style.css'
const ClassInstances = ({studio_id}) => {
    const navigate = useNavigate();
    const toFilter = (method, studio_id)=>{
        navigate('/classes/filter', { state: { method:method, studio_id:{studio_id}} })
    }
    // TODO: change this to studioinfor page
    const toStudioInfoPage = ()=>{
        navigate('/classes/')
    }
    const perPage = 10;
    const [params, setParams] = useState({page: 1});
    const [hasNext, setHasNext] = useState(false);
    const [hasPrev, setHasPrev] = useState(false);
    const { setClassInstances } = useContext(ClassInstancesAPIContext);
    useEffect(() => {
        const { page } = params;
        fetch(`http://localhost:8000/classes/${studio_id}/all?page=${page}&per_page=${perPage}`)
            .then(res => res.json())
            .then(json => {
                setClassInstances(json.results);
                json.next?setHasNext(true):setHasNext(false);
                json.previous?setHasPrev(true):setHasPrev(false);
            })
    }, [params]);

    return (
        <>
            <button className={'back'} onClick={toStudioInfoPage}>
                Back
            </button>
            <h1 className={'filterTitle'}>Class Schedule</h1>
            <div className={'filterButtons'}>
                <button className={'filter'}
                        onClick={() => toFilter('coach',{studio_id})}> filter by coach </button>
                <button className={'filter'}
                        onClick={() => toFilter('class_name',{studio_id})}> filter by class name </button>
                <button className={'filter'}
                        onClick={() => toFilter('date',{studio_id})}> filter by class date </button>
                <button className={'filter'}
                        onClick={() => toFilter('time_range',{studio_id})}> filter by range of class start time </button>
            </div>

            <ClassInstancesTable perPage={perPage} params={params} />
            <button hidden={!hasPrev} className={'prev'}
                onClick={() => setParams({
                ...params,
                page: Math.max(1, params.page - 1)
            })}>
                prev
            </button>
            <button hidden={!hasNext} className={'next'}
                onClick={() => setParams({
                ...params,
                page: params.page + 1
            })}>
                next
            </button>
        </>
    )
}

export default ClassInstances;