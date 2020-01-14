import React from "react";
import { connect } from 'react-redux';
import NetUtil from '../utils/NetUtil';
import ProductSlide from '../components/ProductSlide';
import ProductRecords from '../components/ProductRecords';
import { Toast } from 'antd-mobile';
import BackBtn from "../components/BackBtn";
import '../styles/product.scss';

class ProductDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detail: null,
            token: 0,
            xieyiEd: true,
            goodsId: ''
        };
    }
    componentDidMount() {
        const goodsId = this.props.match.params.id;
        this.setState({
            goodsId
        })
        NetUtil.get('/api/opencar/goods/detail?goodsId='+goodsId)
        .then((json) => {
            this.setState({
                detail: json.data.GoodsDetail
            })
        })
        NetUtil.post('/api/opencar/wallet/detail', {
            userId: this.props.user.userId,
            pageNum: 1,
            pageSize: 1
        }).then((json) => {
            this.setState({
                token: json.data.totalAmount
            })
        })
    }
    exchange() {
        if(this.state.xieyiEd==false){
            Toast.info('请勾选商品兑换协议', 1);
            return;
        }
        if (this.state.detail.stockNumber<=0){
            Toast.info('库存不足', 1);
            return;
        }
        this.props.history.push('/order/'+this.state.goodsId);
    }
    render() {
        const detail = this.state.detail;
        return (
            detail ? 
            <div className='prod-detail'>
                <div className='prod-main'>
                    <ProductSlide imgs = {detail.broadcastImageList}></ProductSlide>
                    <div  className='prod-info'>
                        <div className='prod-name'>{detail.goodsName}</div>
                        <div className='prod-count'>
                        <div className='prod-zuan'>{detail.tokenNumber}</div>
                        <div>包邮：剩余
                            <span>{detail.stockNumber}</span>件</div>
                        </div>
                    </div>
                    <div className='record-list'>
                        <div className='record-title'>
                        <span className='icon-title'></span>兑换记录</div>
                        <ProductRecords goodsId={this.state.goodsId} key={this.state.goodsId}/>
                    </div>
                </div>
                <div className='bottom'>
                    <div className='tips'>免费兑换商品，暂不支持退换货</div>
                    {detail.tokenNumber > this.state.token ? 
                        <div className='dh-btn'>Car币不足，快去做任务获取吧</div> 
                        :
                        <div className='bottomDh' >
                            <div className='dhFoot' >
                                <span>所需Car币<span>{detail.tokenNumber}</span></span>
                                <div className='dhFoot2' 
                                    onClick={this.exchange.bind(this)}>
                                    立即兑换
                                </div>
                            </div>
                            <div className='xieyi'>
                                <input type='checkbox' 
                                    id="cb" 
                                    defaultChecked={this.state.xieyiEd} 
                                    onClick={()=>{
                                        this.setState({
                                            xieyiEd: !this.state.xieyiEd
                                        })
                                    }}
                                    hidden/>
                                <label htmlFor='cb' className='cbg'></label>
                                <span onClick={()=>{this.props.history.push('/agreement')}}>
                                    商品兑换协议
                                </span>
                            </div>
                        </div>
                    }
                </div>
                <BackBtn from={this.props.user.from}/>
            </div>
            :
            <div>
                <BackBtn from={this.props.user.from}/>
            </div>
        );
    }
}
const mapStateToProps = state => ({
    user: state.user
})
  // 连接 tore 和组件
export default connect(mapStateToProps)(ProductDetail);