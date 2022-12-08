import React, { useState } from "react";
import './style.css';
import {Link, Outlet} from "react-router-dom";
import PopUp from '../Popup'; 
import useToken from "../../useToken";
import useUserId from "../../useUserId";
import { useNavigate } from "react-router-dom";
import AddSuccessPop from "./AddSuccessPop";

const AddPaymentMethod = (props) => {

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

    function showSuccess(){
        setSuccess(!success);
        console.log("here");
     }

    const handleSelect = (e) =>{
        setCardType(e.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("card_type", `${card_type}`);
        formData.append("card_num", `${card_num}`);
        formData.append("expired_date", `${expired_date}`);
        formData.append("cvv", `${cvv}`);
        formData.append("billing_address", `${billing_address}`);

        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }

        fetch(`http://127.0.0.1:8000/accounts/users/${id.userId}/payment_method/add/`, {
            method: 'POST',
            body: formData,
            headers: userDetailHeaders})
            .then(res=>{
                console.log(res);
              if(res.status === 200){
                    console.log("yeah")
                    showSuccess();
                    //  navToUserCenter();
              }
            })
    }

    return (
        <div className="auth-form-container">
            <h2 className="payment-title" >Add Your Payment Method Here</h2>
            <div>
             {success ? <AddSuccessPop /> : null}
              </div>
        <form className="paymentmethod-form" onSubmit={handleSubmit}>
            <label htmlFor="card_type">Select Payment Method</label>
            <select name="slt_card_type" 
                    id="slt_card_type" 
                    onChange={handleSelect}>
                <option>Please choose one Card Type</option>
                    {options.map((option, index) => {
                        return <option key={index} >
                            {option}
                        </option>
                })}
            </select>
            <label htmlFor="card_num">Card Numer</label>
            <input value={card_num} 
                   onChange={(e) => setCardNum(e.target.value)}
                   type="card_num" 
                   placeholder="enter your card number" 
                   id="card_num" 
                   name="card_num" />
            <label htmlFor="cvv">CVV</label>
            <input value={cvv} 
                   onChange={(e) => setCvv(e.target.value)}
                   placeholder="enter your card cvv"
                   id="cvv" 
                   name="cvv" />
            <label htmlFor="expired_date">Card Expired Date</label>
            <input value={expired_date}
                   type = "date" 
                   onChange={(e) => setExpiredDate(e.target.value)}
                   id="expired_date" 
                   name="expired_date" />
            <label htmlFor="billing_address">Billing Address</label>
            <input value={billing_address} 
                   onChange={(e) => setBillingAdd(e.target.value)}
                   placeholder="enter your billing address"
                   id="billing_address" 
                   name="billding_address" />         
            <button className="reg-log-btn" id="submit" type="submit">Update</button>
        </form>
    </div>
    )
}

export default AddPaymentMethod;
