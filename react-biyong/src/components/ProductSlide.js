import React from "react";
import { Carousel } from 'antd-mobile';

export default class App extends React.Component {
  render() {
    return (
        <Carousel
          autoplay={false}
          infinite
          style={{height:'7.5rem'}}
        >
          {this.props.imgs.map((img, i) => (
              <img
                src={img}
                alt=""
                key={i}
                style={{ width: '100%', verticalAlign: 'top', height: '7.5rem' }}
              />
          ))}
        </Carousel>
    );
  }
}