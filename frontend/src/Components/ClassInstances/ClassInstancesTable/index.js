import {useContext} from "react";
import APIContext from "../../../Contexts/ClassInstancesAPIContext";

const ClassInstancesTable = ({ perPage, params }) => {
    const { ClassInstances } = useContext(APIContext);

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

            {ClassInstances && ClassInstances .map((ClassInstance, index) => (
                <tr key={ClassInstance.id}>
                    <td>{ (params.page - 1) * perPage + index + 1 }</td>
                    <td>{ ClassInstance.belonged_class['name'] }</td>
                    <td>{ ClassInstance.belonged_class['coach'] }</td>
                    <td>{ ClassInstance.start_time.split(" ")[1]}</td>
                    <td>{ ClassInstance.end_time.split(" ")[1] }</td>
                    <td>{ ClassInstance.class_date }</td>
                    <td>{ ClassInstance.capacity }</td>
                    <td> <button>
                        Enroll
                    </button> </td>
                </tr>
            ))}
            </tbody>
        </table>



}

export default ClassInstancesTable;