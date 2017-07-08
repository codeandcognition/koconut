// @flow
import React, {Component} from 'react';
import Question from '../components/Question';
import Information from './Information';

type Props = { question: { content: string, code: string, type: string, answers: string[] } }

/**
 * The Problem container contains all components of an assessment problem.
 * @class
 */
class Problem extends Component {
  state: {
    content: string,
    code: string,
    type: string,
    answers: string[]
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      content: props.question.content,
      code: props.question.code,
      type: props.question.type,
      answers: props.question.answers
    };
  }

  render() {
    return (
        <div className="problem">
          <Question content={this.state.content}/>
          <Information code={this.state.code} type={this.state.type} answers={this.state.answers}/>
        </div>
    );
  }
}

export default Problem;
