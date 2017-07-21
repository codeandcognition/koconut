// @flow
import React, {Component} from 'react';
import './Choice.css';

/**
 * The Choice component represents a choice in a multiple choice exercise
 * @class
 */
class Choice extends Component {
  props: {
    content: string,
    answer: boolean,
    handleClick: Function
  };

  render() {
    return (
        <div
            className={'choice ' + (this.props.answer ? 'answer' : '')}
            onClick={() => this.props.handleClick(this.props.content)}
        >
          {this.props.content}
        </div>
    );
  }
}

export default Choice;
