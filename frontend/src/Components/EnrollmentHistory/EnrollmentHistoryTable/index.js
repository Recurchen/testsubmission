import {useContext} from "react";
import EnrollmentHistoryAPIContext from "../../../Contexts/EnrollmentHistoryAPIContext";


const EnrollmentHistoryTable = ({ perPage, params }) => {
    const { EnrollmentHistory } = useContext(EnrollmentHistoryAPIContext);
    return <table>
        <thead>
        <tr>
            <th> # </th>
            <th> Class Name </th>
            <th> Coach </th>
            <th> Start Time </th>
            <th> End Time </th>
            <th> Date </th>
            <th> Cancelled Or Not </th>
        </tr>
        </thead>
        <tbody>
        {EnrollmentHistory && EnrollmentHistory .map((enrollment, index) => (
            <tr key={enrollment.id}>
                <td>{ (params.page - 1) * perPage + index + 1 }</td>
                <td>{ enrollment.class_instance['belonged_class']['name'] }</td>
                <td>{ enrollment.class_instance['belonged_class']['coach'] }</td>
                <td>{ enrollment.class_start_time.split("T")[1].split('-')[0]}</td>
                <td>{ enrollment.class_instance['belonged_class']['end_time'] }</td>
                <td>{ enrollment.class_start_time.split("T")[0] }</td>
                <td>{ enrollment.is_cancelled === true?'Cancelled':'Not cancelled'}</td>
                <td> <button>
                    Drop
                </button> </td>
            </tr>
        ))}
        </tbody>
    </table>
}

export default EnrollmentHistoryTable;