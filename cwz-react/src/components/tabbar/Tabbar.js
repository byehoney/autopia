import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './tabbar.css';

export default class Tabbar extends Component {
    state = {  
        tabbar: {
            "list": [
              {
                "id": "0",
                "pagePath": "/",
                "text": "首页",
                "iconPath": require("../../images/icon-home.png"),
                "selectedIconPath": require("../../images/icon-home-selected.png"),
              },
              {
                "id": "1",
                "pagePath": "/topLineList",
                "text": "头条",
                "iconPath": require("../../images/icon-news.png"),
                "selectedIconPath": require("../../images/icon-news-selected.png"),
              },
              {
                "id": "2",
                "pagePath": "/find",
                "text": "我的",
                "iconPath": require("../../images/icon-my.png"),
                "selectedIconPath": require("../../images/icon-my-selected.png"),
              },
            ]
        }
    }
    render() {
        const current = this.props.current;
        return (
            <div className="tabbar">
            {
                this.state.tabbar.list.map((item,i) => {
                    return (
                        <div className="tabbar-item" key={i}>
                            <Link to={item.pagePath}>
                                <div><img className="icon" src={current=== item.id ? item.selectedIconPath : item.iconPath} alt=""/></div>
                                <div className={current=== item.id ? 'selected' : ''}>{item.text}</div>
                            </Link>  
                        </div>
                    )
                })
            }
            </div>
        );
    }
}