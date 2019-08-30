// @flow
import React, {Component} from 'react';
import ReactTooltip from 'react-tooltip';
import ReactMarkdown from 'react-markdown';
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
    questionIndex: number,
    disabled: boolean,
    fIndex: number
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
    // ${this.props.disabled ? 'disabled' : 'notdisabled'}
    return (
        <div
            className={`choice ${this.props.answer ? 'answer' : ''}`}
            onClick={() => {
              this.props.handleClick(this.props.choice, this.props.questionIndex, this.props.fIndex);
              // if (!this.props.disabled) {

              // }
            }}
            data-tip
            style={{width: "60%"}}
            data-for={this.props.content}>
          <ReactMarkdown>{this.props.content}</ReactMarkdown>
          <br />
          {this.renderTooltip()}
        </div>
    );
  }
}

export default Choice;
