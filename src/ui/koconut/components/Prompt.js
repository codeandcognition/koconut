// @flow
import React, {Component} from 'react';
import ReactMarkdown from 'react-markdown';
import './Prompt.css';

import type {Exercise} from '../../../data/ExerciseTypes.js';

/**
 * The Prompt component contains the assessment prompt.
 * @class
 */
class Prompt extends Component {
  props: {
    exercise: Exercise
  };

  render() {
    let exTypes = this.props.exercise.questions.reduce((accumulator, curr, currIndex) => {
      if(this.props.exercise.questions.length-1 === currIndex) {
        return accumulator + curr.type;
      } else {
        return accumulator + curr.type + ", ";
      }
    }, "");
    return (
        <div className="prompt">
          <ReactMarkdown source={this.props.exercise.prompt ? this.props.exercise.prompt : ""}>
            {/* for debugging */}
          </ReactMarkdown>
          <span className="exercise-type">({exTypes})</span>
        </div>
    );
  }
}

export default Prompt;
