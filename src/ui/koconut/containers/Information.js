// @flow
import React, {Component} from 'react';
import Code from '../components/Code';
import Response from './Response';
import Types from '../../../data/ExerciseTypes.js';
import Submit from '../components/Submit';
import Feedback from '../components/Feedback';
import Paper from '@material-ui/core/Paper';
import ReactMarkdown from 'react-markdown';

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
    submitOk: Function,
    submitTryAgain: Function,
    mode: string,
    toggleCodeTheme: Function,
    codeTheme: string,
    submitHandler: Function,
    timesGotQuestionWrong: number[],
    nextQuestion: Function,
    resetAnswer: Function,
    addGaveUp: Function
};
class Information extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      exercise: null,
      feedback: null,
      gaveUpCount: 0
    };
    this.addGaveUp = this.addGaveUp.bind(this);
  }

  componentWillMount() {
    this.setState({exercise: this.props.exercise, feedback: this.props.feedback, answer: this.props.answer});
  }

  componentWillReceiveProps(nextProps: any) {
    this.setState({exercise: nextProps.exercise, feedback: nextProps.feedback, answer: nextProps.answer});
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
  renderResponseView(question: any, index: number) {
      let type = question.type;

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
            answer={this.state.answer}
            questionIndex={index}
            question={question}
            updateHandler={this.props.updateHandler}
            feedback={this.state.feedback[index]}
            submitOk={this.props.submitOk}
            submitTryAgain={this.props.submitTryAgain}
            mode={this.props.mode}
            submitHandler={this.props.submitHandler}
            />
  }

  /**
   * Returns JSX for (or not for) the Feedback container given the current props
   * @param question question object in Exercise
   * @param index index of question in Exercise
   * @returns JSX for the Feedback container
   */
  renderFeedback(question: any, index: number) {
      if(this.state.feedback[index]) {
        return <Feedback
          feedback={this.state.feedback[index]}
          questionIndex={index}
          submitTryAgain={() => this.props.submitTryAgain(index)}
          type={question.type}
          question={this.state.exercise.questions[index]}
          timesGotSpecificQuestionWrong={this.props.timesGotQuestionWrong[index]}
          answer={this.state.answer}
          addGaveUp={this.addGaveUp}
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
    console.log(this.state.gaveUpCount);
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
              {
                this.state.exercise.questions.map((question, index) => {
                return (
                    <Paper elevation={6} style={{padding: "0"}} key={"information" + index} className={"information-with-submit"}>
                      <div className="information" style={{width: "100%", display: "flex", textAlign: "center", justifyContent: "space-between"}}>
                          {question.code && question.type !== Types.writeCode && this.renderCodeView(question, index)}
                          <div style={{width: "100%", margin: "0", padding: "0"}}>
                            <div style={{textAlign: "left", margin: "20px"}}>
                              <ReactMarkdown source={question.prompt || ""}>
                                {/* for debugging */}
                              </ReactMarkdown>
                            </div>
                            {this.renderResponseView(question, index)}
                            {!(this.state.feedback[index]) &&
                              <Submit submitHandler={() => this.props.submitHandler(this.state.answer, index, question.type)} />
                            }
                          </div>
                      </div>
                      {this.renderFeedback(question, index)}
                    </Paper>);
            })
          }
        </div>

    );
  }
}

export default Information;
