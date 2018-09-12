import React, {Component} from 'react';
import QuestionContainer from './QuestionContainer';
import type {Exercise} from '../../../data/Exercises';

type Props = {
	firebaseID: string,
	quadrant: string,
	exercise: Exercise,
	renderCodeView: Function,
};

class ExerciseInfoContainer extends Component {
	constructor(props: Props) {
		super(props);
	}

	render() {
		let questionList = [];
		this.props.exercise.questions.forEach((question, index) => {
			questionList.push(
					<QuestionContainer key={index}
														 question={question}
														 renderCodeView={this.props.renderCodeView}
														 answer={question.answer}
														 feedback={[]}/>
			);
			// to account for followup questions
			if (question.followupQuestions) {
				question.followupQuestions.forEach((q, i) => {
					questionList.push(
							<QuestionContainer key={index + " " + i}
																 question={q}
																 renderCodeView={this.props.renderCodeView}
																 answer={q.answer}
																 feedback={[]}/>
					);
				})
			}
		});
		return (
			<div>
				<p>Exercise ID</p>
				<p>{this.props.firebaseID}</p>
				{questionList}
			</div>
		);
	}
}

export default ExerciseInfoContainer;