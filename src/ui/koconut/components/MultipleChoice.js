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
    questionIndex: number,
    feedback: any,
    fIndex: number
  };

  render() {
    let labels = this.props.labels;

    return (
        <div className='multiple-choice'>
          <div>
						<h5 className={'heading'}>{this.props.title}</h5>
						{/* Create a choice component for each item in answers */}
						{this.props.answer !== undefined && this.props.questionIndex > -1 && this.props.choices.map((choice, i) =>
								choice.length > 0 ?
										(<Choice
												key={choice}
												choice={choice}
												fIndex={this.props.fIndex}
												content={labels !== null && labels !== undefined ? labels[i] : choice}
												answer={(this.props.answer[this.props.questionIndex] && this.props.fIndex !== -1) ? choice === this.props.answer[this.props.questionIndex][this.props.fIndex] : choice === this.props.answer[this.props.questionIndex]}
												tooltip={
													this.props.tooltips !== undefined &&
													this.props.tooltips !== null
															? this.props.tooltips[i]
															: undefined
												}
												handleClick={this.props.handleClick}
												questionIndex={this.props.questionIndex}
												disabled={this.props.feedback ? true : false}
										/>) : ''
						)}
          </div>
        </div>
    );
  }
}

export default MultipleChoice;
