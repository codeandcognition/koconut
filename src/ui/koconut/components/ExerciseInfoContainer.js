import React, {Component} from 'react';
import QuestionContainer from './QuestionContainer';
import type {Exercise} from '../../../data/Exercises';

type Props = {
	firebaseID: string,
	quadrant: string,
	exercise: Exercise,
	renderCodeView: Function,
	renderResponseView: Function
};

class ExerciseInfoContainer extends Component {
	constructor(props: Props) {
		super(props);
	}

	render() {
		return (
			<div>
				<p>Firebase ID</p>
				<p>Quadrant</p>
				<QuestionContainer/>
				<br/>
				<QuestionContainer/>
			</div>
		);
	}
}

export default ExerciseInfoContainer;