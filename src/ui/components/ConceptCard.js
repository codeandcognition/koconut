
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

		var linkStyle = {
			textDecoration: "underline",
			fontWeight: "bold",
			cursor: "pointer",
			textIndent: "8px",
			margin: "3px",
			fontSize: "14px",
			display: "inline-block"
		}

		var titleStyle = {
			marginBottom: "0"
		}

		return(
				<Card>
					<CardContent>
						<div>
						<div style={{display: 'flex'}}>
							{this.state.expand ?
							<ExpandedIcon style={{cursor: "pointer"}} onClick={evt => this.handleExpandClick()} /> :
              <ExpandMoreIcon style={{cursor: 'pointer'}} onClick={evt => this.handleExpandClick()}/>
							}
							<p style={titleStyle}>{this.props.title}</p>
						</div>
						{this.state.expand &&
								<div style={{paddingLeft: "5%"}}>
									<p style={linkStyle}
										 onClick={this.props.generateExercise(this.props.concept, this.exerciseType.read)}>read instruction</p>
									<br />
									<p style={linkStyle}
										 onClick={this.props.generateExercise(this.props.concept, this.exerciseType.read)}>read practice</p>
									<br />
									<p style={linkStyle}
										 onClick={this.props.generateExercise(this.props.concept, this.exerciseType.write)}>write instruction</p>
									<br />
									<p style={linkStyle}
										 onClick={this.props.generateExercise(this.props.concept, this.exerciseType.write)}>write practice</p>
								</div>
						}
						</div>
					</CardContent>
				</Card>
		);
	}
}

export default ConceptCard;