import React, {Component} from 'react';
import { withRouter} from "react-router-dom";

class AllExercises extends Component {
	render() {
		return (
				<div className={"container"}>
					Display All exercises here
				</div>
		);
	}
}

export default withRouter(AllExercises);