import {useContext} from "react";
import GeneralClassesAPIContext from "../../../Contexts/GeneralClassesAPIContext";
import { useNavigate } from "react-router-dom";


const GeneralClassesTable = ({ perPage, params }) => {
        const { GeneralClasses } = useContext(GeneralClassesAPIContext);
        const navigate = useNavigate();
        // const toDetail = (studio_id)=>{
        //     navigate('/studio/detail', {state:{studio_id:studio_id}});
        // }


        if (GeneralClasses && GeneralClasses.length > 0){
        
            console.log('inside')
            return <table className="plan_table">
                <thead>
                <tr className="row_title">
                    
                    <th> Name </th>
                    <th> Description </th>
                    <th> Coach </th>
                    <th> Capacity </th>
                </tr>
                </thead>
                <tbody>
    
                {GeneralClasses && GeneralClasses.map((GeneralClass, index) => (
                    
                    <tr className="plans" key={GeneralClass.id}>
                        <td>{ GeneralClass.name }</td>
                        <td>{ GeneralClass.description}</td>
                        <td>{ GeneralClass.coach}</td>
                        <td>{ GeneralClass.capacity}</td>
                        {/* <td><button 
                            onClick={
                                (e) => {e.preventDefault();
                                    toDetail(Studio.id);
                                    }}> 
                                    
                                Know More</button> </td> */}
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
    

export default GeneralClassesTable;