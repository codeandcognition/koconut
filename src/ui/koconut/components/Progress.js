import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';

type Props = {
	title: string,
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
		let level = "";
		if (percent > 0 && percent <= 40) {
			level = "novice";
		} else if (percent > 40 && percent <= 60) {
			level = "intermediate";
		} else if (percent > 60 && percent <= 85) {
			level = "advanced";
		} else {
			level = "expert";
		}


		return(
				<Grid fluid>
					<Row>
						<Col md={6}>
							<p className={'bold-text'}>Reading {this.props.title}</p>
						</Col>
						<Col md={6}>
							<div className="progress" style={{height: 25}}>
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