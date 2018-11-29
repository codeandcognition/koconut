// @flow
import React, {Component} from 'react';
import Choice from './Choice';
import './MultipleChoice.css';
import CodeBlock from './CodeBlock';
import ReactMarkdown from "react-markdown";

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
            <p className={'heading'}>
							<ReactMarkdown
									source={this.props.title}
									renderers={{code: CodeBlock}}
							/>
            </p>
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
                        choiceIndex={i}
												handleClick={this.props.handleClick}
												questionIndex={this.props.questionIndex}
												disabled={this.props.feedback}
                        dataLogger={this.props.dataLogger}
										/>) : ''
						)}
          </div>
        </div>
    );
  }
}

export default MultipleChoice;
