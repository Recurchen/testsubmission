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
            <th> Is Cancelled </th>
            <th> <button> Drop </button> </th>
        </tr>
        </thead>
        <tbody>
        {EnrollmentHistory && EnrollmentHistory .map((enrollment, index) => (
            <tr key={enrollment.id}>
                <td>{ (params.page - 1) * perPage + index + 1 }</td>
                <td>{ enrollment.class_instance['belonged_class']['name'] }</td>
                <td>{ enrollment.class_instance['belonged_class']['coach'] }</td>
                <td>{ enrollment.class_start_time.split(" ")[1]}</td>
                <td>{ enrollment.class_instance['belonged_class']['end_time'].split(" ")[1] }</td>
                <td>{ enrollment.class_start_time.split(" ")[0] }</td>
                <td>{ enrollment.is_cancelled}</td>
                <td> <button>
                    Drop
                </button> </td>
            </tr>
        ))}
        </tbody>
    </table>
}

export default EnrollmentHistoryTable;