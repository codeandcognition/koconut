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
  feedback: boolean,
  nextConcepts: string[],
  submitOk: Function,
  mode: string
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
   */
  componentWillReceiveProps() {
    this.setState({
      answer: null,
    });
  }

  /**
   * Returns whether the answer is defined and non-null or not.
   * @returns {boolean}
   */
  isAnswered() {
    let _a = this.state.answer;
    return _a !== undefined && _a !== null;
  }

  render() {
    return (
        <div className="exercise-view">
          <Prompt content={this.props.exercise.prompt} type={this.props.exercise.type}/>
          <Information
              code={this.props.exercise.code}
              type={this.props.exercise.type}
              choices={this.props.exercise.choices}
              answer={this.state.answer}
              concept={this.props.exercise.concept}
              updateHandler={(content) => this.setState({answer: content})}
              feedback={this.props.feedback}
              submitOk={this.props.submitOk}
              mode={this.props.mode}
          />
          <Submit click={this.isAnswered()} submitHandler={() => this.props.submitHandler(this.state.answer)}/>
          {/*<Feedback feedback={this.props.feedback} nextConcepts={this.props.nextConcepts}/>*/}
        </div>
    );
  }
}

export default Exercise;
