// @flow
import React, {Component} from 'react';
import './Question.css';

/**
 * The Question component contains the assessment prompt.
 * @class
 */
class Question extends Component {
  props: {
    content: string,
    type: string
  };

  render() {
    return (
        <div className="question">
          <h2>{this.props.content}
            <span className="question-type">({this.props.type})</span>
          </h2>
        </div>
    );
  }
}

export default Question;
