// @flow
import React, {Component} from 'react';
import Code from '../components/Code';
import Response from './Response';
import Types from '../../../data/ExerciseTypes.js';
import Submit from '../components/Submit';
import './Information.css';

import type {Exercise} from '../../../data/Exercises';

/**
 * The Information container contains Code or both Code and Response.
 * @class
 */
class Information extends Component {
  props: {
    exercise: Exercise,
    answer: ?string[],  // Maybe type - can be null/void
    updateHandler: Function,
    feedback: string[],
    submitOk: Function,
    submitTryAgain: Function,
    mode: string,
    toggleCodeTheme: Function,
    codeTheme: string,
    submitHandler: Function
  };

  /**
   * Returns JSX for (or not for) the Code container given the current props
   * @param question question object in Exercise
   * @param index index of question in Exercise
   * @returns JSX for the Code container
   */
  renderCodeView(question: any, index: number) {
      if((Types.isSurvey(question.type) ||
          (question.type === Types.multipleChoice
          &&
              ((question.code && question.code === '') || (!question.code))
          )) || question.type === Types.table
      ) {
        return '';
      } else {
        return (<Code
                      key={"code" + index}
                      type={question.type}
                      code={question.code}
                      updateHandler={
                        Types.isInlineResponseType(question.type) ?
                            this.props.updateHandler :
                            undefined
                      }
                      toggleCodeTheme={this.props.toggleCodeTheme}
                      feedback={this.props.feedback[index]}
                      questionIndex={index}
                      submitTryAgain={this.props.submitTryAgain}
                      />);
      }
  }

  /**
   * Returns JSX for (or not for) the Response container given the current props
   * @param question question object in Exercise
   * @param index index of question in Exercise
   * @returns JSX for the Response container
   */
  renderResponseView(question: any, index: number) {
      let type = question.type;

      return Types.isInlineResponseType(type) ? <div /> :
          <Response
              key={"response"+index}
            type={type}
            choices={question.choices}
            answer={this.props.answer}
            questionIndex={index}
            question={question}
            updateHandler={this.props.updateHandler}
            feedback={this.props.feedback[index]}
            submitOk={this.props.submitOk}
            submitTryAgain={this.props.submitTryAgain}
            mode={this.props.mode}
            submitHandler={this.props.submitHandler}
            />
  }

  render() {
    let correctCount = this.props.feedback.reduce((acc, item) =>
      item === "correct" ? acc + 1 : acc
    , 0);
    let expectedCorrect = this.props.exercise.questions.length;
    console.log(this.props.feedback);
    return (
        <div>
          {/* TODO replace learn yourself a good 1*/}
          {correctCount >= expectedCorrect ?
                <div> wow good joob you learnt yourself a good 1 </div> :
                this.props.exercise.questions.map((question, index) => {
                return (
                    <div key={"information" + index}>
                    <div className="information">
                      {this.renderCodeView(question, index)}
                      {this.renderResponseView(question, index)}
                    </div>
                      {!(this.props.feedback[index]) &&
                      <Submit submitHandler={() => this.props.submitHandler(this.props.answer, index)} />
                      }
                    </div>);
            })
          }
        </div>

    );
  }
}

export default Information;
