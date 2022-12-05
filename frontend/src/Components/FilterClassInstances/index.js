import {useContext, useEffect, useState} from "react";
import ClassInstancesAPIContext from "../../Contexts/ClassInstancesAPIContext";
import ClassInstancesTable from "../ClassInstances/ClassInstancesTable";
import {useLocation} from "react-router-dom";
//import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const FilterClassInstances = () => {
    const { state } = useLocation();
    const { method } = state;
    const perPage = 10;
    const [startDate, setStartDate] = useState(new Date());
    const [params, setParams] = useState({page: 1, input: " "})
    const { setClassInstances } = useContext(ClassInstancesAPIContext);
    useEffect(() => {
        const { page, input } = params;
        if(method === 'date'){
            if(input !== ' '){
                fetch(`http://localhost:8000/classes/3/all?page=${page}&per_page=${perPage}&${method}=${input}`)
                    .then(res => res.json())
                    .then(json => {
                        setClassInstances(json.results)
                    })
            }
        }else{
            fetch(`http://localhost:8000/classes/3/all?page=${page}&per_page=${perPage}&${method}=${input}`)
                .then(res => res.json())
                .then(json => {
                    console.log(method+" : "+ input)
                    console.log(json.results)
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
                    onClick={()=>setParams({...params, input:startDate.toJSON().split('T')[0]})}>
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

    }
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