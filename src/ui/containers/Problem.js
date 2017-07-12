// @flow
import React, {Component} from 'react';
import Question from '../components/Question';
import Information from './Information';
import Submit from '../components/Submit';

type Props = {
  question: {
    prompt: string,
    code: string,
    type: string,
    answers?: string[]
  }
}

/**
 * The Problem container contains all components of an assessment problem.
 * @class
 */
class Problem extends Component {
  state: {
    prompt: string,
    code: string,
    type: string,
    answers?: string[],
    selected: ?string
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      prompt: props.question.prompt,
      code: props.question.code,
      type: props.question.type,
      answers: props.question.answers,
      selected: null
    };
  }

  /**
   * Returns a callback function for the Response component's child to call to
   * update the Problem state
   * @param type - the question type
   * @returns a callback function that updates Problem state
   */
  getHandler(type: string): Function {
    switch(type) {
      case "MultipleChoice":
        return (choice) => this.setState( {selected: choice} );
      default:
        return () => console.log("Bleh!");
    }
  }

  render() {
    return (
        <div className="problem">
          <Question content={this.state.prompt}/>
          <Information
            code={this.state.code}
            type={this.state.type}
            answers={this.state.answers}
            selected={this.state.selected}
            updateHandler={this.getHandler(this.state.type)}
          />
          <Submit />
        </div>
    );
  }
}

export default Problem;
