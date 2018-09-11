import React, {Component} from 'react';

type Props = {
	key: number,
	index: number,
	fIndex: number,
	quadrant: string,
	question: any,
	answer: any,
	renderCodeView: Function,
	renderResponseView: Function
};

class QuestionContainer extends Component {
	render() {
		return(
				<div>
					<p>Exercise Question</p>
					<p>Answer</p>
				</div>
		);
	}
}

export default QuestionContainer;