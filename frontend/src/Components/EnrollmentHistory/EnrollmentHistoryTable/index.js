import {useContext} from "react";
import EnrollmentHistoryAPIContext from "../../../Contexts/EnrollmentHistoryAPIContext";
import {useNavigate} from "react-router-dom";
import './style.css'

const EnrollmentHistoryTable = ({ perPage, params }) => {
    const { EnrollmentHistory } = useContext(EnrollmentHistoryAPIContext);
    const navigate = useNavigate();
    const toDrop = (id,date)=>{
        navigate('/drop/', { state: { class_id:id, class_date:date } })
    }

    if (!(EnrollmentHistory && EnrollmentHistory.length > 0)){
        return(
            <span className={'EmptyEnrollmentHistory'}> You have no enrollment history. </span>
        )
    }

    return <table className={'EnrollmentHistoryTable'}>
        <thead>
        <tr>
            <th> # </th>
            <th> Class Name </th>
            <th> Coach </th>
            <th> Start Time </th>
            <th> End Time </th>
            <th> Date </th>
            <th> Cancelled Or Not </th>
            <th> Drop class occurrence </th>
            <th> Drop all future class occurrences</th>
        </tr>
        </thead>
        <tbody>
        {EnrollmentHistory && EnrollmentHistory.map((enrollment, index) => (
            <tr key={enrollment.id}>
                <td>{ (params.page - 1) * perPage + index + 1 }</td>
                <td>{ enrollment.class_instance['belonged_class']['name'] }</td>
                <td>{ enrollment.class_instance['belonged_class']['coach'] }</td>
                <td>{ enrollment.class_start_time.split("T")[1].split('-')[0]}</td>
                <td>{ enrollment.class_instance['belonged_class']['end_time'] }</td>
                <td>{ enrollment.class_start_time.split("T")[0] }</td>
                <td>{ enrollment.is_cancelled === true?'Cancelled':'Not cancelled'}</td>
                <td>
                    <button className={'drop'}
                            hidden={!enrollment.in_future}
                            onClick={(e) => {
                                e.preventDefault();
                                const answer = window.confirm("" +
                                    "Are you sure you want to drop this class occurrence?\n " +
                                    "Click OK to drop, Cancel to stop.");
                                if (answer) {
                                    console.log("Dropped");
                                    toDrop(enrollment.class_instance['belonged_class']['id'],
                                        enrollment.class_instance['class_date']);
                                } else {console.log("Not drop");}
                            }}>
                        Drop
                    </button> </td>

                <td> <button className={'drop'}
                             hidden={!enrollment.in_future}
                             onClick={(e) => {
                                 e.preventDefault();
                                 const answer = window.confirm("" +
                                     "Are you sure you want to drop all future class occurrences?\n " +
                                     "Click OK to drop, Cancel to stop.");
                                 if (answer) {
                                     console.log("Dropped all");
                                     toDrop(enrollment.class_instance['belonged_class']['id'], 'all');
                                 } else {console.log("Not drop all");}
                             }}>
                    Drop All
                </button> </td>
            </tr>
        ))}
        </tbody>
    </table>
}

export default EnrollmentHistoryTable;