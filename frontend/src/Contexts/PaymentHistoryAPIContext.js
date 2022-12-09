import {createContext, useState} from "react";

export const usePaymentHistoryAPIContext = () => {
    const [PaymentHistory, setPaymentHistory] = useState([]);

    return {
        PaymentHistory,
        setPaymentHistory,
    }
}

const PaymentHistoryAPIContext = createContext({
    PaymentHistory: null, setPaymentHistory: () => {},
})

export default PaymentHistoryAPIContext;
