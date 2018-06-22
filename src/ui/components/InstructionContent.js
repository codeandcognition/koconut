// @flow
import React, {Component} from 'react';
import ReactMarkdown from 'react-markdown';

export default class InstructionContent extends Component {
  render() {
    return (<div><button onClick={this.props.prev}>Go back</button>
      <ReactMarkdown source={this.props.instruction.content} />
    <button onClick={this.props.next}>Go forward</button></div>)
  }
}