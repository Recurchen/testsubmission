import {useContext} from "react";
import GeneralClassesAPIContext from "../../../Contexts/GeneralClassesAPIContext";
import { useNavigate } from "react-router-dom";


const GeneralClassesTable = () => {
        const { GeneralClasses } = useContext(GeneralClassesAPIContext);
        if (GeneralClasses && GeneralClasses.length > 0){
            console.log('inside')
            return <table className="plan_table">
                <thead>
                <tr className="row_title" style={{fontSize:'x-large'}}>
                    <th> In Studio </th>
                    <th> Name </th>
                    <th> Description </th>
                    <th> Coach </th>
                    <th> Capacity </th>
                    <th> Recurrences </th>
                    <th> Start Date </th>
                    <th> End Date </th>
                    <th> Time </th>
                    <th> Categories </th>
                </tr>
                </thead>
                <tbody>
    
                {GeneralClasses && GeneralClasses.map((c, index) => (
                    
                    <tr className="plans" key={c.id} style={{fontSize:'large'}}>
                        <td>{c.studio['name']}</td>
                        <td>{ c.name }</td>
                        <td>{ c.description}</td>
                        <td>{ c.coach}</td>
                        <td>{ c.capacity}</td>
                        <td>{c.recurrences.split(':')[1]}</td>
                        <td>{c.start_date}</td>
                        <td>{c.end_date}</td>
                        <td>{c.start_time +'~'+c.end_time}</td>
                        <td>{c.categories}</td>

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
