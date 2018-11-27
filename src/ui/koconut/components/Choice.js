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
    return (
        <div
            className={`choice ${this.props.answer ? 'answer' : ''} ${this.props.disabled ? 'disabled' : 'notdisabled'}`}
            onClick={() => {
              if (!this.props.disabled) {
                this.props.handleClick(this.props.choice, this.props.questionIndex, this.props.fIndex);
                this.props.dataLogger.addData({
                  event: "MOUSECLICK",
                  keyPressed: "LeftClick",
                  selectedAnswer: this.props.choiceIndex
                });
              }
            }}
            data-tip
            style={{width: "60%"}}
            data-for={this.props.content}>
            <ReactMarkdown className={"flex-grow-1"}
												 source={this.props.content}
												 renderers={{code: CodeBlock}}
												 escapeHtml={true}
					/>
          {/* {this.props.content} */} {/** TODO: Replaced this line with the reactmarkdown */}
          <br />
          {this.renderTooltip()}
        </div>
    );
  }
}

export default Choice;
