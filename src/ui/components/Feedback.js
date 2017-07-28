// @flow
import React, {Component} from 'react';

import './Feedback.css';

/**
 * Component that displays a feedback modal after user submits an answer.
 * @class
 */

class Feedback extends Component {
  props: {
    feedback: boolean,
    nextConcepts: string
  };

  render() {
    console.log(this.props.feedback);
    return (
      <div className="feedback">
        <p>Your answer was: {this.props.feedback} </p>
        <p>Next concepts: {this.props.nextConcepts} </p>
      </div>
    )
  }
}

export default Feedback;