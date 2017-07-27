// @flow
import React, {Component} from 'react';
import Prompt from '../components/Prompt';
import Information from './Information';
import Submit from '../components/Submit';
import Feedback from '../components/Feedback';

import './ExerciseView.css';

type Props = {
  exercise: {
    prompt: string,
    code: string,
    type: string,
    choices?: string[],
    concept: string
  },
  submitHandler: Function,
  feedback: boolean
}

/**
 * The Exercise container contains all components of an assessment problem.
 * @class
 */
class Exercise extends Component {
  state: {
    answer: ?string,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      answer: null,
    };
  }

  /**
   * Updates the Exercise state when receiving a new props object
   * @param nextProps - the next props object being received
   */
  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      answer: null,
    });
  }

  render() {
    return (
        <div className="problem">
          <Prompt content={this.props.exercise.prompt} type={this.props.exercise.type}/>
          <Information
              code={this.props.exercise.code}
              type={this.props.exercise.type}
              choices={this.props.exercise.choices}
              answer={this.state.answer}
              concept={this.props.exercise.concept}
              updateHandler={(content) => this.setState({answer: content})}
          />
          <Submit submitHandler={() => this.props.submitHandler(this.state.answer)}/>
          <Feedback feedback={this.props.feedback}/>
        </div>
    );
  }
}

export default Exercise;
