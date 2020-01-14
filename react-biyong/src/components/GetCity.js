import React from "react";
import { Picker } from 'antd-mobile';
import {oilCode} from '../utils/oilPriceCode';
import locate from '../images/icon-locate.png';
const AMap = window.AMap;
class GetCity extends React.Component {
    constructor(props){
        super(props)
        this.state={
            antdDistrict:[],
            pickerValue:['110000','110000'],
            curCity:this.props.city,
            curProvince:this.props.province
        }
    }
    static getDerivedStateFromProps(props, state){
        if(props.city!=state.city){
            return {
                curCity:props.city
            }
        }
        return null
    }
    componentDidMount() {
        this.setState({
            curCity:this.props.city
        })

        let antdDistrict =[];
        let districtData = require('../location.json');
        Object.keys(districtData).forEach((index)=>{
            let itemLevel1 ={};
            let itemLevel2 ={};
            itemLevel1.value = districtData[index].code;
            itemLevel1.label = districtData[index].name;
            itemLevel1.children = [];
            let data = districtData[index].cities;
            Object.keys(data).forEach((index)=>{
                itemLevel2.value = data[index].code;
                itemLevel2.label = data[index].name;
                itemLevel2.children = [];
                let data2 = data[index].districts;
                let itemLevel3 ={};
                itemLevel3.children = [];
                Object.keys(data2).forEach((index)=>{
                    itemLevel3.value = index;
                    itemLevel3.label = data2[index];
                    itemLevel2.children.push(itemLevel3);
                    itemLevel3 ={};
                });
                itemLevel1.children.push(itemLevel2);
                itemLevel2 ={};
            });
            antdDistrict.push(itemLevel1)
        });
        this.setState({
            antdDistrict:antdDistrict
        })
    }
    getCity(cValue){
        let code ='';
        let city='';
        let province='';
        cValue.forEach((item,index)=>{
            this.state.antdDistrict.forEach((itemF,indexF)=>{
                itemF.children.forEach((itemS,indexS)=>{
                    if(itemS.value==cValue[1]){
                        province = itemF.label;
                        city = itemS.label;
                        oilCode.forEach((itemT,indexT)=>{
                            if(province.indexOf(itemT.city)>-1){
                                code = itemT.code
                            }
                        })
                        this.setState({
                            curCity:itemS.label,
                            curProvince:province
                        })
                        return false;
                    }
                })
            })
        })
        this.props.selectCity(code,city,province)
    }
    render() {
        return (
            <div className="picker">
                <img className="localIcon" src={locate} alt="" />
                <Picker
                    title="选择地区"
                    extra="请选择(可选)"
                    cols={2}
                    data={this.state.antdDistrict}
                    value={this.state.pickerValue}
                    onOk={this.getCity.bind(this)}
                    >
                    <div className="city">{this.state.curCity}</div>
                </Picker>    
            </div>
        )
    }
}

export default GetCity