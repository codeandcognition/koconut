import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';

type Props = {
	title: string,
	percent: number,
	level: string
};

class Progress extends Component {
	constructor(props: Props) {
		super(props);
	}

	componentWillReceiveProps(nextProps: Props) {
		this.props = nextProps;
	}

	render() {
		let percent = "" + Math.round(this.props.percent) + "%";
		return(
				<Grid fluid>
					<Row>
						<Col md={6}>
							<p className={'bold-text'}>Reading {this.props.title}</p>
						</Col>
						<Col md={6}>
							<div class="progress">
								<div class="progress-bar bg-success"
										 role="progressbar"
										 style={{width: percent}}
										 aria-valuenow="25"
										 aria-valuemin="0"
										 aria-valuemax="100">{this.props.level}</div>
							</div>
						</Col>
					</Row>
				</Grid>
		);
	}
}

export default Progress;