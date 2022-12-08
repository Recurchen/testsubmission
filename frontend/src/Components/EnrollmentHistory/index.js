import {useContext, useEffect, useState} from "react";
import EnrollmentHistoryTable from "./EnrollmentHistoryTable";
import EnrollmentHistoryAPIContext from "../../Contexts/EnrollmentHistoryAPIContext";
import useToken from "../../useToken";
import {useNavigate} from "react-router-dom";

const EnrollmentHistory = () => {
    const token = useToken();
    const navigate = useNavigate();
    const toLogin = ()=>{
        navigate('/login');
    }
    const toUserCenter = ()=>{
        navigate('/usercenter')
    }
    const perPage = 10;
    const [params, setParams] = useState({page: 1})
    const { setEnrollmentHistory } = useContext(EnrollmentHistoryAPIContext);
    const [hasNext, setHasNext] = useState(false)
    const [hasPrev, setHasPrev] = useState(false)
    useEffect(() => {
        const { page } = params;
        if(token.token === null){
            toLogin();
        }
        else{
            fetch(`http://localhost:8000/classes/enrollments/?page=${page}&per_page=${perPage}`,
                {headers: new Headers({
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token.token}`
                    })}).then(res=>{
                        if(res.status ==='403'){
                            toLogin();}
                        return res;
            })
            .then(res => res.json())
            .then(json => {
                setEnrollmentHistory(json.results);
                json.next?setHasNext(true):setHasNext(false);
                json.previous?setHasPrev(true):setHasPrev(false);
            })
        }
    }, [params])

    return (
        <>
            <button className={'back'} onClick={toUserCenter}>
                Back
            </button>

            <h1 className={'filterTitle'}>Enrollment History</h1>


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