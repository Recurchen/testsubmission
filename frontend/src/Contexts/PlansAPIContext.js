import {createContext, useState} from "react";

export const usePlansAPIContext = () => {
    const [Plans, setPlans] = useState([]);

    return {
        Plans,
        setPlans,
    }
}

const PlansAPIContext = createContext({
    Plans: null, setPlans: () => {},
})

export default PlansAPIContext;
