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
    return (
      <div className="feedback">
        <div className="feedback-correctness">
          <p>Your answer was: {this.props.feedback}</p>
        </div>
        <VisualFeedback feedback={this.props.feedback}/>
        <div className="feedback-ok">
          <button onClick={this.props.submitOk}>OK</button>
          {this.props.feedback === "incorrect" &&
            <button onClick={this.props.submitTryAgain}>Try Again</button>
          }
        </div>
      </div>
    )
  }
}

export default Feedback;