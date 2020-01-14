
import React from "react";
import NetUtil from '../utils/NetUtil';
import '../styles/violate.css';
class Violate extends React.Component {
  componentDidMount() {
    NetUtil.post('/api/info/news/classify/newsList',
                {platform: "2", classifyName: "头条", pageNum: 0, pageSize: 5})
        .then((json) => {
            console.log(json)
        });
  }
  render() {
    return <h1 className='test'>Hello, </h1>;
  }
}

export default Violate