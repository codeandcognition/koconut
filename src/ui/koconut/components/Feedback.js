// @flow
import React, {Component} from 'react';
import VisualFeedback from './VisualFeedback';

import './Feedback.css';


/**
 * Component that displays a feedback modal after user submits an answer.
 * @class
 */

// type Props = {feedback: boolean, submitHandler: Function};

class Feedback extends Component {
  showFeedbackMessage(type: string, timeswrong: any, feedback: any, gotCorrect: boolean) {
    if(type === "multipleChoice") {
      let answer = this.props.answer[this.props.questionIndex];
      return <div>{feedback[answer]}</div>
    } else {
      if(gotCorrect === "correct") {
        return <div>{feedback ? feedback.correct : ''}</div>
      } else {
        if(feedback && feedback.incorrect && timeswrong > feedback.incorrect.length) {
          return <div>{feedback.incorrect[feedback.incorrect.length - 1]}</div>
        } else {
          return <div>{feedback.incorrect[timeswrong-1]}</div>
        }
      }
    }
  }

  render() {
    let gotCorrect = "correct";
    if(this.props.type === "table") {
      this.props.feedback.forEach((d) => {
        d.forEach((e) => {
          if(e === "incorrect") {
            gotCorrect = "incorrect";
          }
        })
      })
    } else {
      gotCorrect = this.props.feedback;
    }

    return (
      <div className="feedback">
        <div className="feedback-correctness">
          <p>Your answer was: {gotCorrect}</p>
        </div>
        <VisualFeedback feedback={gotCorrect}/>
        {this.showFeedbackMessage(this.props.type, this.props.timesGotSpecificQuestionWrong, this.props.question.feedback, gotCorrect)}
        <div className="feedback-ok">
          <button onClick={this.props.submitOk}>OK</button>
          {gotCorrect !== "correct" &&
            <button onClick={this.props.submitTryAgain}>Try Again</button>
          }
        </div>
      </div>
    )
  }
}

export default Feedback;