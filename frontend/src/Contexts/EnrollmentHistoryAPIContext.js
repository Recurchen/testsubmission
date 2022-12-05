import {createContext, useState} from "react";

export const useEnrollmentHistoryAPIContext = () => {
    const [EnrollmentHistory, setEnrollmentHistory] = useState([]);

    return {
        EnrollmentHistory,
        setEnrollmentHistory
    }
}

const EnrollmentHistoryAPIContext = createContext({
    enrollmentHistory: null, setEnrollmentHistory: () => {},
})

export default EnrollmentHistoryAPIContext;