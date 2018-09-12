import React, {Component} from 'react';
import ExerciseQuestion from './ExerciseQuestion';
import Response from './../containers/Response';
import Types from '../../../data/ExerciseTypes';

type Props = {
	question: any,
	answer: any,
	renderCodeView: Function,
};

class QuestionContainer extends Component {
	renderResponseView: Function;

	constructor(props) {
		super(props);
		this.renderResponseView = this.renderResponseView.bind(this);
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

		return(
				<div>
					<ExerciseQuestion question={this.props.question}
														renderCodeView={this.props.renderCodeView}
														renderResponseView={this.renderResponseView}
														feedback={this.props.feedback}
														answer={this.props.question.answer}/>
					<p>Answer</p>
					<div>{answer}</div>
				</div>
		);
	}
}

export default QuestionContainer;