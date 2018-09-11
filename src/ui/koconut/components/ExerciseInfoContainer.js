import React, {Component} from 'react';
import QuestionContainer from './QuestionContainer';

type Props = {
	// firebase id
	// TODO: will need more
};

class ExerciseInfoContainer extends Component {
	constructor(props: Props) {
		super(props);
	}

	render() {
		return (
			<div>
				<p>Firebase ID</p>
				<QuestionContainer/>
				<br/>
				<QuestionContainer/>
			</div>
		);
	}
}

export default ExerciseInfoContainer;