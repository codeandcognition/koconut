// @flow
import React, {Component} from 'react';
import Choice from './Choice';
import './MultipleChoice.css';

/**
 * The MultipleChoice component represents multiple choice answer selection
 * @class
 */
class MultipleChoice extends Component {
  props: {
    title: string,
    /* the possible choices */
    choices: string[],
    labels: ?string[],
    tooltips: ?string[],
    answer: string[],
    handleClick: Function,
    questionIndex: number
  };

  render() {
    let labels = this.props.labels;
    return (
        <div className='multiple-choice'>
          <h3>{this.props.title}</h3>
          {/* Create a choice component for each item in answers */}
          {this.props.answer !== undefined && this.props.questionIndex > -1 && this.props.choices.map((choice, i) =>
              choice.length > 0 ?
              (<Choice
                  key={choice}
                  choice={choice}
                  content={labels !== null && labels !== undefined?labels[i]:choice}
                  answer={choice === this.props.answer[this.props.questionIndex] }
                  tooltip={
                    this.props.tooltips !== undefined &&
                    this.props.tooltips !== null
                      ? this.props.tooltips[i]
                      : undefined
                  }
                  handleClick={this.props.handleClick}
                  questionIndex={this.props.questionIndex}
              />) : ''
          )}
        </div>
    );
  }
}

export default MultipleChoice;
