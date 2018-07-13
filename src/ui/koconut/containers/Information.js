// @flow
import React, {Component} from 'react';
import Code from '../components/Code';
import Response from './Response';
import Types from '../../../data/ExerciseTypes.js';
import Submit from '../components/Submit';
import Feedback from '../components/Feedback';

import './Information.css';

import type {Exercise} from '../../../data/Exercises';

/**
 * The Information container contains Code or both Code and Response.
 * @class
 */
class Information extends Component {
  props: {
    exercise: Exercise,
    answer: any,  // Maybe type - can be null/void
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

      return Types.isInlineResponseType(type) 
      // || (this.props.feedback[index] &&
      //       (question.type !=="table" &&
      //       question.type !=="multipleChoice" &&
      //       question.type !=="selectMultiple")
      //       ) 
            ? <div /> :
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

  /**
   * Returns JSX for (or not for) the Feedback container given the current props
   * @param question question object in Exercise
   * @param index index of question in Exercise
   * @returns JSX for the Feedback container
   */
  renderFeedback(question: any, index: number) {
      if(this.props.feedback[index]) {
        return <Feedback
        feedback={this.props.feedback[index]}
        questionIndex={index}
        submitTryAgain={() => this.props.submitTryAgain(index)}
        type={question.type}
        />
      }
      return <div />
  }

  render() {
    // todo count correct correctly
    let correctCount = this.props.feedback.reduce((acc, item, index) => {
          if (this.props.exercise.questions[index].type === "checkboxQuestion" ||
              this.props.exercise.questions[index].type === "table") {
            return item && item.toString().indexOf("incorrect") === -1 &&
            item.toString().indexOf("correct") !== -1 ? acc + 1 : acc;
          } else {
            return item === "correct" ? acc + 1 : acc
          }
        }
    , 0);
    let expectedCorrect = this.props.exercise.questions.length;

    return (
        <div>
          {/* TODO replace learn yourself a good 1*/}
          {correctCount >= expectedCorrect ?
                <div> wow good joob you learnt yourself a good 1 </div> :
                this.props.exercise.questions.map((question, index) => {
                return (
                    <div key={"information" + index} className={"information-with-submit"}>
                    <div className="information">
                      {this.renderCodeView(question, index)}
                      {this.renderResponseView(question, index)}
                      {this.renderFeedback(question, index)}
                    </div>
                      {!(this.props.feedback[index]) &&
                      <Submit submitHandler={() => this.props.submitHandler(this.props.answer, index, question.type)} />
                      }
                    </div>);
            })
          }
        </div>

    );
  }
}

export default Information;
