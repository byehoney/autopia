import React, { Component } from 'react';
import Collapse, {Panel} from 'rc-collapse';
import 'rc-collapse/assets/index.css';


class AccordionExmple extends React.Component {
    state = {
        activeKey: '1'
    }
  
  render() {
      const header = <div onClick={()=>{this.setState({
                        activeKey: '0'
                    })}}>header</div>;
    return (
        <Collapse accordion={true} activeKey={this.state.activeKey}>
            <Panel header={header} headerClass="my-header-class" showArrow={false} >
            this is panel content
                <div onClick={()=>{
                    this.setState({
                        activeKey: ''
                    })
                }}>hide</div>
            </Panel>
            <Panel header="title2">
            this is panel content2 or other
                <div onClick={()=>{
                    this.setState({
                        activeKey: ''
                    })
                }}>hide</div>
            </Panel>
        </Collapse>
    );
  }
}

export default AccordionExmple