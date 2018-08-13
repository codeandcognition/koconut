
import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ExpandMoreIcon from '@material-ui/icons/ChevronRight';
import ExpandedIcon from '@material-ui/icons/KeyboardArrowDown';

type Props = {
	title: String,
	key: number,
	concept: String,
	generateExercise: Function
}

const exerciseType = {
	read: "READ",
	write: "WRITE"
}

class ConceptCard extends Component {

	constructor(props: Props) {
		super(props);
		this.handleExpandClick = this.handleExpandClick.bind(this);

		this.state = {
			expand: false
		}
	}

	/**
	 * Toggles the state of a concept card between open and closed
	 */
	handleExpandClick() {
		this.setState({expand: !this.state.expand});
	}

	render() {
		let linkStyle = {
			textDecoration: "underline",
			fontWeight: "bold",
			cursor: "pointer",
			textIndent: "8px",
			margin: "3px",
			fontSize: "14px",
			display: "inline-block"
		}

		let titleStyle = {
			marginBottom: "0"
		}

		return(
				<Card style={{margin: '2%'}}>
					<CardContent aria-expanded={this.state.expand}>
						<div>
						<div style={{display: 'flex', cursor: "pointer"}} onClick={this.handleExpandClick}><a>
							{this.state.expand ?
							<ExpandedIcon /> :
              <ExpandMoreIcon />
							}</a>
							<p style={titleStyle}>{this.props.title}</p>
						</div>
						{this.state.expand &&
								<div style={{paddingLeft: "5%", display: 'flex'}}>
									<div>
										<a style={linkStyle}
											 onClick={() => this.props.getInstruction(this.props.concept, exerciseType.read)}>Learn to read code</a>
										<br />
										<a style={linkStyle}
											 onClick={() => this.props.generateExercise(this.props.concept, exerciseType.read)}>Practice reading code</a>
										<br />
									</div>
									<div>
										<a style={linkStyle}
											 onClick={() => this.props.getInstruction(this.props.concept, exerciseType.write)}>Learn to write code</a>
										<br />
										<a style={linkStyle}
											 onClick={() => this.props.generateExercise(this.props.concept, exerciseType.write)}>Practice writing code</a>
									</div>
								</div>
						}
						</div>
					</CardContent>
				</Card>
		);
	}
}

export default ConceptCard;