
import React, {Component} from 'react';
import {ConceptKnowledge, MasteryModel} from '../../data/MasteryModel';
import {conceptInventory} from '../../data/ConceptMap.js';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ExpandMoreIcon from '@material-ui/icons/ChevronRight';
import ExpandedIcon from '@material-ui/icons/KeyboardArrowDown';

class ConceptCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			expand: false
		}
	}

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
			fontSize: "14px"
		}

		var titleStyle = {
			marginBottom: "0"
		}

		return(
				<Card>
					<CardContent>
						<div style={{display: 'flex'}}>
							{this.state.expand ?
							<ExpandedIcon style={{cursor: "pointer"}} onClick={evt => this.handleExpandClick()} /> :
              <ExpandMoreIcon style={{cursor: 'pointer'}} onClick={evt => this.handleExpandClick()}/>
							}
							<p style={titleStyle}>{this.props.title}</p>
						</div>
						{this.state.expand &&
								<div style={{paddingLeft: "5%"}}>
									<p style={linkStyle}>read instruction</p>
									<p style={linkStyle}>read practice</p>
									<p style={linkStyle}>write instruction</p>
									<p style={linkStyle}>write practice</p>
								</div>
						}
					</CardContent>
				</Card>
		);
	}
}

export default ConceptCard;