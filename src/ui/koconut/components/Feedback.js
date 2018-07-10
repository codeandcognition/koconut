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

    return (
      <div className="feedback">
        <div className="feedback-correctness">
          <p>Your answer was: {gotCorrect}</p>
        </div>
        <VisualFeedback feedback={gotCorrect}/>
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