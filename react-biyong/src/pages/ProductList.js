
import React from "react";
import { connect } from 'react-redux';
import LoginNav from "../components/LoginNav";
import NetUtil from '../utils/NetUtil';
import ProductItem from '../components/ProductItem';
import { ListView } from 'antd-mobile';
import '../styles/product.scss';
import Tabbar from "../components/Tabbar";
import BackBtn from "../components/BackBtn";

class ProductList extends React.Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
          });
      
        this.state = {
            data: [],
            isLoading: true,
            pageno: 1,
            pageSize:10,
            height: document.documentElement.clientHeight * 1,
            dataSource
        }
    }
    componentDidMount() {
        console.log(this.props)
        this.getData();
    }
    getData() {
        NetUtil.post('/api/opencar/goods/query',{pageSize:this.state.pageSize,pageNum:this.state.pageno})
        .then((json) => {
            if(json.code==0){
                if(json.data.pageGoods.list.length==0){
                    this.setState({
                        hasMore:false,
                    })
                }
                let data = [...this.state.data, ...json.data.pageGoods.list];
                this.setState({
                    data: data,
                    pageno: this.state.pageno + 1,
                    dataSource: this.state.dataSource.cloneWithRows(data),
                    isLoading: false,
                })
            }
        });
    }
    onEndReached = (event) => {
        if(!this.state.hasMore){
            return;
        }
        if (this.state.isLoading && !this.state.hasMore) {
          return;
        }
        this.setState({ isLoading: true });
        this.getData();
    }
    showLogin() {
        console.log(this)
        this.loginNav.showLogin();
    }
    render() {
        const row=(rowData, sectionID, rowID)=>{
            return(
                <ProductItem key={rowID}
                    toDetail={(data)=>{
                        if(!this.props.user.userId){
                            this.showLogin();
                            return;
                        }
                        this.props.history.push(`/productDetail/${data.id}`)
                    }}
                    {...rowData}>
                </ProductItem>
            )
        }
        return (
            <div>
                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}
                    renderRow={row}
                    renderFooter={() => ( this.state.isLoading ? <div style={{ padding: 10, textAlign: 'center' }}>loading....</div> : '')}
                    className="prod-list"
                    pageSize={this.state.pageSize}
                    scrollRenderAheadDistance={500}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={10}
                    style={{
                        height: this.state.height,
                        overflow: 'auto',
                    }}
                >
                    
                </ListView>
                <LoginNav 
                    ref={r => this.loginNav = r}
                    key={this.props.user.userId}
                    userId={this.props.user.userId}
                    from={this.props.user.from}
                    prev={`productList`}/>
                <BackBtn from={this.props.user.from}/>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user
})
  
  // 连接 tore 和组件
export default connect(mapStateToProps)(ProductList);