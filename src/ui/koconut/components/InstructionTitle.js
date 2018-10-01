// @flow
import React, {Component} from 'react';

export default class InstructionTitle extends Component {
  render() {
    return( <div style={{fontSize: 35}}>{this.props.instruction.title}</div>)
  }
}