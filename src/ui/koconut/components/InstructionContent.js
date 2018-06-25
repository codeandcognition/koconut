// @flow
import React, {Component} from 'react';
import ReactMarkdown from 'react-markdown';
import LargeButton from './LargeButton';

const largeButtonTypes = {
  prev: "PREV",
  next: "NEXT"
}

export default class InstructionContent extends Component {
  render() {
    return (
        <div className={"d-flex"} style={{textAlign: "center", width: "100%"}}>
          <LargeButton click={this.props.prev}
                       type={largeButtonTypes.prev}
                        types={largeButtonTypes}
                        className={"p-2"}/>
          <div style={{textAlign: "left", width: "100%", paddingLeft: "100px"}}>
          <ReactMarkdown className={"flex-grow-1"}
                         source={this.props.instruction.content} />
          </div>
          <LargeButton click={this.props.next}
                       type={largeButtonTypes.next}
                       types={largeButtonTypes}
                       className={"p-2"}/>
        </div>
    )
  }
}