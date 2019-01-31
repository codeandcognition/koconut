import React, {Component} from 'react';

type Props = {
	content: string
};

class HintContainer extends Component {
	render() {
		let style = {
			padding: '0.5em',
			margin: '0.5em 2em 0.5em 2em',
			borderStyle: 'solid',
			borderWidth: '1px',
			borderRadius: '3px',
			backgroundColor: '#fff9c4',
			textAlign: 'left'
		};

		return(
				<div style={style}>
					<p style={{margin: '0'}}>{this.props.content ? this.props.content : "Hints are not available for this question :("}</p>
				</div>
		)
	}
}

export default HintContainer;