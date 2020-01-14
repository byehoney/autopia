import React from "react";
import { ListView } from 'antd-mobile';
import NetUtil from '../utils/NetUtil';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
          });
      
        this.state = {
            data: [],
            isLoading: true,
            pageno: 1,
            dataSource,
            hasNextPage: true
        }
    }
    componentDidMount() {
        this.getData();
    }
    getData() {console.log(this.props.goodsId)
        NetUtil.post('/api/opencar/act/buy/query',
                    {goodsId: this.props.goodsId, 
                     pageNum: this.state.pageno, 
                     pageSize: 5})
        .then((json) => {
            let data = [...this.state.data, ...json.data.StarBuyHistory.list];
            this.setState({
                data: data,
                pageno: this.state.pageno + 1,
                dataSource: this.state.dataSource.cloneWithRows(data),
                isLoading: false,
                hasNextPage: json.data.StarBuyHistory.hasNextPage
            })
        });
    }
    onEndReached = (event) => {
        if (this.state.isLoading || !this.state.hasNextPage) {
          return;
        }
        this.setState({ isLoading: true });
        this.getData();
    }
    render() {
        const row=(rowData, sectionID, rowID)=>{
            return(
                <div className='record-item' key={rowID}>
                    <div className='item-name'>
                        <img src={rowData.nickName!=null?rowData.headimgurl:'https://cms-img.oss-cn-hangzhou.aliyuncs.com/wechat/planet/v2/avatar-default.png'} alt=''/>
                        <span>{rowData.nickName!=null?rowData.nickName:rowData.telNumber}</span>
                    </div>
                    <div className='time'>{rowData.buyTime}</div>
                </div>
            )
        }
        return (
            <ListView
                ref={el => this.lv = el}
                dataSource={this.state.dataSource}
                renderRow={row}
                renderFooter={() => ( this.state.isLoading ? <div style={{ padding: 10, textAlign: 'center' }}>loading....</div> : '')}
                pageSize={4}
                scrollRenderAheadDistance={500}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={10}
                useBodyScroll={true}
            >
            </ListView>
        );
        
    }
}