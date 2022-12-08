import {useContext, useEffect, useState} from "react";
import ClassInstancesAPIContext from "../../Contexts/ClassInstancesAPIContext";
import ClassInstancesTable from "../ClassInstances/ClassInstancesTable";
import {useLocation, useNavigate} from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from 'react-time-picker';
import './style.css'
const FilterClassInstances = () => {
    const { state } = useLocation();
    const { method, studio_id } = state;
    const studioid = studio_id['studio_id']['studio_id']
    const [hasNext, setHasNext] = useState(false);
    const [hasPrev, setHasPrev] = useState(false);
    const perPage = 10;
    const navigate = useNavigate();
    const Back = ()=>{
        navigate('/classes/')
    }
    // for class date
    const [startDate, setStartDate] = useState(new Date());
    // for time range
    const [startTime, setStartTime] = useState('00:00');
    const [startDay, setStartDay] = useState(new Date());
    const [endTime, setEndTime] = useState('00:00');
    const [endDay, setEndDay] = useState(new Date());
    const [params, setParams] = useState({page: 1, input: ""})
    const { setClassInstances } = useContext(ClassInstancesAPIContext);

    useEffect(() => {
        // clear previous class table
        setClassInstances('');
        const { page, input } = params;
        if(method === 'date'||method === 'coach'||method === 'class_name'||method === 'time_range'){
            if(input !== ''){
                fetch(`http://localhost:8000/classes/${studioid}/all?page=${page}&per_page=${perPage}&${method}=${input}`)
                    .then(res => res.json())
                    .then(json => {
                        setClassInstances(json.results)
                        json.next?setHasNext(true):setHasNext(false);
                        json.previous?setHasPrev(true):setHasPrev(false);
                    })
            }
        }
        // if (method === 'time_range'){
        //     if(input !== ''){
        //         fetch(`http://localhost:8000/classes/${studioid}/all?page=${page}&per_page=${perPage}&${method}=${input}`)
        //             .then(res => res.json())
        //             .then(json => {
        //                 setClassInstances(json.results);
        //                 json.next?setHasNext(true):setHasNext(false);
        //                 json.previous?setHasPrev(true):setHasPrev(false);
        //             })
        //     }
        // }
        // if(method === 'coach' || method === 'class_name'){
        //     fetch(`http://localhost:8000/classes/${studioid}/all?page=${page}&per_page=${perPage}&${method}=${input}`)
        //         .then(res => res.json())
        //         .then(json => {
        //             setClassInstances(json.results);
        //             json.next?setHasNext(true):setHasNext(false);
        //             json.previous?setHasPrev(true):setHasPrev(false);
        //         })
        // }
        }, [params])

    if (method === 'date'){
        return (
            <>
                <button className={'back'} onClick={Back}>
                Back
                </button>

                <h1 className={'filterTitle'}>Filter by Class Date</h1>

                {/*Reference:https://reactdatepicker.com/*/}
                <div className={'pickClassDate'}>
                    <label>Pick a class date</label>
                    <DatePicker dateFormat="yyyy-MM-dd"
                                todayButton="Today"
                                selected={startDate}
                                withPortal
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode="select"
                                onChange={(date:Date) => setStartDate(date)} />
                    <label>Click filter to apply filter</label>
                    <button className={'submitFilter'}
                            onClick={()=>{
                                //startDate.toJSON().split('T')[0]
                                let [month, day, year] = startDate.toLocaleDateString().split('/')
                                if (month.length < 2){
                                    month = 0 + month
                                }
                                if(day.length < 2){
                                    day = 0 + day
                                }
                                setParams({...params, input:[year, month, day].join('-')});
                            }
                            }>
                        Filter
                    </button>

                </div>


                <ClassInstancesTable perPage={perPage} params={params} />

                <button  hidden={!hasPrev}
                    onClick={() => setParams({
                    ...params,
                    page: Math.max(1, params.page - 1)
                })}>
                    prev
                </button>

                <button  hidden={!hasNext}
                    onClick={() => setParams({
                    ...params,
                    page: params.page + 1
                })}>
                    next
                </button>
            </>
        )
    }
    if (method === 'time_range'){
        return (
            <> <button className={'back'} onClick={Back}>
                Back
            </button>
                <h1 className={'filterTitle'}>Filter by Range of Class's Start Time</h1>

                <br/>
                <div className={'pickTimeRange'}>
                    <label> Start time</label>
                    <DatePicker dateFormat="yyyy-MM-dd"
                                todayButton="Today"
                                withPortal
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode="select"
                                selected={startDay}
                                onChange={(date:Date) => setStartDay(date)} />
                    <br/>
                    <TimePicker onChange={setStartTime}
                                clockIcon = {false}
                                disableClock={true}
                                value={startTime} />
                    <br/><br/>
                    <label> End time</label>
                    <DatePicker dateFormat="yyyy-MM-dd"
                                todayButton="Today"
                                withPortal
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode="select"
                                selected={endDay}
                                onChange={(date:Date) => setEndDay(date)} />
                    <br/>
                    <TimePicker onChange={setEndTime}
                                clockIcon = {false} //remove clock icon
                                disableClock={true} //don't show clock when select value
                                value={endTime} />
                    <br/> <br/> <br/>
                    <label>Click filter to apply filter</label>
                    <button className={'submitFilter'}
                            onClick={()=>{
                                let time1;
                                let date1;
                                let time2;
                                let date2;
                                let [month, day, year] = startDay.toLocaleDateString().split('/')
                                if (month.length < 2){
                                    month = 0 + month
                                }
                                if(day.length < 2){
                                    day = 0 + day
                                }
                                date1 = [year, month, day].join('-');
                                time1 = startTime
                                let [month2, day2, year2] = endDay.toLocaleDateString().split('/')
                                if (month2.length < 2){
                                    month2 = 0 + month2
                                }
                                if(day2.length < 2){
                                    day2 = 0 + day2
                                }
                                date2 = [year2, month2, day2].join('-');
                                time2 = endTime;
                                setParams({...params, input:date1+'-'+time1+','+date2+'-'+time2});
                            }}
                    >
                        Filter
                    </button>

                </div>


                <ClassInstancesTable perPage={perPage} params={params} />

                <button hidden={!hasPrev}
                    onClick={() => setParams({
                    ...params,
                    page: Math.max(1, params.page - 1)
                })}>
                    prev
                </button>

                <button hidden={!hasNext}
                    onClick={() => setParams({
                    ...params,
                    page: params.page + 1
                })}>
                    next
                </button>
            </>
        )
    }
    //filter by coach or class name
    return (
        <> <button className={'back'} onClick={Back}>
            Back
        </button>
            <h1 className={'filterTitle'}>Filter by {method==='class_name'?'Class Name':'Coach'}</h1>
            <input className={'search_bar'}
                   type="text"
                   placeholder="Search ..."
                   value={params.input}
                   onChange={(event) => {
                       setParams({
                           input: event.target.value,
                           page: 1,
                       })
                   }}
            /><br/>
            <ClassInstancesTable perPage={perPage} params={params} />

            <button hidden={!hasPrev}
                onClick={() => setParams({
                ...params,
                page: Math.max(1, params.page - 1)
            })}>
                prev
            </button>

            <button hidden={!hasNext}
                onClick={() => setParams({
                ...params,
                page: params.page + 1
            })}>
                next
            </button>
        </>
    )
}

export default FilterClassInstances;