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
    title: string,
    /* the possible choices */
    choices: string[],
    tooltips: ?string[],
    answer: ?string,
    handleClick: Function
  };

  render() {
    return (
        <div className='multiple-choice'>
          <h3>{this.props.title}</h3>
          {/* Create a choice component for each item in answers */}
          {this.props.choices.map((choice, i) => (
              <Choice
                  key={choice}
                  content={choice}
                  answer={choice === this.props.answer}
                  tooltip={
                    this.props.tooltips !== undefined &&
                    this.props.tooltips !== null
                      ? this.props.tooltips[i]
                      : undefined
                  }
                  handleClick={this.props.handleClick}
              />
          ))}
        </div>
    );
  }
}

export default MultipleChoice;
