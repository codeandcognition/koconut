// @flow
import React, {Component} from 'react';
import Button from '@material-ui/core/Button/Button';
// import VisualFeedback from './VisualFeedback';

import './Feedback.css';
import CodeBlock from './CodeBlock';
import ReactMarkdown from 'react-markdown';


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

  renderMarkdown(codeData: string) {
    let code = "```python\n" + codeData + "\n```";
    return <ReactMarkdown className={"flex-grow-1"}
                          source={code}
                          renderers={{code: CodeBlock}}
                          escapeHtml={true}
    />
  }

  showFeedbackMessage(type: string, timeswrong: any, feedback: any, correctness: string) {
    if(type === "multipleChoice") {
      let answer = this.props.answer[this.props.questionIndex];
      return <div>{feedback[answer]}</div>
    } else {
      if(correctness.pass) {
        return <div>{feedback && feedback.correct}</div>
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
    let finalString = "";
    let answer = this.props.question.answer;
    if (this.props.type === "checkboxQuestion") {
      for(let i = 0; i < answer.length; i++) {
        if(i < answer.length - 1) {
          finalString = finalString + answer[i] + ", ";
        } else {
          finalString = finalString + answer[i];
        }
      }
    } else if(this.props.type === "table") {
      let cells = this.props.question.data;
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].answer !== "") {
          if (i < cells.length - 1) {
            finalString = finalString + cells[i].answer + ", ";
          } else {
            finalString = finalString + cells[i].answer;
          }
        }
      }
    } else if (this.props.type === "writeCode") {
      finalString = this.renderMarkdown(answer);
    } else {
      finalString = answer;
    }
    return (
      <div style={{display: "inline"}}>
        <strong>The correct answer is:&nbsp;
            <span style={{color: "green"}}>
              {
                this.props.type === "memoryTable" ? this.displayMemoryTableOutput(finalString) : finalString
              }
            </span>
            {(this.props.type !== "writeCode" && this.props.type !== 'memoryTable') && "."}
        </strong>
      </div>
    );
  }

  displayMemoryTableOutput(finalString: any) {
    let list = [];
    Object.keys(finalString).forEach((variable, index) => {
      let values = finalString[variable];
      let output = variable + ":";
      if (values) {
        values.forEach(val => {
          output += "\t" + val;
        });
      }
      list.push(<p key={index}>{output}</p>)
    });
    return (<div>{list}</div>);
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

    let correctBool = this.props.feedback.pass;
    return (
      <div style={{width: "100%", textAlign: "left"}} className="feedback">
        <h4 style={{fontWeight: "bold", textAlign: "left"}}>Feedback</h4>
        <div className="feedback-correctness">
          <p>{!correctBool && "Not quite!"}{correctBool && "Well done!"}</p>
          {(correctBool || this.state.gaveUp) && this.showAnswer()}
        </div>
        {/* <VisualFeedback feedback={gotCorrect}/> */}
        <div style={{width: "100%", textAlign: "left"}}>
        {this.showFeedbackMessage(this.props.type, this.props.timesGotSpecificQuestionWrong, this.props.question.feedback, gotCorrect)}
        </div>
        <div className="feedback-ok">
          {!correctBool && !this.state.gaveUp &&
            <div style={{display: "flex", justifyContent: "flex-end"}}>
              {/* Note: to retry after an imperfect submission, learners don't have to hit try again */}
              {/*<Button color={"primary"} variant="outlined" onClick={this.props.submitTryAgain}>
                  Try Again</Button>*/}
              
                <Button style={{marginLeft: "10px"}} variant="outlined" onClick={() => {
                  this.props.addGaveUp(this.props.questionIndex, this.props.fIndex);
                  this.setState({gaveUp: true});
                }} color={"secondary"}>Show answer</Button>
              
            </div>
          }
          
        </div>
      </div>
    )
  }
}

export default Feedback;