// @flow
import React, {Component} from 'react';

export default class InstructionTitle extends Component {
  render() {
    return( <div style={{fontSize: 35, textAlign: "center"}}>{this.props.instruction.title}</div>)
  }
}