import React, {Component} from 'react';
import { withRouter} from "react-router-dom";

import ExerciseInfoContainer from './../components/ExerciseInfoContainer';

class AllExercises extends Component {
	render() {
		return (
				<div className={"container"}>
					Display All exercises here
					<ExerciseInfoContainer/>
					<br/>
					<ExerciseInfoContainer/>
				</div>
		);
	}
}

export default withRouter(AllExercises);