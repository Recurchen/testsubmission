import {useContext, useEffect, useState} from "react";
import ClassInstancesTable from "./ClassInstancesTable";
import ClassInstancesAPIContext from "../../Contexts/ClassInstancesAPIContext";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import './style.css'
const ClassInstances = () => {
    const navigate = useNavigate();
    const toFilter = (method)=>{
        navigate('/classes/filter', { state: { method:method } })
    }
    // TODO: change this to studioinfor page
    const toStudioInfoPage = ()=>{
        navigate('/classes/')
    }
    const perPage = 10;
    const [params, setParams] = useState({page: 1});
    const [hasNext, setHasNext] = useState(false);
    const [hasPrev, setHasPrev] = useState(false);
    //const [classNameCoach, setClassNameCoach] = useState({page: 1, className:'',coach:''});
    //const [className, setClassName] = useState("");
    //const [coach, setCoach] = useState("");
    // const [classDate, setClassDate] = useState(new Date());
    // const [classDateStr, setClassDateStr] = useState('');
    const { setClassInstances } = useContext(ClassInstancesAPIContext);
    useEffect(() => {
        const { page } = params;
        fetch(`http://localhost:8000/classes/3/all?page=${page}&per_page=${perPage}`)
            .then(res => res.json())
            .then(json => {
                setClassInstances(json.results);
                json.next?setHasNext(true):setHasNext(false);
                json.previous?setHasPrev(true):setHasPrev(false);
            })
    }, [params]);
    // search by class name and/or coach
    // useEffect(() =>{
    //     const { page, className, coach } = classNameCoach;
    //     if(coach!=='' && className ===''){
    //         fetch(`http://localhost:8000/classes/3/all?page=${page}&per_page=${perPage}&coach=${coach}`)
    //             .then(res => res.json())
    //             .then(json => {
    //                 setClassInstances(json.results);
    //                 json.next?setHasNext(true):setHasNext(false);
    //                 json.previous?setHasPrev(true):setHasPrev(false);
    //             })
    //     }
    //     if(className!=='' && coach ===''){
    //         fetch(`http://localhost:8000/classes/3/all?page=${page}&per_page=${perPage}&class_name=${className}`)
    //             .then(res => res.json())
    //             .then(json => {
    //                 setClassInstances(json.results);
    //                 json.next?setHasNext(true):setHasNext(false);
    //                 json.previous?setHasPrev(true):setHasPrev(false);
    //             });
    //
    //     }
    //     if(className !=='' && coach !==''){
    //         fetch(`http://localhost:8000/classes/3/all?page=${page}&per_page=${perPage}&class_name=${className}&coach=${coach}`)
    //             .then(res => res.json())
    //             .then(json => {
    //                 setClassInstances(json.results);
    //                 json.next?setHasNext(true):setHasNext(false);
    //                 json.previous?setHasPrev(true):setHasPrev(false);
    //             });
    //     }
    // },[classNameCoach]);
    // search by class date
    // useEffect(()=>{
    //     const { page } = params;
    //     if(classDateStr !==''){
    //         fetch(`http://localhost:8000/classes/3/all?page=${page}&per_page=${perPage}&date=${classDateStr}`)
    //             .then(res => res.json())
    //             .then(json=>{
    //                 setClassInstances(json.results);
    //                 json.next?setHasNext(true):setHasNext(false);
    //                 json.previous?setHasPrev(true):setHasPrev(false);
    //             })
    //     }
    //},[classDateStr,params.page])

    return (
        <>
            {/*<input placeholder="Search by Class Name" onChange={event => {*/}
            {/*    setParams({page:1});*/}
            {/*    setClassNameCoach({...classNameCoach, className:event.target.value});*/}
            {/*}} />*/}
            {/*<input placeholder="Search by Coach" onChange={event =>{*/}
            {/*    setParams({page:1});*/}
            {/*    setClassNameCoach({...classNameCoach, coach:event.target.value});*/}
            {/*}*/}
            {/*    } />*/}
            {/*<br/>  <br/>*/}
            {/*<DatePicker dateFormat="yyyy-MM-dd"*/}
            {/*            todayButton="Today"*/}
            {/*            selected={classDate}*/}
            {/*            onChange={(date:Date) => setClassDate(date)} />*/}
            {/*<button onClick={() =>{*/}
            {/*    setParams({page:1});*/}
            {/*    let [month, day, year] = classDate.toLocaleDateString().split('/');*/}
            {/*    if (month.length < 2){*/}
            {/*        month = '0' + month;*/}
            {/*    }*/}
            {/*    if(day.length < 2){*/}
            {/*        day = '0' + day;*/}
            {/*    }*/}
            {/*    setClassDateStr([year, month, day].join('-'));*/}
            {/*    }*/}
            {/*    }>*/}
            {/*    Search by class date*/}
            {/*</button>*/}
            {/*<br/> <br/>*/}
            <button className={'back'} onClick={toStudioInfoPage}>
                Back
            </button>
            <h1 className={'filterTitle'}>Class Schedule</h1>
            <div className={'filterButtons'}>
                <button className={'filter'}
                        onClick={() => toFilter('coach')}> filter by coach </button>
                <button className={'filter'}
                        onClick={() => toFilter('class_name')}> filter by class name </button>
                <button className={'filter'}
                        onClick={() => toFilter('date')}> filter by class date </button>
                <button className={'filter'}
                        onClick={() => toFilter('time_range')}> filter by range of class start time </button>
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