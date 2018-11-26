// @flow
import React, {Component} from 'react';
import Code from '../components/Code';
import Response from './Response';
import Types from '../../../data/ExerciseTypes.js';
import Feedback from '../components/Feedback';
import Paper from '@material-ui/core/Paper';
import ExerciseQuestion from '../components/ExerciseQuestion';

 

import './Information.css';
import Button from "@material-ui/core/Button/Button";

/**
 * The Information container contains Code or both Code and Response.
 * @class
 */

type Props = {
    exercise: any,
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
  addGaveUp: Function;
  renderResponseView: Function;
  renderCodeView: Function;
  
  constructor(props: Props) {
    super(props);
    this.state = {
      exercise: null,
      feedback: null,
      followupFeedback: null,
      answer: null,
      followupAnswers: null,
      gaveUpCount: 0,
      gaveUpArr: [],
      mode: 'python',
      theme: 'textmate',
      code: ''
    };
    this.addGaveUp = this.addGaveUp.bind(this);
    this.renderResponseView = this.renderResponseView.bind(this);
    this.renderCodeView = this.renderCodeView.bind(this);
  }

  componentWillMount() {
    this.setState({
      exercise: this.props.exercise,
      feedback: this.props.feedback,
      followupFeedback: this.props.followupFeedback,
      answer: this.props.answer,
      followupAnswers: this.props.followupAnswers
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    this.props.dataLogger.updateType(nextProps.readOrWrite);
    this.setState({
      exercise: nextProps.exercise,
      feedback: nextProps.feedback,
      followupFeedback: this.props.followupFeedback,
      answer: nextProps.answer,
      followupAnswers: this.props.followupAnswers
    });
  }

  

  /**
   * Returns JSX for (or not for) the Code container given the current props
   * @param question question object in Exercise
   * @param index index of question in Exercise
   * @returns JSX for the Code container
   */
  renderCodeView(question: any, index: number, fIndex: number, renderAce: ?any) {
  	// questions of type multiple choice but code is undefined
  	let absentCode = question.type === Types.multipleChoice && !question.code;
  	// or if it is a table question
  	absentCode = absentCode || question.type === Types.table;
  	// or if it is a highlight code question
  	absentCode = absentCode || question.type === Types.highlightCode;
    this.codeviewrendered = true;
		if(Types.isSurvey(question.type) || absentCode) {
			return '';
		} else {
			return (
					<div style={{display: 'flex', justifyContent: 'space-evenly', backgroundColor: '#f7f7f7'}}>
						<Code
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
								fIndex={fIndex}
						/>
						<div style={{margin: '2%'}}>
							<h5>Scratch Pad</h5>
              {/** TODO: SCRATCHPAD SCRATCH PAD */}
							{/* <textarea style={{width: '12em', height: '20em', backgroundColor: '#FFF9C4'}}/> */}
              {renderAce && renderAce()}
						</div>
					</div>
			);
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
          ? <div/> :
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
            dataLogger={this.props.dataLogger}
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
        timesGotSpecificQuestionWrong={(fIndex === -1) ? this.props.timesGotQuestionWrong[index] : this.props.followupTimesGotQuestionWrong[index][fIndex]}
        answer={(fIndex === -1) ? this.state.answer : this.state.followupAnswers}
        addGaveUp={this.addGaveUp}
        fIndex={fIndex}
      />
    }
    return <div />
  }

  addGaveUp(questionIndex: number, fIndex: number) {
    let gaveUpArr = [];
    gaveUpArr[questionIndex] = true;
    this.setState({
      gaveUpCount: this.state.gaveUpCount + 1,
      gaveUpArr: fIndex === -1 ? gaveUpArr : this.state.gaveUpArr
    });
  }

  scrollToBottom() {
    window.setTimeout(() => {
      window.scroll({
        top: 5000,
        left: 0,
        behavior: "smooth"
      });
    }, 500);
    return true;
  }

  render() {

    // todo count correct correctly
    let correctCount = this.state.feedback.reduce((acc, item, index) => {
          if (this.state.exercise.questions[index].type === "checkboxQuestion" ||
              this.state.exercise.questions[index].type === "table") {
            return (item && item.toString().indexOf("incorrect") === -1 &&
            item.toString().indexOf("correct") !== -1) ? acc + 1 : acc;
          } else {
            return item === "correct" ? acc + 1 : acc;
          }
        }
    , 0);

    this.state.followupFeedback.forEach((feedback) => {
      let count = feedback && feedback.reduce((acc, item, index) => {
        if (this.state.exercise.questions[index].type === "checkboxQuestion" ||
            this.state.exercise.questions[index].type === "table") {
          return (item && item.toString().indexOf("incorrect") === -1 &&
              item.toString().indexOf("correct") !== -1) ? acc + 1 : acc;
        } else {
          return item === "correct" ? acc + 1 : acc;
        }
      }, 0);
      correctCount = correctCount + count;
    });

    correctCount = correctCount + this.state.gaveUpCount;

    let expectedCorrect = this.state.exercise.questions.length;
    this.state.exercise.questions.forEach((item) => {
      if (item.followupQuestions) {
        expectedCorrect = expectedCorrect + item.followupQuestions.length;
      }
    });

    return (
        <div ref={"information"}>
          {this.state.exercise.questions.map((question, index) => {
            return (
              <Paper elevation={6} style={{padding: "0"}} key={"information" + index} className={"information-with-submit"}>
                <ExerciseQuestion
                  key={index}
                  question={question}
                  nextQuestion={this.props.nextQuestion}
                  index={index}
                  feedback={this.state.feedback[index]}
                  answer={this.state.answer}
                  renderCodeView={this.renderCodeView}
                  renderResponseView={this.renderResponseView}
                  renderFeedback={this.renderFeedback(question, index, -1)}
                  submitHandler={this.props.submitHandler}
                  fIndex={-1}
                  dataLogger={this.props.dataLogger}
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
                  } else {
                    correctTable = false;
                  }
                  return (
                    <div key={fIndex}>
                      {(this.state.feedback[index] === "correct" || this.state.gaveUpArr[index] === true || (Types.table === question.type && correctTable)) &&
                        <ExerciseQuestion
                          question={fQuestion}
                          index={index}
                          feedback={this.state.followupFeedback[index] ? this.state.followupFeedback[index][fIndex] : null}
                          answer={this.state.followupAnswers}
                          renderCodeView={this.renderCodeView}
                          renderResponseView={this.renderResponseView}
                          renderFeedback={this.renderFeedback(fQuestion, index, fIndex)}
                          submitHandler={this.props.submitHandler}
                          dataLogger={this.props.dataLogger}
                          fIndex={fIndex}
                        />
                      }
                    </div>
                  );
                })}
              </Paper>
            );
            })
          }
          {correctCount >= expectedCorrect && this.scrollToBottom() &&
            <div className={"cont-btn-container"} >
              <Button variant={"outlined"} color={"primary"} onClick={() => {
                this.props.nextQuestion();
                this.props.resetAnswer();
                this.setState({
                  gaveUpCount: 0,
                  gaveUpArr: []
                });
              }}>Continue</Button>
            </div>
          }
        </div>

    );
  }
}

export default Information;
