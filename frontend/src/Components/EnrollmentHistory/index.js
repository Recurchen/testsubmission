import {useContext, useEffect, useState} from "react";
import EnrollmentHistoryTable from "./EnrollmentHistoryTable";
import EnrollmentHistoryAPIContext from "../../Contexts/EnrollmentHistoryAPIContext";

const EnrollmentHistory = () => {
    const perPage = 10;
    const [params, setParams] = useState({page: 1})
    const { setEnrollmentHistory } = useContext(EnrollmentHistoryAPIContext);
    useEffect(() => {
        const { page } = params;
        fetch(`http://localhost:8000/classes/enrollments?page=${page}&per_page=${perPage}`)
            .then(res => res.json())
            .then(json => {
                setEnrollmentHistory(json.results);
            })
    }, [params])

    return (
        <>
            <EnrollmentHistoryTable perPage={perPage} params={params} />
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

export default EnrollmentHistory;