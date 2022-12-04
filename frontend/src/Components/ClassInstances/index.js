import {useContext, useEffect, useState} from "react";
import ClassInstancesTable from "./ClassInstancesTable";
import APIContext from "../../Contexts/ClassInstancesAPIContext";

const ClassInstances = () => {
    const perPage = 10;
    const [params, setParams] = useState({page: 1})

    const { setClassInstances } = useContext(APIContext);

    useEffect(() => {
        const { page } = params;
        fetch(`http://localhost:8000/classes/1/all?page=${page}&per_page=${perPage}`
           // ,{headers: {'Access-Control-Allow-Origin': "*"},}
        )
            .then(res => res.json())
            .then(json => {
                setClassInstances(json.results);
            })
    }, [params])

    return (
        <>
            Search
            <input
                style={{width: 300, height: 20, fontSize: 18, margin: 4}}
                value={params.search}
                onChange={(event) => {
                    setParams({
                        search: event.target.value,
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

export default ClassInstances;