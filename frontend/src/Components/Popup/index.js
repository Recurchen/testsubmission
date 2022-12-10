import React, { Component } from "react";
import {Link} from "react-router-dom";
import './style.css';

class PopUp extends Component {

    render() {
        return (
        <div className="pop_window">
            <div className="modal_content">
            <p id="text">Welcome to TFC! Your registeration is completed!</p>
            <Link id="popup_rdir" to="/login" className="link-btn">Click to log in</Link>
            </div>
        </div>
        );
    }
}

export default PopUp