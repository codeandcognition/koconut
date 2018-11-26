import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import { Link, withRouter } from "react-router-dom";
import Routes from './../../../Routes';

class NcmeLandingView extends Component {
	render() {
		return(
				<div className={"container"}>
					<div>
						<p>Instructions on think aloud</p>
					</div>
					<div>
						<Link to={Routes.ncmeassessment}>
							<Button variant="contained"  color={"primary"} onClick={() => this.props.generateNCMEExercise()}>Start Study</Button>
						</Link>
					</div>
				</div>
		);
	}
}

export default NcmeLandingView;