import {useContext, useEffect, useState} from "react";
import ClassInstancesAPIContext from "../../Contexts/ClassInstancesAPIContext";
import ClassInstancesTable from "../ClassInstances/ClassInstancesTable";
import {useLocation} from "react-router-dom";
//import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import DateTimePicker from 'react-datetime-picker';
import TimePicker from 'react-time-picker';
const FilterClassInstances = () => {
    const { state } = useLocation();
    const { method } = state;
    const perPage = 10;
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
        const { page, input } = params;
        if(method === 'date'){
            if(input !== ''){
                console.log('by date')
                fetch(`http://localhost:8000/classes/3/all?page=${page}&per_page=${perPage}&${method}=${input}`)
                    .then(res => res.json())
                    .then(json => {
                        setClassInstances(json.results)
                    })
            }
        }
        if (method === 'time_range'){
            if(input !== ''){
                fetch(`http://localhost:8000/classes/3/all?page=${page}&per_page=${perPage}&${method}=${input}`)
                    .then(res => res.json())
                    .then(json => {
                        setClassInstances(json.results)
                    })
            }
        }
        if(method === 'coach' || method === 'class_name'){
            console.log(method)
            fetch(`http://localhost:8000/classes/3/all?page=${page}&per_page=${perPage}&${method}=${input}`)
                .then(res => res.json())
                .then(json => {
                    console.log(json)
                    setClassInstances(json.results)
                })
        }
        }, [params])


    if (method === 'date'){
        return (
            <>
                Filter by class date
                {/*Reference:https://reactdatepicker.com/*/}
                <DatePicker dateFormat="yyyy-MM-dd"
                            todayButton="Today"
                            selected={startDate}
                            onChange={(date:Date) => setStartDate(date)} />
                <button
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
                    Submit
                </button>

                <ClassInstancesTable perPage={perPage} params={params} />

                <button onClick={() => setParams({
                    ...params,
                    page: Math.max(1, params.page - 1)
                })}>
                    prev
                </button>

                <button onClick={() => setParams({
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
            <>
                Filter by range of class's start time
                <br/>
                Time range start time
                <DatePicker dateFormat="yyyy-MM-dd"
                            todayButton="Today"
                            selected={startDay}
                            onChange={(date:Date) => setStartDay(date)} />
                <TimePicker onChange={setStartTime}
                            clockIcon = {false}
                            disableClock={true}
                            value={startTime} />
                <br/>
                Time range end time
                <DatePicker dateFormat="yyyy-MM-dd"
                            todayButton="Today"
                            selected={endDay}
                            onChange={(date:Date) => setEndDay(date)} />
                <TimePicker onChange={setEndTime}
                            clockIcon = {false} //remove clock icon
                            disableClock={true} //don't show clock when select value
                            value={endTime} />
                <button
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
                    Submit
                </button>

                {/*<DateTimePicker*/}
                {/*    amPmAriaLabel="Select AM/PM"*/}
                {/*    calendarAriaLabel="Toggle calendar"*/}
                {/*    clearAriaLabel="Clear value"*/}
                {/*    dayAriaLabel="Day"*/}
                {/*    hourAriaLabel="Hour"*/}
                {/*    maxDetail="second"*/}
                {/*    minuteAriaLabel="Minute"*/}
                {/*    monthAriaLabel="Month"*/}
                {/*    nativeInputAriaLabel="Date and time"*/}
                {/*    secondAriaLabel="Second"*/}
                {/*    yearAriaLabel="Year"*/}
                {/*    value={startTime1}*/}
                {/*    onChange={setStartTime1}*/}
                {/*/>*/}
                {/*<br/>*/}
                {/*Time range end time*/}
                {/*<DateTimePicker*/}
                {/*    amPmAriaLabel="Select AM/PM"*/}
                {/*    calendarAriaLabel="Toggle calendar"*/}
                {/*    clearAriaLabel="Clear value"*/}
                {/*    dayAriaLabel="Day"*/}
                {/*    hourAriaLabel="Hour"*/}
                {/*    maxDetail="second"*/}
                {/*    minuteAriaLabel="Minute"*/}
                {/*    monthAriaLabel="Month"*/}
                {/*    nativeInputAriaLabel="Date and time"*/}
                {/*    secondAriaLabel="Second"*/}
                {/*    yearAriaLabel="Year"*/}
                {/*    value={startTime2}*/}
                {/*    onChange={setStartTime2}*/}
                {/*    // format = "y-MM-dd-h:mm"*/}
                {/*/>*/}
                {/*<br/>*/}


                <ClassInstancesTable perPage={perPage} params={params} />

                <button onClick={() => setParams({
                    ...params,
                    page: Math.max(1, params.page - 1)
                })}>
                    prev
                </button>

                <button onClick={() => setParams({
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
        <>
            Filter by {method}
            <input
                style={{width: 300, height: 20, fontSize: 18, margin: 4}}
                value={params.input}
                onChange={(event) => {
                    setParams({
                        input: event.target.value,
                        page: 1,
                    })
                }}
            />

            <ClassInstancesTable perPage={perPage} params={params} />

            <button onClick={() => setParams({
                ...params,
                page: Math.max(1, params.page - 1)
            })}>
                prev
            </button>

            <button onClick={() => setParams({
                ...params,
                page: params.page + 1
            })}>
                next
            </button>
        </>
    )
}

export default FilterClassInstances;