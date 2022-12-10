import React, { useState, useEffect } from "react";
import './style.css';
import {Link, Outlet} from "react-router-dom";
import PopUp from '../Popup'; 
import useToken from "../../useToken";
import useUserId from "../../useUserId";
import { useNavigate } from "react-router-dom";
import EditSuccessPop from "./EditSuccessPop";

const EditPaymentMethod = (props) => {

    const token = useToken();
    const id = useUserId();

    const userDetailHeaders = new Headers({
        'Authorization' : `Bearer ${token.token}`
    })

    const options = ['Credit Card', 'Debit Card'];
    const [card_type, setCardType] = useState('');
    const [card_num, setCardNum] = useState('');
    const [expired_date, setExpiredDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [billing_address, setBillingAdd] = useState(null);
    const [success, setSuccess] = useState(false);
    const [params, setParams] = useState({page: 1});
    const [currInfo, setCurrInfo] = useState('');

    function showSuccess(){
        setSuccess(!success);
        console.log("here");
     }

     useEffect(() => {
        const { page } = params;
        fetch(`http://127.0.0.1:8000/accounts/users/${id.userId}/payment_method/`,
        {headers: userDetailHeaders
        })
        .then(res => res.json())
        .then(json => {
            console.log(json);
            setCurrInfo(json);    
        })
    }, [params])

    const handleSelect = (e) =>{
        setCardType(e.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("card_type", `${card_type}`);
        formData.append("card_num", `${card_num}`);
        if(expired_date){formData.append("expired_date", `${expired_date}`);}
        if(cvv){formData.append("cvv", `${cvv}`);}
        if(billing_address){formData.append("billing_address", `${billing_address}`);}

        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }

        fetch(`http://127.0.0.1:8000/accounts/users/${id.userId}/payment_method/`, {
            method: 'PUT',
            body: formData,
            headers: userDetailHeaders})
            .then(res=>{
                console.log(res);
              if(res.status === 200){
                    showSuccess();
                    //  navToUserCenter();
              }
            })
    }


    return (
        <div className="auth-form-container">
            <h2 className="payment-title" >Add Your Payment Method Here</h2>
            <div>
             {success ? <EditSuccessPop /> : null}
              </div>
        <form className="paymentmethod-form" onSubmit={handleSubmit}>
            <label htmlFor="card_type">Select Payment Method*</label>
            <select name="slt_card_type" 
                    id="slt_card_type" 
                    onChange={handleSelect}>
                <option>Current Card Type: {`${currInfo.card_type}`}</option>
                    {options.map((option, index) => {
                        return <option key={index} >
                            {option}
                        </option>
                })}
            </select>
            <label htmlFor="card_num">Card Number*</label>
            <input value={card_num} 
                   onChange={(e) => setCardNum(e.target.value)}
                   type="card_num" 
                   placeholder={`${currInfo.card_num}`}
                   id="card_num" 
                   name="card_num" />
            <label htmlFor="cvv">CVV</label>
            <input value={cvv} 
                   onChange={(e) => setCvv(e.target.value)}
                   placeholder={`${currInfo.cvv}`}
                   id="cvv" 
                   name="cvv" />
            <label htmlFor="expired_date">Current Card Expired Date: {currInfo.expired_date} </label>
            <input value={expired_date}
                   type = "date" 
                   onChange={(e) => setExpiredDate(e.target.value)}
                   id="expired_date" 
                   name="expired_date"
                   defaultValue={`${currInfo.expired_date}`} />
            <label htmlFor="billing_address">Billing Address</label>
            <input value={billing_address} 
                   onChange={(e) => setBillingAdd(e.target.value)}
                   placeholder={`${currInfo.billing_address}`}
                   id="billing_address" 
                   name="billding_address"
                    />         
            <button className="reg-log-btn" id="submit" type="submit">Update</button>
        </form>
    </div>
    )
}

export default EditPaymentMethod;
