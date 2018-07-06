import React, {Component} from 'react';

class Cell extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let styles = {
			backGroundColor: '#B2DFDB',
			border: 'solid',
			borderColor: '#00BCD4'
		};

		return(
				<div style={styles}>
				</div>
		);
	}
}

export default Cell;