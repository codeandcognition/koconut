import React, {Component} from 'react';

type Props = {
	percent: number
};

class Progress extends Component {
	constructor(props: Props) {
		super(props);
	}

	componentWillReceiveProps(nextProps: Props) {
		this.props = nextProps;
	}

	render() {
		let percent = Math.round(this.props.percent);
		return(
				<div className="progress" style={{height: "20px"}}>
					<div className="progress-bar bg-success" role="progressbar" style={{width: "25%"}}
							 aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"/>
				</div>
		);
	}
}

export default Progress;