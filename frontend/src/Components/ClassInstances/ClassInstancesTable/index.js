import {useContext, useEffect, useState} from "react";
import ClassInstancesAPIContext from "../../../Contexts/ClassInstancesAPIContext";
import { useNavigate } from "react-router-dom";
import './style.css'
import useToken from "../../../useToken";
const ClassInstancesTable = ({ perPage, params, studio_id }) => {
    const { ClassInstances } = useContext(ClassInstancesAPIContext);
    const navigate = useNavigate();
    const toEnroll = (id,date)=>{
        navigate('/enroll/', { state: { class_id:id, class_date:date,studio_id:studio_id } })
    }
    const toLogin = ()=>{navigate('/login');}
    const toClassSchedule = ()=>{
        console.log(studio_id);
        console.log('back schedule');
        navigate('/classes',{state:{studio_id:studio_id}});
    }
    const token = useToken();

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
                        onClick={(e) => {e.preventDefault();
                        const answer = window.confirm("" +
                            "Are you sure you want to enrol in this class occurrence?\n " +
                            "Click OK to enrol, Cancel to stop.");
                        if (answer) {
                            if(token.token === null){
                                alert('Forbidden to enroll. Please login.');
                                const ans = window.confirm("" +
                                    "Login now?\n " +
                                    "Click OK to login, Cancel to stay in current page.");
                                if(ans){
                                    toLogin();
                                }else{
                                    toClassSchedule();
                                    // navigate(-1);
                                }
                            }else{
                                console.log("Enrolled");
                                toEnroll(ClassInstance.belonged_class['id'], ClassInstance.class_date);
                            }
                        }else {console.log("Not enrolled");}
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
                            if(token.token === null){
                               alert('Forbidden to enroll. Please login.');
                                const ans = window.confirm("" +
                                    "Login now?\n " +
                                    "Click OK to login, Cancel to stay in current page.");
                                if(ans){
                                    toLogin();
                                }else{
                                    // navigate(-1);
                                    toClassSchedule();
                                }

                            }else{
                                console.log("Enrolled All");
                                toEnroll(ClassInstance.belonged_class['id'],'all');
                            }

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
        <span className={'noMatchClass'}> No matched class </span>
    )
    }

export default ClassInstancesTable;