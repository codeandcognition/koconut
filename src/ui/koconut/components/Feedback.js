// @flow
import React, {Component} from 'react';
import VisualFeedback from './VisualFeedback';

import './Feedback.css';


/**
 * Component that displays a feedback modal after user submits an answer.
 * @class
 */

// type Props = {feedback: boolean, submitHandler: Function};

class Feedback extends Component {
  constructor() {
    super();
    this.state = {
      gaveUp: false
    }
  }
  showFeedbackMessage(type: string, timeswrong: any, feedback: any, gotCorrect: string) {
    if(type === "multipleChoice") {
      let answer = this.props.answer[this.props.questionIndex];
      return <div>{feedback[answer]}</div>
    } else {
      if(gotCorrect === "correct") {
        return <div>{feedback ? feedback.correct : ''}</div>
      } else {
        if(feedback && feedback.incorrect && timeswrong > feedback.incorrect.length) {
          return <div>{feedback.incorrect[feedback.incorrect.length - 1]}</div>
        } else {
          return <div>{feedback && feedback.incorrect && feedback.incorrect[timeswrong-1]}</div>
        }
      }
    }
  }
  
  showAnswer() {
    let finalstring = "";
    let answer = this.props.question.answer;
    if (this.props.type === "checkboxQuestion") {
      for(let i = 0; i < answer.length; i++) {
        if(i < answer.length - 1) {
          finalstring = finalstring + answer[i] + ", ";
        } else {
          finalstring = finalstring + answer[i];
        }
      }
    } else if(this.props.type === "table") {
      let cells = this.props.question.data;
      for(let i = 0; i < cells.length; i++) {
        if(cells[i].answer !== "") {
          if(i < cells.length - 1) {
            finalstring = finalstring + cells[i].answer + ", ";
          } else {
            finalstring = finalstring + cells[i].answer;
          }
        }
      }
    } else {
      finalstring = answer;
    }
    return <div>The answer is <span style={{color: "green"}}>{finalstring}</span></div>
  }

  render() {
    let gotCorrect = "correct";
    if(this.props.type === "table") {
      this.props.feedback.forEach((d) => {
        d.forEach((e) => {
          if(e === "incorrect") {
            gotCorrect = "incorrect";
          }
        })
      })
    } else {
      gotCorrect = this.props.feedback;
    }

    return (
      <div className="feedback">
        <div className="feedback-correctness">
          <p>Your answer was: {gotCorrect}</p>
        </div>
        <VisualFeedback feedback={gotCorrect}/>
        {this.showFeedbackMessage(this.props.type, this.props.timesGotSpecificQuestionWrong, this.props.question.feedback, gotCorrect)}
        {this.state.gaveUp &&
          this.showAnswer()
        }
        <div className="feedback-ok">
          {(gotCorrect === "correct" || this.state.gaveUp) && <button onClick={this.props.submitOk}>Continue</button>}
          {gotCorrect !== "correct" && !this.state.gaveUp &&
            <div><button onClick={this.props.submitTryAgain}>Try Again</button>
              
                <button onClick={() => {
                  this.setState({gaveUp: true});
                }}>Show answer</button>
              
            </div>
          }
          
        </div>
      </div>
    )
  }
}

export default Feedback;