import {useContext, useEffect, useState} from "react";
import EnrollmentHistoryTable from "./EnrollmentHistoryTable";
import EnrollmentHistoryAPIContext from "../../Contexts/EnrollmentHistoryAPIContext";

const EnrollmentHistory = () => {
    const perPage = 10;
    const [params, setParams] = useState({page: 1})
    const { setEnrollmentHistory } = useContext(EnrollmentHistoryAPIContext);
    const [hasNext, setHasNext] = useState(false)
    const [hasPrev, setHasPrev] = useState(false)
    useEffect(() => {
        const { page } = params;
        fetch(`http://localhost:8000/classes/enrollments/?page=${page}&per_page=${perPage}`)
            .then(res => res.json())
            .then(json => {
                setEnrollmentHistory(json.results);
                json.next?setHasNext(true):setHasNext(false);
                json.previous?setHasPrev(true):setHasPrev(false);
            })
    }, [params])

    return (
        <>
            <EnrollmentHistoryTable perPage={perPage} params={params} />
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

export default EnrollmentHistory;