import React, {Component} from 'react';
import ExerciseQuestion from './ExerciseQuestion';
import Response from './../containers/Response';
import Types from '../../../data/ExerciseTypes';
import Code from './Code';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';

type Props = {
	question: any,
	answer: any,
	renderCodeView: Function,
};

class QuestionContainer extends Component {
	renderResponseView: Function;
	renderCodeView: Function;

	constructor(props) {
		super(props);
		this.renderResponseView = this.renderResponseView.bind(this);
		this.renderCodeView = this.renderCodeView.bind(this);
	}

	/**
	 * Returns JSX for (or not for) the Response container given the current props
	 * @param question question object in Exercise
	 * @param index index of question in Exercise
	 * @returns JSX for the Response container
	 */
	renderResponseView(question: any, index: number, fIndex: number) {
		let type = question.type;
		let parentFeedback = [];
		let followupFeedback = [];
		let feedback = fIndex === -1 ? parentFeedback : followupFeedback;

		return Types.isInlineResponseType(type) && type !== Types.writeCode ? <div/> :
				<Response
						key={"response"+index}
						type={type}
						choices={question.choices}
						answer={type === "memoryTable" ? {placeholder: -1} : [[], []]}
						questionIndex={0}
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
   * Returns JSX for (or not for) the Code container given the current props
   * @param question question object in Exercise
   * @param index index of question in Exercise
   * @returns JSX for the Code container
   */
  renderCodeView(question: any, index: number, fIndex: number) {
    // questions of type multiple choice but code is undefined
    let absentCode = question.type === Types.multipleChoice && !question.code;
    // or if it is a table question
    absentCode = absentCode || question.type === Types.table;
    // or if it is a highlight code question
    absentCode = absentCode || question.type === Types.highlightCode;
    if(Types.isSurvey(question.type) || absentCode) {
      return '';
    } else {
      return (
          <div style={{display: 'flex', justifyContent: 'space-evenly', backgroundColor: '#f7f7f7'}}>
            <Code
                key={"code" + index}
                type={question.type}
                code={question.code}
                feedback={[]}
                questionIndex={index}
                fIndex={fIndex}

            />
          </div>
      );
    }
  }

	render() {
		let answer = [];
		if (this.props.question.type === "table") {
			this.props.question.data.forEach((cell, index) => {
				if (cell.type !== "") {
					answer.push(<p key={index}>{cell.answer}</p>);
				}
			});
		} else if (this.props.question.type === "memoryTable") {
			answer = JSON.stringify(this.props.question.answer);
		} else {
			answer = this.props.question.answer;
		}

		let containerStyle = {
			borderTop: "2px black solid",
			padding: "20px"
		}

		let code = "";
		if (this.props.question.type === "writeCode") {
      code = "```python\n" + answer + "\n```";
		}

		return(
				<div style={containerStyle}>
					<ExerciseQuestion question={this.props.question}
														renderCodeView={this.renderCodeView}
														renderResponseView={this.renderResponseView}
														feedback={this.props.feedback}
														answer={this.props.question.answer}/>
					<br />
					<p><span style={{fontWeight: "bold"}}>Answer:</span> {this.props.question.type !== "writeCode" && answer}</p>
					{this.props.question.type === "writeCode" &&

						<ReactMarkdown
								source={code}
								renderers={{code: CodeBlock}}
						/>
					}
				</div>
		);
	}
}

export default QuestionContainer;