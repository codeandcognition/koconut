// @flow
import React, {Component} from 'react';
import Code from '../components/Code';
import Response from './Response';
import Types from '../../../data/ExerciseTypes.js';
import Submit from '../components/Submit';
import Feedback from '../components/Feedback';
import Paper from '@material-ui/core/Paper';
import ReactMarkdown from 'react-markdown';
import ExerciseQuestion from '../components/ExerciseQuestion';

import './Information.css';

import type {Exercise} from '../../../data/Exercises';

/**
 * The Information container contains Code or both Code and Response.
 * @class
 */

type Props = {
    exercise: Exercise,
    answer: any,  // Maybe type - can be null/void
    updateHandler: Function,
    feedback: string[],
    followupFeedback: any[],
    submitOk: Function,
    submitTryAgain: Function,
    mode: string,
    toggleCodeTheme: Function,
    codeTheme: string,
    submitHandler: Function,
    timesGotQuestionWrong: number[],
    nextQuestion: Function,
    resetAnswer: Function
};
class Information extends Component {
  addGaveUp: Function
  
  constructor(props: Props) {
    super(props);
    this.state = {
      exercise: null,
      feedback: null,
      followupFeedback: null,
      answer: null,
      followupAnswers: null,
      gaveUpCount: 0
    };
    this.addGaveUp = this.addGaveUp.bind(this);
  }

  componentWillMount() {
    this.setState({exercise: this.props.exercise, feedback: this.props.feedback, followupFeedback: this.props.followupFeedback, answer: this.props.answer, followupAnswers: this.props.followupAnswers});
  }

  componentWillReceiveProps(nextProps: any) {

    this.setState({exercise: nextProps.exercise, feedback: nextProps.feedback, followupFeedback: this.props.followupFeedback, answer: nextProps.answer, followupAnswers: this.props.followupAnswers});
  }

  /**
   * Returns JSX for (or not for) the Code container given the current props
   * @param question question object in Exercise
   * @param index index of question in Exercise
   * @returns JSX for the Code container
   */
  renderCodeView(question: any, index: number) {
      if((Types.isSurvey(question.type) ||
          (question.type === Types.multipleChoice
          &&
              ((question.code && question.code === '') || (!question.code))
          )) || question.type === Types.table
      ) {
        return '';
      } else {
        return (<Code
                      key={"code" + index}
                      type={question.type}
                      code={question.code}
                      updateHandler={
                        Types.isInlineResponseType(question.type) ?
                            this.props.updateHandler :
                            undefined
                      }
                      toggleCodeTheme={this.props.toggleCodeTheme}
                      feedback={this.state.feedback[index]}
                      questionIndex={index}
                      submitTryAgain={this.props.submitTryAgain}
                      />);
      }
  }

  /**
   * Returns JSX for (or not for) the Response container given the current props
   * @param question question object in Exercise
   * @param index index of question in Exercise
   * @returns JSX for the Response container
   */
  renderResponseView(question: any, index: number, fIndex: number) {
      let type = question.type;

    let parentFeedback = this.state.feedback[index];
    let followupFeedback = (this.state.followupFeedback
        && this.state.followupFeedback[index]) ? this.state.followupFeedback[index][fIndex] : this.state.followupFeedback[index];
    let feedback = fIndex === -1 ? parentFeedback : followupFeedback;

      return Types.isInlineResponseType(type) && type !== Types.writeCode
      // || (this.props.feedback[index] &&
      //       (question.type !=="table" &&
      //       question.type !=="multipleChoice" &&
      //       question.type !=="selectMultiple")
      //       ) 
          ? <div></div> :
          <Response
            key={"response"+index}
            type={type}
            choices={question.choices}
            answer={(fIndex === -1) ? this.state.answer : this.state.followupAnswers}
            questionIndex={index}
            question={question}
            updateHandler={this.props.updateHandler}
            feedback={feedback}
            submitOk={this.props.submitOk}
            submitTryAgain={this.props.submitTryAgain}
            mode={this.props.mode}
            submitHandler={this.props.submitHandler}
            fIndex={fIndex}
            />
  }

