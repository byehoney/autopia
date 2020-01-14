import React, { Component } from 'react';
import { connect } from 'react-redux';
import login from '../redux/loginAction'

class Index extends Component {
    componentDidMount() {
        this.initInfo(this.props.location.search);
    }
    initInfo(search) {
        console.log(this)
        if(!search) return;
        let params = search.slice(1).split('&');
        let info = {};
        params.map(item => {
            let param = item.split('=');
            info[param[0]] = decodeURIComponent(param[1]);
        })
        
        this.props.login(info);

        const prev = info.prev ? info.prev : 'home';
        this.props.history.push('/' + prev);
    }
    render() {
        return (
            <div></div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user
})
  
const mapDispatchToProps = dispatch => ({
    login: user => dispatch(login(user))
})
  // 连接 tore 和组件
export default connect(mapStateToProps,mapDispatchToProps)(Index);