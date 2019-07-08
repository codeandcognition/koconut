import React, {Component} from 'react';
import './ExerciseButton.css'

// type Props = {
// 	concept: string,
// 	exerciseType: string,
// 	exercise: any,
// 	exerciseId: number,
// 	index: number,
// 	numberOfExercises: number,
// 	read: boolean,
// 	recommendation: string,
// 	showRecommendation: boolean,
// 	goToExercise: Function
// };

class ExerciseButton extends Component {
	render() {
		return (
				<button className={'exerciseButton'}
								onClick={() => this.props.goToExercise(this.props.concept,
										this.props.exerciseType, this.props.exercise,
										this.props.exerciseId, this.props.index, this.props.numberOfExercises)}>
					{this.props.exercise.shortPrompt}
				</button>
		);
	}
}

export default ExerciseButton;