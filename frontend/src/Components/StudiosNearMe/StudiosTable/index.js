import {useContext} from "react";
import StudiosAPIContext from "../../../Contexts/StudiosAPIContext";
import { useNavigate } from "react-router-dom";
import "./style.css"


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
                <tr class="row_title">
                    <th> Name </th>
                    <th> Address </th>
                    <th> Number </th>
                    <th> Postal Code </th>
                    <th> Picture</th>
                </tr>
                </thead>
                <tbody>
    
                {Studios && Studios.map((Studio, index) => (
                    // {Studios && Studios.map((Studio, index) => (
                    
                    <tr class="studioRow" key={Studio.id}>
                        <td>{ Studio.name }</td>
                        <td>{ Studio.address}</td>
                        <td>{ Studio.phone_number}</td>
                        <td>{ Studio.postal_code}</td>
                        {/* <td> <img src="http://localhost:8000/studio_images/Oakville_Pic_1.jpg"></img>  </td> */}
                        <td> <img class="studioImage" src={`http://localhost:8000` + Studio.images[0].image}></img>  </td>
                        {/* <td> { Studio.images[0].image} </td> */}
                        <td><button class="button-5"
                            onClick={
                                (e) => {e.preventDefault();
                                    toDetail(Studio.id);
                                    }}> 
                                    
                                Know More!</button> </td>
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
            <span style={{color:'white'}}> Please Make Sure Your Input Is Correct ;) </span>
        )
    
        }
    

export default StudiosTable;