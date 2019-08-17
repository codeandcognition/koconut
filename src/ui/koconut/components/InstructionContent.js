// @flow
import React, {Component} from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from'./CodeBlock';
import './InstructionContent.css';

/**
 * InstructionContent is the main content of the instructions, along with
 * the large buttons
 * @class
 */
export default class InstructionContent extends Component {
  render() {
    return (
        <div className={"d-flex totalContent"} style={{fontSize: 20}}>
          {/*<LargeButton click={this.props.prev}
                       type={largeButtonTypes.prev}
                       types={largeButtonTypes}
                       instructionIndex={this.props.currentInstructionIndex}
                       maxInstruction={this.props.maxInstruction}
                        className={"p-2"}/>*/}
          <div className={"markdownContent"}>
          <ReactMarkdown className={"flex-grow-1"}
                         source={this.props.instruction.content}
                         renderers={{code: CodeBlock}}
                         escapeHtml={false}
                         />
          </div>
          {/*<LargeButton click={this.props.next}
                       type={largeButtonTypes.next}
                       types={largeButtonTypes}
                       className={"p-2"}
                       instructionIndex={this.props.currentInstructionIndex}
                       maxInstruction={this.props.maxInstruction}/>*/}
        </div>
    )
  }
}