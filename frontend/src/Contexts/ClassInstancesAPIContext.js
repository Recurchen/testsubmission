import {createContext, useState} from "react";

export const useAPIContext = () => {
    const [ClassInstances, setClassInstances] = useState([]);

    return {
        ClassInstances,
        setClassInstances
    }
}

const ClassInstancesAPIContext = createContext({
    ClassInstances: null, setClassInstances: () => {},
})

export default ClassInstancesAPIContext;