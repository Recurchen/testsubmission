import React, { Component } from "react";
import {Link, Outlet} from "react-router-dom";
// import './style.css';

class AddSuccessPop extends Component {

    render() {
        return (
        <div className="pop_window">
            <div className="modal_content">
            <p id="text">Congrats! Your payment method has been recorded.</p>
            <Link id="edit_succ_rdir" to="/usercenter" className="link-btn">Click to User Center</Link>
            </div>
        </div>
        );
    }
}

export default AddSuccessPop