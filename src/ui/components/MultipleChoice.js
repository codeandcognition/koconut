// @flow
import React, {Component} from 'react';
import Choice from './Choice';

type Props = {
  answers: string[]
};

/**
 * The MultipleChoice component represents multiple choice answer selection
 * @class
 */
class MultipleChoice extends Component {
  state: {
    selected: string
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      selected: ""
    };
  }

  render() {
    return (
        <div className='multiple-choice'>
          <h3>Submit your response here:</h3>
          {
            // Create a choice component for each item in answers
          }
          {this.props.answers.map((choice) => (
              <Choice
                  key={choice}
                  content={choice}
                  selected={choice === this.state.selected}
                  handleClick={(choice) => this.setState( {selected: choice} )}
              />
          ))}
        </div>
    );
  }
}

export default MultipleChoice;
