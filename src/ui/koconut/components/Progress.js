import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';

type Props = {
	title: string,
	percent: number
};

const NOVICE_MAX = 40
const INTERMEDIATE_MAX = 60
const ADVANCED_MAX = 85

class Progress extends Component {
	componentWillReceiveProps(nextProps: Props) {
		this.props = nextProps;
	}

	render() {
		let percent = Math.round(this.props.percent * 100);
		let level = "";
		if (percent > 0 && percent <= NOVICE_MAX) {
			level = "novice";
		} else if (percent > NOVICE_MAX && percent <= INTERMEDIATE_MAX) {
			level = "intermediate";
		} else if (percent > INTERMEDIATE_MAX && percent <= ADVANCED_MAX) {
			level = "advanced";
		} else {
			level = "expert";
		}


		return (
			<Grid fluid>
				<Row>
					<Col md={6}>
						<div className="progress" style={{ height: 25 }}>
							<div className="progress-bar"
								role="progressbar"
								style={{
									width: percent + "%",
									color: 'black',
									backgroundColor: 'rgb(130,183,79)',
									fontSize: '15'
								}}
								aria-valuenow="25"
								aria-valuemin="0"
								aria-valuemax="100">{percent >= 30 && level}</div>
							{percent < 30 &&
								<div className="progress-bar"
									style={{
										color: 'black',
										background: 'none',
										fontSize: '15'
									}}
								>
									{level}
								</div>
							}
						</div>
					</Col>
				</Row>
			</Grid>
		);
	}
}

export default Progress;