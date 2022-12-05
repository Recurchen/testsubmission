import {useContext, useEffect, useState} from "react";
import ClassInstancesAPIContext from "../../Contexts/ClassInstancesAPIContext";
import ClassInstancesTable from "../ClassInstances/ClassInstancesTable";
import {useLocation} from "react-router-dom";
//import { useNavigate } from "react-router-dom";

const FilterClassInstances = () => {
    const { state } = useLocation();
    const { method } = state;
    const perPage = 10;
    const [params, setParams] = useState({page: 1, input: ""})
    const { setClassInstances } = useContext(ClassInstancesAPIContext);
    useEffect(() => {
        const { page, input } = params;
        fetch(`http://localhost:8000/classes/3/all?page=${page}&per_page=${perPage}&${method}=${input}`)
            .then(res => res.json())
            .then(json => {
                console.log(method+" : "+ input)
                console.log(json.results)
                setClassInstances(json.results)
            })
    }, [params])

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