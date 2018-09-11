import React, {Component} from 'react';
import { withRouter} from "react-router-dom";
import firebase from 'firebase';

class AllExercises extends Component {
	constructor(props) {
		super(props);

		this.state = {
			allExercises: []
		}
	}

	componentDidMount() {
		this.getAllExercises();
	}

	getAllExercises() {
	  let componentRef = this;
		let databaseRef = firebase.database().ref("Exercises");
		databaseRef.on("value", function(snapshot) {
		  let exercises = snapshot.val();
			componentRef.setState({
				allExercises: exercises
			});
		});
	}


	render() {
		return (
				<div className={"container"}>
					Display All exercises here
				</div>
		);
	}
}

export default withRouter(AllExercises);