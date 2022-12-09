import {useContext} from "react";
import StudiosAPIContext from "../../../Contexts/StudiosAPIContext";


const StudiosTable = ({ perPage, params }) => {
        const { Studios } = useContext(StudiosAPIContext);
        
        console.log(Studios)
        console.log('hey')
        // if (Studios && Studios.length > 0){
        if (true) {
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