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