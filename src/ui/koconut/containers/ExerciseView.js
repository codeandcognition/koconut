// @flow
import React, {Component} from 'react';
import Prompt from '../components/Prompt';
import Information from './Information';
import Submit from '../components/Submit';
import ConceptLabel from '../components/ConceptLabel';

import './ExerciseView.css';

type Props = {
  exercise: {
    prompt: string,
    code: string,
    type: string,
    choices?: string[],
    concepts: string[]
  },
  submitHandler: Function,
  feedback?: string[],
  nextConcepts: string[],
  submitOk: Function,
  submitTryAgain: Function,
  mode: string,
  codeTheme: string
}

/**
 * The Exercise container contains all components of an assessment problem.
 * @class
 */
class Exercise extends Component {
  state: {
    answer: string[],
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      answer: []
    };
  }

  /**
   * Moves the Exercise view to the top
   */
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  // /**
  //  * Updates the Exercise state when receiving a new props object
  //  */
  // componentWillReceiveProps() {
  //   this.setState({
  //     answer: [],
  //   });
  // }

  /**
   * Returns whether the answer is defined and non-null or not.
   * @returns {boolean}
   */
  isAnswered() {
    let _a = this.state.answer;
    return _a !== undefined && _a !== null;
  }


  render() {
    let styles = {  // TODO put this in the constructor, unnecessary calculations per render
      marginTop: '10%'
    }
    console.log(this.state.answer);
    return (
        <div className="exercise-view" style={styles}>
          <Prompt exercise={this.props.exercise} />
          <Information
              exercise={this.props.exercise}
              answer={this.state.answer}
              updateHandler={(content, index) => {
                let temp = this.state.answer;
                temp[index] = content;
                this.setState({answer: temp});
              }}
              feedback={this.props.feedback}
              submitOk={this.props.submitOk}
              submitTryAgain={this.props.submitTryAgain}
              mode={this.props.mode}
              codeTheme={this.props.codeTheme}
              toggleCodeTheme={(test) => this.props.toggleCodeTheme(test)}
              submitHandler={this.props.submitHandler}
          />
          <ConceptLabel concepts={this.props.exercise.concepts}/>
        </div>
    );
  }
}

export default Exercise;
