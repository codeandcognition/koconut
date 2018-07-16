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

    var feedbackData = this.props.exercise.questions[this.props.questionIndex].feedback;

    return (
      <div style={{width: "60%"}} className="feedback">
        <div className="feedback-correctness">
          <p>Your response: {String(this.props.answer[this.props.questionIndex])}</p>
        </div>
        <VisualFeedback feedback={gotCorrect}/>
        <div style={{textAlign: "left"}} className={"feedback-correctness"}>
          <p>{gotCorrect === "correct" ? "Well done!" : "Not quite!"}</p>
          {this.props.type === "multipleChoice" ? (
              <p>{this.props.feedback}</p>
          ) : (
              <p>{gotCorrect === "correct" ? feedbackData[0] : feedbackData[1]}</p>
          )}
        </div>
        <div className="feedback-ok">
          <button onClick={this.props.submitOk}>Continue</button>
          {gotCorrect !== "correct" &&
            <button onClick={this.props.submitTryAgain}>Try Again</button>
          }
        </div>
      </div>
    )
  }
}

export default Feedback;