import {useContext} from "react";

// import './style.css';
import { useNavigate } from "react-router-dom";
import PlansAPIContext from "../../../Contexts/PlansAPIContext";


const UpdatePlansTable = ({ perPage, params }) => {
    const { Plans } = useContext(PlansAPIContext);

    const navigate = useNavigate();
    const toUpdate = (plan_id, plan_name)=>{
        navigate('/plans/update', { state: { plan_id:plan_id, plan_name:plan_name } })
    }

    if (Plans && Plans.length > 0){
        return <table className="plan_table">
            <thead>
            <tr className="row_title">
                <th> Plan </th>
                <th> Price </th>
                <th> Description </th>
                <th> Update </th>
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
                            "Are you sure you want to change to this plan?\n " +
                            "Click OK to update your subscription, Cancel to stop.");
                        if (answer) {
                            console.log("updated");
                            toUpdate(Plan.id, Plan.name);
                        } else {console.log("Not updated");}
                    }}>
                        Update
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


export default UpdatePlansTable;