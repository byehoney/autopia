import React,{Component} from "react";
import { connect } from 'react-redux'
import BackBtn from "../components/BackBtn";
import NetUtil from '../utils/NetUtil';
import '../styles/Find/serviceList.scss';
import { Link } from 'react-router-dom';
import { Toast,ListView } from 'antd-mobile';
import banner from '../images/fuwucha.png';
class ServiceList extends Component {
    constructor(props){
        super(props)
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => true,
        });
        this.state={
            dataSource,
            isLoading: true,
            hasMore:true,
            pageNum:1,
            pageSize:10,
            list:[],
            total:0
        }
    }
    componentDidMount() {
        this.getData();
    }
    onEndReached = (event) => {
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if(!this.state.hasMore){
            return;
        }
        if (this.state.isLoading || !this.state.hasMore) {
          return;
        }
        this.setState({ isLoading: true });
        this.getData();
    }
    getData(){
        Toast.loading('拼命加载中', 0);
        NetUtil.post('/api/opencar/goods/carOwnerService',
            {pageNum:this.state.pageNum,pageSize:this.state.pageSize})
            .then((res)=>{
                Toast.hide();
                if(res.code==0){
                    if(!res.data.carOwnerService.list.length){
                        this.setState({
                            hasMore:false,
                            isLoading:false,
                        })
                        return
                    }
                    let newList=[...this.state.list,...res.data.carOwnerService.list];
                    this.setState({
                        pageNum: this.state.pageNum+1,
                        total:res.data.carOwnerService.total,
                        list:newList,
                        dataSource:this.state.dataSource.cloneWithRows(newList),
                        isLoading: false,
                    })
                }
                console.log(res)
            })
    }
    render() {
        const row = (rowData, sectionID, rowID) => {
            let item = rowData;
            return (

                <div className="serviceItem" key={rowID}>
                    <Link to={`/productDetail/${item.goodsId}`}>
                        <img src={item.coverImage} alt=""/>
                    </Link>
                </div>
            );
        };
        return (
            <div className="serViceListContainer">
                <img className="banner" src={banner} alt=""/>
                <div className="serviceList">
                    <ListView
                        style={{background:'#fff'}}
                        ref={el => this.lv = el}
                        dataSource={this.state.dataSource}
                        renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                        {this.state.isLoading ? '拼命加载中...' : ''}
                        </div>)}
                        renderRow={row}
                        className="am-list"
                        pageSize={this.state.pageSize}
                        useBodyScroll
                        onEndReached={this.onEndReached}
                        scrollRenderAheadDistance={10}
                        onEndReachedThreshold={10}
                    />
                </div>
                <BackBtn from={this.props.user.from}/>
            </div>
        )
    }
}
export default connect(state=>{
    return {
        user:state.user,
    }
})(ServiceList);