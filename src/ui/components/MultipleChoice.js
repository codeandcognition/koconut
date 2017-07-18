// @flow
import React, {Component} from 'react';
import Choice from './Choice';
import './MultipleChoice.css';

/**
 * The MultipleChoice component represents multiple choice answer selection
 * @class
 */
class MultipleChoice extends Component {
  props: {
    /* the possible choices */
    answers: string[],
    selected: ?string,
    handleClick: Function
  };

  render() {
    return (
        <div className='multiple-choice'>
          <h3>Select the correct answer:</h3>
          {/* Create a choice component for each item in answers */}
          {this.props.answers.map((choice) => (
              <Choice
                  key={choice}
                  content={choice}
                  selected={choice === this.props.selected}
                  handleClick={this.props.handleClick}
              />
          ))}
        </div>
    );
  }
}

export default MultipleChoice;
