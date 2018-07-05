// @flow
import React, {Component} from 'react';
import Code from '../components/Code';
import Response from './Response';
import Feedback from '../components/Feedback';
import Types from '../../../data/ExerciseTypes.js';
import './Information.css';

import type {Exercise} from '../../../data/Exercises';

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
    answer: ?string,  // Maybe type - can be null/void
    updateHandler: Function,
    feedback: string[],
    submitOk: Function,
    submitTryAgain: Function,
    mode: string,
    toggleCodeTheme: Function,
    codeTheme: string
  };

  /**
   * Returns JSX for (or not for) the Code container given the current props
   * @returns JSX for the Code container
   */
  renderCodeView() {
    return this.props.exercise.questions.map((question, index) => {
      // split apart so easier to parse
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
                      }/>);
      }
    });


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
   * @returns JSX for the Response container
   */
  renderResponseView() {
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

    return this.props.exercise.questions.map((question, index) => {
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
            mode={this.props.mode}
            />
    })

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
    return (
        <div className="information">
          {this.renderCodeView()}
          {this.renderResponseView()}
        </div>
    );
  }
}

export default Information;
