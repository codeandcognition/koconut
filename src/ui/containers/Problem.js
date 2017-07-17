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
  handleSubmit: Function;

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

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      prompt: nextProps.question.prompt,
      code: nextProps.question.code,
      type: nextProps.question.type,
      answers: nextProps.question.answers,
      selected: null
    });
  }

  /**
   * TODO: actually make this do something
   */
  handleSubmit() {
    //placeholder code
    console.log(this.state.selected);
  }

  render() {
    return (
        <div className="problem">
          <Question content={this.state.prompt} type={this.state.type}/>
          <Information
            code={this.state.code}
            type={this.state.type}
            answers={this.state.answers}
            selected={this.state.selected}
            updateHandler={(content) => this.setState( {selected: content} )}
          />
          <Submit submitHandler={this.handleSubmit}/>
        </div>
    );
  }
}

export default Problem;
