// @flow
import React, {Component} from 'react';
import Code from '../components/Code';
import Response from './Response';
import Feedback from '../components/Feedback';
import Types from '../../../data/ExerciseTypes.js';
import './Information.css';

import type {Exercise, Question} from '../../../data/Exercises';

// Display type enum
const displayType = {
  exercise: 'EXERCISE',
  feedback: 'FEEDBACK',
  concept: 'CONCEPT',
};

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
  renderCodeView(question: Question, index: number) {
      if(Types.isSurvey(question.type) ||
          (question.type === Types.multipleChoice
          &&
              ((question.code && question.code === '') || (!question.code))
          )
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
                      />);
      }

    // Deprecated below

    // return (Types.isSurvey(this.props.type) ||
    //     (this.props.type === Types.multipleChoice && this.props.code === '')) ? '' :
    //     (<Code
    //         type={this.props.type}
    //         code={this.props.code}
    //         updateHandler={Types.isInlineResponseType(this.props.type)
    //             ? this.props.updateHandler
    //             : undefined}
    //     />);
  }

  /**
   * Returns JSX for (or not for) the Response container given the current props
   * @param question question object in Exercise
   * @param index index of question in Exercise
   * @returns JSX for the Response container
   */
  renderResponseView(question: Question, index: number) {
    // Deprecated below
    //
    // if (this.props.mode === displayType.feedback) {
    //   console.log("____", this.props.feedback);
    //   return <Feedback
    //       feedback={this.props.feedback}
    //       submitOk={this.props.submitOk}
    //       submitTryAgain={this.props.submitTryAgain}
    //   />
    // }


      let type = question.type;

      return Types.isInlineResponseType(type) ? <div /> :
          <Response
              key={"response"+index}
            type={type}
            choices={question.choices}
            answer={this.props.answer}
            questionIndex={index}
            updateHandler={this.props.updateHandler}
            feedback={this.props.feedback[index]}
            submitOk={this.props.submitOk}
            submitTryAgain={this.props.submitTryAgain}
            mode={this.props.mode}
            submitHandler={this.props.submitHandler}
            />

    // Deprecated below

    // return Types.isInlineResponseType(type) ? <div/>
    //     : <Response
    //         type={type}
    //         choices={this.props.choices}
    //         answer={this.props.answer}
    //         updateHandler={this.props.updateHandler}
    //         feedback={this.props.feedback}
    //         submitOk={this.props.submitOk}
    //         mode={this.props.mode}
    //     />;
  }

  render() {
    let correctCount = this.props.feedback.reduce((acc, item) =>
      item === "correct" ? acc + 1 : acc
    , 0);
    let expectedCorrect = this.props.exercise.questions.length;
    return (
        <div>
          {/* TODO replace learn yourself a good 1*/}
          {correctCount >= expectedCorrect ?
                <div> wow good joob you learnt yourself a good 1 </div> :
                this.props.exercise.questions.map((question, index) => {
              return (<div className="information" key={"information" + index}>
                {this.renderCodeView(question, index)}
                {this.renderResponseView(question, index)}
              </div>);
            })
          }
        </div>

    );
  }
}

export default Information;