  /**
   * Returns JSX for (or not for) the Feedback container given the current props
   * @param question question object in Exercise
   * @param index index of question in Exercise
   * @returns JSX for the Feedback container
   */
  renderFeedback(question: any, index: number, fIndex: number) {
    let parentFeedback = this.state.feedback[index];
    let followupFeedback = (this.state.followupFeedback
                            && this.state.followupFeedback[index]) ? this.state.followupFeedback[index][fIndex] : this.state.followupFeedback[index];
    let feedback = fIndex === -1 ? parentFeedback : followupFeedback;
    if (feedback) {
      return <Feedback
        feedback={feedback}
        questionIndex={index}
        submitTryAgain={() => this.props.submitTryAgain(index, fIndex)}
        type={question.type}
        question={(fIndex === -1) ? this.state.exercise.questions[index] : this.state.exercise.questions[index].followupQuestions[fIndex]}
        timesGotSpecificQuestionWrong={this.props.timesGotQuestionWrong[index]}
        answer={(fIndex === -1) ? this.state.answer : this.state.followupAnswers}
        addGaveUp={this.addGaveUp}
        fIndex={fIndex}
      />
    }
    return <div />
  }

  addGaveUp() {
    this.setState({gaveUpCount: this.state.gaveUpCount + 1});
  }

  render() {

    // todo count correct correctly
    let correctCount = this.state.feedback.reduce((acc, item, index) => {
          if (this.state.exercise.questions[index].type === "checkboxQuestion" ||
              this.state.exercise.questions[index].type === "table") {
            return item && item.toString().indexOf("incorrect") === -1 &&
            item.toString().indexOf("correct") !== -1 ? acc + 1 : acc;
          } else {
            return item === "correct" ? acc + 1 : acc
          }
        }
    , 0);
    correctCount = correctCount + this.state.gaveUpCount;
    let expectedCorrect = this.state.exercise.questions.length;
    return (
        <div>
          {/* TODO replace learn yourself a good 1*/}
          {correctCount >= expectedCorrect &&
                <div><button onClick={() => {
                  this.props.nextQuestion();
                  this.props.resetAnswer();
                  this.setState({gaveUpCount: 0});
                }}>go to next question</button> </div>}
              {this.state.exercise.questions.map((question, index) => {
                return (
                  <Paper elevation={6} style={{padding: "0"}} key={"information" + index} className={"information-with-submit"}>
                    <ExerciseQuestion
                      key={index}
                      question={question}
                      index={index}
                      feedback={this.state.feedback[index]}
                      answer={this.state.answer}
                      renderCodeView={this.renderCodeView(question, index)}
                      renderResponseView={this.renderResponseView(question, index, -1)}
                      renderFeedback={this.renderFeedback(question, index, -1)}
                      submitHandler={this.props.submitHandler}
                      fIndex={-1}
                    />
                    {question.followupQuestions && question.followupQuestions.map((fQuestion, fIndex) => {
                      var correctTable = true;
                      if (question.type === Types.table && this.state.feedback[index]) {
                        this.state.feedback[index].forEach((row) => {
                          row.forEach((cellItem) => {
                            if (cellItem === "incorrect") {
                              correctTable = false;
                            }
                          });
                        });
                      }
                      return (
                        <div key={fIndex}>
                          {this.state.feedback[index] === "correct" || (Types.table === question.type && correctTable) && <ExerciseQuestion
                            question={fQuestion}
                            index={index}
                            feedback={this.state.followupFeedback[index] ? this.state.followupFeedback[index][fIndex] : null}
                            answer={this.state.followupAnswers}
                            renderCodeView={this.renderCodeView(fQuestion, index, fIndex)}
                            renderResponseView={this.renderResponseView(fQuestion, index, fIndex)}
                            renderFeedback={this.renderFeedback(fQuestion, index, fIndex)}
                            submitHandler={this.props.submitHandler}
                            fIndex={fIndex}
                          />}
                        </div>
                      );
                    })}
                  </Paper>
                );
            })
          }
        </div>

    );
  }
}

export default Information;
