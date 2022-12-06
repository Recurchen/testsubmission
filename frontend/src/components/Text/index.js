import React from "react";

class Text extends React.Component {
    render(){
        return <h1 style={{color: 'red'}}>{this.props.children}<br/></h1>
    }
}

export default Text;