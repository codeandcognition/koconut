
import React, {Component} from 'react';
import {ConceptKnowledge, MasteryModel} from '../../data/MasteryModel';
import {conceptInventory} from '../../data/ConceptMap.js';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ExpandMoreIcon from '@material-ui/icons/ChevronRight';
import ExpandedIcon from '@material-ui/icons/KeyboardArrowDown';

type Props = {
	title: String,
	key: number
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
						<div style={{display: 'flex', cursor: "pointer"}} onClick={evt => this.handleExpandClick()}>
							{this.state.expand ?
							<ExpandedIcon /> :
              <ExpandMoreIcon />
							}
							<p style={titleStyle}>{this.props.title}</p>
						</div>
						{this.state.expand &&
								<div style={{paddingLeft: "5%"}}>
									<p style={linkStyle}>read instruction</p>
									<br />
									<p style={linkStyle}>read practice</p>
									<br />
									<p style={linkStyle}>write instruction</p>
									<br />
									<p style={linkStyle}>write practice</p>
								</div>
						}
						</div>
					</CardContent>
				</Card>
		);
	}
}

export default ConceptCard;