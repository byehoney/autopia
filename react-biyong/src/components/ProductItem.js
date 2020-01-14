import React from "react";

const ProductItem = (props) => {
    return (
        <div className='prod-item'
            onClick={()=>{
                props.toDetail({id:props.goodsId})
            }}>
            <img src={props.coverImage} className='item-image' alt=''></img>
            <div className='item-title'>{props.goodsName}</div>
            <div className='item-count'>剩余{props.stockNumber>=0?props.stockNumber:0}件</div>
            <div className='item-price'>
                <div className='zuan11'>
                    <div className='item-zuan'> {props.tokenNumber} </div>
                </div>
            </div>
            <div className='dh-btn'>立即兑换</div>
        </div>
    );
};

export default ProductItem;
