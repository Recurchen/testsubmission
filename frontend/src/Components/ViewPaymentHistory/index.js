import {useContext, useEffect, useState} from "react";
import PaymentHistoryTable from "./PaymentHistoryTable";
import { useNavigate } from "react-router-dom";
import './style.css';
import PaymentHistoryAPIContext from "../../Contexts/PaymentHistoryAPIContext";
import useToken from "../../useToken";
import useUserId from "../../useUserId";

const ViewPaymentHistory = () => {
    // const navigate = useNavigate();
    // const toFilter = (method)=>{
    //     navigate('/classes/filter', { state: { method:method } })
    // }
    const perPage = 3;
    // const options = ['Future Payment', 'Past Payment'];
    const [params, setParams] = useState({page: 1, checker: "past"});
    const token = useToken();
    const user_id = useUserId();
    const [hasNext, setHasNext] = useState(false);
    const [hasPrev, setHasPrev] = useState(false);
    const { setPaymentHistory } = useContext(PaymentHistoryAPIContext);
    // const [checkfuture, setCheckfuture] = useState('past');

    const handleSelect = (e) => {
        setParams({
            checker: e.target.value,
            page: 1,
        })
    }

    const viewPaymentsHeaders = new Headers({
        'Authorization' : `Bearer ${token.token}`
    })
    
    useEffect(() => {
        const { page, checker } = params;
        fetch(`http://localhost:8000/subscriptions/users/${user_id.userId}/payments/${checker}/?page=${page}`,
        {headers: viewPaymentsHeaders})
            .then(res => res.json())
            .then(json => {
                setPaymentHistory(json.results);
                json.next?setHasNext(true):setHasNext(false);
                json.previous?setHasPrev(true):setHasPrev(false);
            })
    }, [params])

    return (
        <div className="payment_history">
            <label>Select to check past or future payments</label>
            <select name="slt_payments" 
                    id="slt_payments" 
                    onChange={handleSelect}
                    defaultValue = "past">
                <option value="past">Past Payments</option>
                <option value="future">Future Payments</option>
            </select>           
            <PaymentHistoryTable id="payment-table" perPage={perPage} params={params} />
            <div>
                <button className="change-page-btn" hidden={!hasPrev}
                    onClick={() => setParams({
                    ...params,
                    page: Math.max(1, params.page - 1)
                })}>
                    Go Back
                </button>
                <button className="change-page-btn" hidden={!hasNext}
                    onClick={() => setParams({
                    ...params,
                    page: params.page + 1
                })}>
                    View More
                </button>
            </div>
        </div>
    )
}

export default ViewPaymentHistory;