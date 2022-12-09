import {createContext, useState} from "react";

export const useStudiosAPIContext = () => {
    const [Studios, setStudios] = useState([]);

    return {
        Studios,
        setStudios,
    }
}

const StudiosAPIContext = createContext({
    Studios: null, setStudios: () => {},
})

export default StudiosAPIContext;
