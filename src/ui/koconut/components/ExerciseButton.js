import React, {Component} from 'react';
import Button from '@material-ui/core/Button';

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
				<Button variant={'contained'}
								className={'resume'}>Practice</Button>
		);
	}
}

export default ExerciseButton;