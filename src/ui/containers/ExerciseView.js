// @flow
import React, {Component} from 'react';
import Prompt from '../components/Prompt';
import Information from './Information';
import Submit from '../components/Submit';
import './ExerciseView.css';

type Props = {
  exercise: {
    prompt: string,
    code: string,
    type: string,
    choices?: string[],
    concept: string
  },
  submitHandler: Function
}

/**
 * The Exercise container contains all components of an assessment problem.
 * @class
 */
class Exercise extends Component {
  state: {
    prompt: string,
    code: string,
    type: string,
    choices?: string[],
    answer: ?string,
    concept: string
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      prompt: props.exercise.prompt,
      code: props.exercise.code,
      type: props.exercise.type,
      choices: props.exercise.choices,
      answer: null,
      concept: props.exercise.concept
    };
  }

  /**
   * Updates the Exercise state when receiving a new props object
   * @param nextProps - the next props object being received
   */
  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      prompt: nextProps.exercise.prompt,
      code: nextProps.exercise.code,
      type: nextProps.exercise.type,
      choices: nextProps.exercise.choices,
      answer: null,
      concept: nextProps.exercise.concept
    });
  }

  render() {
    return (
        <div className="problem">
          <Prompt content={this.state.prompt} type={this.state.type}/>
          <Information
              code={this.state.code}
              type={this.state.type}
              choices={this.state.choices}
              answer={this.state.answer}
              concept={this.state.concept}
              updateHandler={(content) => this.setState({answer: content})}
          />
          <Submit submitHandler={() => this.props.submitHandler(this.state.answer)}/>
        </div>
    );
  }
}

export default Exercise;
