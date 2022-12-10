import {useContext} from "react";
import GeneralClassesAPIContext from "../../../Contexts/GeneralClassesAPIContext";
import { useNavigate } from "react-router-dom";


const GeneralClassesTable = () => {
        const { GeneralClasses } = useContext(GeneralClassesAPIContext);
        if (GeneralClasses && GeneralClasses.length > 0){
            console.log('inside')
            return <table className="plan_table">
                <thead>
                <tr className="row_title">
                    <th className={'th'}> In Studio </th>
                    <th className={'th'}> Name </th>
                    <th className={'th'}> Description </th>
                    <th className={'th'}> Coach </th>
                    <th className={'th'}> Capacity </th>
                    <th className={'th'}> Recurrences </th>
                    <th className={'th'}> Start Date </th>
                    <th className={'th'}> End Date </th>
                    <th className={'th'}> Time </th>
                    <th className={'th'}> Categories </th>
                </tr>
                </thead>
                <tbody>
    
                {GeneralClasses && GeneralClasses.map((c, index) => (
                    
                    <tr className="plans" key={c.id}>
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
