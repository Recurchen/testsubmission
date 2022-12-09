import {useContext} from "react";
import StudiosAPIContext from "../../../Contexts/StudiosAPIContext";
import { useNavigate } from "react-router-dom";


const StudiosTable = ({ perPage, params }) => {
        const { Studios } = useContext(StudiosAPIContext);
        const navigate = useNavigate();
        const toDetail = (studio_id)=>{
            navigate('/studio/detail', {state:{studio_id:studio_id}});
        }


        if (Studios && Studios.length > 0){
        
            console.log('inside')
            return <table className="plan_table">
                <thead>
                <tr className="row_title">
                    <th> Name </th>
                    <th> Address </th>
                    <th> Number </th>
                    <th> Postal Code </th>
                </tr>
                </thead>
                <tbody>
    
                {Studios && Studios.map((Studio, index) => (
                    // {Studios && Studios.map((Studio, index) => (
                    <tr className="plans" key={Studio.id}>
                        <td>{ Studio.name }</td>
                        <td>{ Studio.address}</td>
                        <td>{ Studio.phone_number}</td>
                        <td>{ Studio.postal_code}</td>
                        <td><button 
                            onClick={
                                (e) => {e.preventDefault();
                                    toDetail(Studio.id);
                                    }}> 
                                    
                                Know More</button> </td>
                        {/* <td> <button className="sub-now-btn" onClick={(e) => {
                            e.preventDefault();
                            const answer = window.confirm("" +
                                "Are you sure you want to enrol in this class occurrence?\n " +
                                "Click OK to enrol, Cancel to stop.");
                            if (answer) {
                                console.log("Enrolled");
                                // toEnroll(ClassInstance.belonged_class['id'], ClassInstance.class_date);
                            } else {console.log("Not enrolled");}
                        }}>
                            Sub Now!
                        </button> </td> */}
                    </tr>
                ))}
                </tbody>
            </table>
            
    
        }
        return(
            <span style={{color:'red'}}> nothing </span>
        )
    
        }
    

export default StudiosTable;