// @flow
import React, {Component} from 'react';
import Prompt from '../components/Prompt';
import Information from './Information';
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
  resetAnswer: Function;
  state: {
    answer: string[],
    followupAnswers: any[]
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      answer: [],
      followupAnswers: []
    };
    this.resetAnswer = this.resetAnswer.bind(this);
  }

  /**
   * Moves the Exercise view to the top
   */
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    console.log("Exercise component has unmounted");
    this.resetAnswer();
    this.props.resetFeedback();
  }

  /**
   * Returns whether the answer is defined and non-null or not.
   * @returns {boolean}
   */
  isAnswered() {
    let _a = this.state.answer;
    return _a !== undefined && _a !== null;
  }


  resetAnswer() {
    this.setState({
      answer: [],
      followupAnswers: []
    });
  }


  render() {
    let styles = {  // TODO put this in the constructor, unnecessary calculations per render
      marginTop: '10%'
    };

    return (
        <div className="exercise-view" style={styles}>
          <Prompt exercise={this.props.exercise} />
          <Information
              exercise={this.props.exercise}
              answer={this.state.answer}
              followupAnswers={this.state.followupAnswers}
              updateHandler={(content, index, fIndex) => {
                if (fIndex === -1) {
                  let temp = this.state.answer;
                  temp[index] = content;
                  this.setState({
                    answer: temp
                  });
                } else {
                  let temp = this.state.followupAnswers;
                  temp[index] = [];
                  temp[index][fIndex] = content;
                  this.setState({
                    followupAnswers: temp
                  });
                }
              }}
              feedback={this.props.feedback}
              followupFeedback={this.props.followupFeedback}
              submitOk={this.props.submitOk}
              submitTryAgain={this.props.submitTryAgain}
              mode={this.props.mode}
              codeTheme={this.props.codeTheme}
              toggleCodeTheme={(test) => this.props.toggleCodeTheme(test)}
              submitHandler={this.props.submitHandler}
              timesGotQuestionWrong={this.props.timesGotQuestionWrong}
              nextQuestion={this.props.nextQuestion}
              resetAnswer={this.resetAnswer}
          />
          <ConceptLabel concepts={this.props.exercise.concepts}/>
        </div>
    );
  }
}

export default Exercise;
