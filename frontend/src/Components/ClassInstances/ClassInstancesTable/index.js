import {useContext, useEffect, useState} from "react";
import ClassInstancesAPIContext from "../../../Contexts/ClassInstancesAPIContext";
import { useNavigate } from "react-router-dom";
import './style.css'
const ClassInstancesTable = ({ perPage, params }) => {
    const { ClassInstances } = useContext(ClassInstancesAPIContext);
    const navigate = useNavigate();
    const toEnroll = (id,date)=>{
        navigate('/enroll/', { state: { class_id:id, class_date:date } })
    }
    // let checkEnrol = false;
    // const [check, setCheck] = useState(false);
    // const ids = [];
    // useEffect(()=>{
    //     if(checkEnrol === false){
    //         fetch('http://localhost:8000/classes/enrollments/ids/')
    //             .then(res=>res.json())
    //             .then(json=>{
    //                 for(let i = 0; i < json[0]['ids'].length; i++){
    //                     ids.push(json[0]['ids'][i]);
    //                 }
    //             }).catch(e=>console.log(e))
    //         setCheck(true);
    //     }
    //     checkEnrol = true;
    // },[check])
    if (ClassInstances && ClassInstances.length > 0){
        return <table className={'ClassInstancesTable'}>
            <thead>
            <tr>
                <th> # </th>
                <th> Class Name </th>
                <th> Coach </th>
                <th> Start Time </th>
                <th> End Time </th>
                <th> Date </th>
                <th> Capacity </th>

                <th> Enroll class occurrence </th>
                <th> Enroll all future class occurrences</th>
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

                    <td> <button className={'enroll'}
                        onClick={(e) => {
                            e.preventDefault();
                        const answer = window.confirm("" +
                            "Are you sure you want to enrol in this class occurrence?\n " +
                            "Click OK to enrol, Cancel to stop.");
                        if (answer) {
                            console.log("Enrolled");
                            toEnroll(ClassInstance.belonged_class['id'], ClassInstance.class_date);
                        } else {console.log("Not enrolled");}
                    }}>
                        Enroll
                    </button> </td>

                    <td> <button className={'enroll'}
                        onClick={(e) =>{
                        e.preventDefault();
                        const answer = window.confirm("" +
                            "Are you sure you want to enrol in all future class occurrence?\n " +
                            "Click OK to enrol all, Cancel to stop.");
                        if (answer) {
                            console.log("Enrolled All");
                            toEnroll(ClassInstance.belonged_class['id'],'all');
                        }else {console.log("Not enrolled all");}
                    }
                    }>
                        Enroll All
                    </button> </td>
                </tr>
            ))}
            </tbody>
        </table>

    }
    return(
        <span style={{color:'red'}}> No matched Class </span>
    )
    }

export default ClassInstancesTable;