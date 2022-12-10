import {useContext, useEffect, useState} from "react";
import { Avatar } from '@material-ui/core';

import { useNavigate, useLocation } from "react-router-dom";
import './style.css';
import useToken from "../../useToken";
import useUserId from "../../useUserId";
import UpdatePlansTable from "./UpdatePlansTable";
import PlansAPIContext from "../../Contexts/PlansAPIContext";

const UpdateOrCancelSub = () => {

    const token = useToken();
    const id = useUserId();
    const { state } = useLocation();
    const { plan_name } = state;
    const [is_cancel, setIsCancel] = useState(false);
    const [params, setParams] = useState({page: 1, is_update: false});
    const perPage = 6;
    const [hasNext, setHasNext] = useState(true);
    const [hasPrev, setHasPrev] = useState(false);
    const { setPlans } = useContext(PlansAPIContext);
    const [update, setUpdate] = useState('');

    const cancelHeaders = new Headers({
        'Authorization' : `Bearer ${token.token}`
    })

    const handleCancel = ( ) => {
        const answer = window.confirm("" +
                            "Are you sure you want to cancel your subscription?\n" +
                            "Your membership will be hold until last day of your subscription.\n" +
                            "Click OK to cancel your subscription, Cancel to stop.");
                        if (answer) {
                            setIsCancel(true);
                        }}
    
    const handleUpdate = () => {
        view_plans();
        setParams({
            page: 1,
            is_update: true,
        });
    }

    const view_plans = () => {
        const new_part = (
            <div className="plan">
            <UpdatePlansTable id="update-table" perPage={perPage} params={params} />
            <div>
                <button className="update-plan-btn" hidden={!hasPrev}
                    onClick={() => setParams({
                    page: Math.max(1, params.page - 1),
                    is_update: true,
                })}>
                    Go Back
                </button>
                <button className="update-plan-btn" hidden={!hasNext}
                    onClick={() => setParams({
                    page: params.page + 1,
                    is_update: true,
                })}>
                    View More
                </button>
            </div>
        </div>
        )
        setUpdate(new_part);
    }

    const navigate = useNavigate();
    const navToMain = ()=>{
        navigate('/');
    }

    useEffect(() => {
        if(is_cancel === true){
        console.log("enter cancel use effect");
        fetch(`http://127.0.0.1:8000/subscriptions/users/${id.userId}/cancel/`,
        {method: 'POST',
         headers: cancelHeaders})
        .then(res => {
            if (res.status == 200)
            {navToMain();}
            else{
                window.alert("Sorry, the cancellation is failed, try again later");
            }
        })
    }
    }, [is_cancel])

    useEffect(() => {
        const { page, is_update } = params;
        if(is_update === true){
        fetch(`http://localhost:8000/subscriptions/plans/?page=${page}`)
            .then(res => res.json())
            .then(json => {
                console.log(json);
                setPlans(json.results);
                json.next?setHasNext(true):setHasNext(false);
                json.previous?setHasPrev(true):setHasPrev(false);
            })
        }
    }, [params])

    return (
        <div className="update_or_cancel_sub">
            <h2 className="update_or_cancel_sub_title">Your Current Membership Plans is: { plan_name }</h2>
            <button className="uoc_btn" id="cancel" onClick={handleCancel}>Check to Cancel Your Subscription</button>
            <button className="uoc_btn" id="update" onClick={handleUpdate}>Check to Update Your Subscription</button>
            { update }
        </div>
    )
}

export default UpdateOrCancelSub;