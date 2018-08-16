
import React, {Component} from 'react';
import { Link} from "react-router-dom";
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
					<CardContent>
						<div>
						<div style={{display: 'flex', cursor: "pointer"}} onClick={this.handleExpandClick}>
							{this.state.expand ?
							<ExpandedIcon /> :
              <ExpandMoreIcon />
							}
							<p style={titleStyle}>{this.props.title}</p>
						</div>
						{this.state.expand &&
								<div style={{paddingLeft: "5%", display: 'flex'}}>
									<div>
										<Link to={`/instruction/${this.props.concept}/learn-to-read-code`}>
											<p style={linkStyle}
												 onClick={() => this.props.getInstruction(this.props.concept, exerciseType.read)}>Learn to read code</p>
										</Link>
										<br />
										<Link to={`/practice/${this.props.concept}/practice-reading-code`}>
											<p style={linkStyle}
												 onClick={() => this.props.generateExercise(this.props.concept, exerciseType.read)}>Practice reading code</p>
										</Link>
										<br />
									</div>
									<div>
										<Link to={`/instruction/${this.props.concept}/learn-to-write-code`}>
											<p style={linkStyle}
												 onClick={() => this.props.getInstruction(this.props.concept, exerciseType.write)}>Learn to write code</p>
										</Link>
										<br />
										<Link to={`/practice/${this.props.concept}/practice-writing-code`}>
											<p style={linkStyle}
												 onClick={() => this.props.generateExercise(this.props.concept, exerciseType.write)}>Practice writing code</p>
										</Link>
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