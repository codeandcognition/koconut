// @flow
import React, {Component} from 'react';
import ReactTooltip from 'react-tooltip';
import './Choice.css';

/**
 * The Choice component represents a choice in a multiple choice exercise
 * @class
 */
class Choice extends Component {
  props: {
    choice: string,
    content: string,
    answer: boolean,
    tooltip: ?string,
    handleClick: Function,
    questionIndex: number
  };

  renderTooltip() {
    if(this.props.tooltip)
      return (
        <ReactTooltip
          id={this.props.content}
          place="right"
          effect="solid"
        >
          {this.props.tooltip}
        </ReactTooltip>
      )
  }

  render() {
    return (
        <div
            className={`choice ${this.props.answer ? 'answer' : ''} ${this.props.disabled ? 'disabled' : 'notdisabled'}`}
            onClick={() => {
              if(!this.props.disabled) {
                this.props.handleClick(this.props.choice, this.props.questionIndex);           
              }
            }}
            data-tip
            data-for={this.props.content}
        >
          {this.props.content}
          {this.renderTooltip()}
        </div>
    );
  }
}

export default Choice;
