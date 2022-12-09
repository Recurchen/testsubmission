import {useContext} from "react";
import './style.css';
import { useNavigate } from "react-router-dom";
import PaymentHistoryAPIContext from "../../../Contexts/PaymentHistoryAPIContext";


const PaymentHistoryTable = ({ perPage, params }) => {
    const { PaymentHistory } = useContext(PaymentHistoryAPIContext);
    console.log(PaymentHistory);
    // const navigate = useNavigate();
    // const toSub = (plan_id, plan_name)=>{
    //     navigate('/plans/subscribe', { state: { plan_id:plan_id, plan_name:plan_name } })
    // }

    if (PaymentHistory && PaymentHistory.length > 0){
        return <table className="payment_history_table">
            <thead>
            <tr className="row_title">
                <th> Plan </th>
                <th> Price </th>
                <th> Card Number </th>
                <th> Paid Date </th>
            </tr>
            </thead>
            <tbody>

            {PaymentHistory && PaymentHistory.map((PaymentHis, index) => (
                <tr className="payments" key={PaymentHis.id}>
                    <td>{ PaymentHis.plan }</td>
                    <td>{ PaymentHis.price }</td>
                    <td>{ PaymentHis.card_num}</td>
                    <td>{ PaymentHis.datetime.split('T')[0]+'  ' + PaymentHis.datetime.split('T')[1].split('-')[0].split('.')[0]}</td>
                </tr>
            ))}
            </tbody>
        </table>
        

    }
    return(
        <span style={{color:'red'}}> nothing </span>
    )

    }


export default PaymentHistoryTable;