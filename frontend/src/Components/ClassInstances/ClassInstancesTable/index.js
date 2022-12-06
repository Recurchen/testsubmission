import {useContext} from "react";
import ClassInstancesAPIContext from "../../../Contexts/ClassInstancesAPIContext";
import { useNavigate } from "react-router-dom";

const ClassInstancesTable = ({ perPage, params }) => {
    const { ClassInstances } = useContext(ClassInstancesAPIContext);
    const navigate = useNavigate();
    const toEnroll = (id,date)=>{
        navigate('/enroll/', { state: { class_id:id, class_date:date } })
    }
    return <table>
            <thead>
            <tr>
                <th> # </th>
                <th> Class Name </th>
                <th> Coach </th>
                <th> Start Time </th>
                <th> End Time </th>
                <th> Date </th>
                <th> Capacity </th>
                <th> </th>
            </tr>
            </thead>
            <tbody>

            {ClassInstances && ClassInstances.map((ClassInstance, index) => (
                <tr key={ClassInstance.id}>
                    <td>{ (params.page - 1) * perPage + index + 1 }</td>
                    <td>{ ClassInstance.belonged_class['name'] }</td>
                    <td>{ ClassInstance.belonged_class['coach'] }</td>
                    <td>{ ClassInstance.start_time.split(" ")[1]}</td>
                    <td>{ ClassInstance.end_time.split(" ")[1] }</td>
                    <td>{ ClassInstance.class_date }</td>
                    <td>{ ClassInstance.capacity }</td>
                    <td> <button onClick={() =>
                        toEnroll(ClassInstance.belonged_class['id'],ClassInstance.class_date)}>
                        Enroll
                    </button> </td>
                </tr>
            ))}
            </tbody>
        </table>

}

export default ClassInstancesTable;