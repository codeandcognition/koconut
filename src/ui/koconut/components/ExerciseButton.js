import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import './ExerciseButton.css'

type Props = {
	text: string,
	read: boolean,
	recommendation: string,
	showRecommendation: boolean
};

class ExerciseButton extends Component {
	constructor(props: Props) {
		super(props);
	}

	render() {
		return (
				<button className={'exerciseButton'}>{this.props.text}</button>
		);
	}
}

export default ExerciseButton;