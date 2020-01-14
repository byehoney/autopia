import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './TopNav.css';
import backIcon from '../../images/backIcon.png'
export default class Tabbar extends Component {
    state = {  
    
    }
    goBack(){
        this.props.back();
    }
    render() {
        const title = this.props.title;
        return(
            <div className="Nav">
                <img onClick={()=>{this.goBack()}} src={backIcon} alt="" className="backIcon"/>
                <span className="title">{title}</span>
            </div>
        )
    }
}