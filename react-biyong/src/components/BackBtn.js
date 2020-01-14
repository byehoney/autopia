import React, { Component } from 'react';
import { withRouter } from "react-router";

class BackBtn extends Component {
    render() {
        return (
            this.props.from == 'mini' ?
           <div className='back-btn'
                onClick={()=>{
                    if(this.props.back){
                        this.props.history.go(this.props.back);
                    }else{
                        this.props.history.go(-1);
                    }
                   
                }}
            ></div>
            : ''
        );
    }
}

export default withRouter(BackBtn);
