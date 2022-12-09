import {createContext, useState} from "react";

export const useGeneralClassesAPIContext = () => {
    const [GeneralClasses, setGeneralClasses] = useState([]);

    return {
        GeneralClasses,
        setGeneralClasses,
    }
}

const GeneralClassesAPIContext = createContext({
    GeneralClasses: null, setGeneralClasses: () => {},
})

export default GeneralClassesAPIContext;

