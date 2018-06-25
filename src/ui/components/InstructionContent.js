// @flow
import React, {Component} from 'react';
import ReactMarkdown from 'react-markdown';
import LargeButton from './LargeButton';
import CodeBlock from'./CodeBlock';
import assign from 'lodash.assign';

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
                       instructionIndex={this.props.currentInstructionIndex}
                       maxInstruction={this.props.maxInstruction}
                        className={"p-2"}/>
          <div style={{textAlign: "left", width: "100%"}}>
          <ReactMarkdown className={"flex-grow-1"}
                         source={this.props.instruction.content}
                         renderers={assign({}, ReactMarkdown.renderers, {CodeBlock: CodeBlock})}
                         />
          </div>
          <LargeButton click={this.props.next}
                       type={largeButtonTypes.next}
                       types={largeButtonTypes}
                       className={"p-2"}
                       instructionIndex={this.props.currentInstructionIndex}
                       maxInstruction={this.props.maxInstruction}/>
        </div>
    )
  }
}