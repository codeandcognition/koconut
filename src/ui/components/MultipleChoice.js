// @flow
import React, {Component} from 'react';
import Choice from './Choice';

/**
 * The MultipleChoice component represents multiple choice answer selection
 * @class
 */
class MultipleChoice extends Component {
  props: {
    answers: string[] // or array<string>
  };

  render() {
    return (
        <div className='multiple-choice'>
          <h3>Submit your response here:</h3>
          // Create a choice component for each item in answers
          {this.props.answers.map((choice) => (
            <Choice content={choice}/>
          ))}
        </div>
    );
  }
}

export default MultipleChoice;
