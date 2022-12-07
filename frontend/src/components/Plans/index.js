import {useContext, useEffect, useState} from "react";
import PlansTable from "./PlansTable";
import PlansAPIContext from "../../Contexts/PlansAPIContext";
import { useNavigate } from "react-router-dom";
import './style.css';

const Plans = () => {
    // const navigate = useNavigate();
    // const toFilter = (method)=>{
    //     navigate('/classes/filter', { state: { method:method } })
    // }
    const perPage = 3;
    const [params, setParams] = useState({page: 1});
    const [hasNext, setHasNext] = useState(false);
    const [hasPrev, setHasPrev] = useState(false);
    const { setPlans } = useContext(PlansAPIContext);
    useEffect(() => {
        const { page } = params;
        fetch(`http://127.0.0.1:8000/subscriptions/plans/?page=${page}`)
            .then(res => res.json())
            .then(json => {
                console.log(json.results);
                setPlans(json.results);
                json.next?setHasNext(true):setHasNext(false);
                json.previous?setHasPrev(true):setHasPrev(false);
            })
    }, [params])

    return (
        <div className="plan">
            <PlansTable id="plans-table" perPage={perPage} params={params} />
            <div>
                <button className="change-page-btn" hidden={!hasPrev}
                    onClick={() => setParams({
                    ...params,
                    page: Math.max(1, params.page - 1)
                })}>
                    Go Back
                </button>
                <button className="change-page-btn" hidden={!hasNext}
                    onClick={() => setParams({
                    ...params,
                    page: params.page + 1
                })}>
                    View More
                </button>
            </div>
        </div>
    )
}

export default Plans;