import {useContext} from "react";

import './style.css';
import { useNavigate } from "react-router-dom";
import PlansAPIContext from "../../../Contexts/PlansAPIContext";

const PlansTable = ({ perPage, params }) => {
    const { Plans } = useContext(PlansAPIContext);
    console.log(Plans)
    if (Plans && Plans.length > 0){
        return <table className="plan_table">
            <thead>
            <tr className="row_title">
                <th> Plan </th>
                <th> Price </th>
                <th> Description </th>
                <th> Subscribe </th>
            </tr>
            </thead>
            <tbody>

            {Plans && Plans.map((Plan, index) => (
                <tr className="plans" key={Plan.id}>
                    <td>{ Plan.name }</td>
                    <td>{ Plan.price } {Plan.currency}</td>
                    <td>{ Plan.description}</td>
                    <td> <button className="sub-now-btn" onClick={(e) => {
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
                    </button> </td>
                </tr>
            ))}
            </tbody>
        </table>
        

    }
    return(
        <span style={{color:'red'}}> nothing </span>
    )

    }


export default PlansTable;