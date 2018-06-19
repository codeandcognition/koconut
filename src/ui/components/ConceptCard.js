
import React, {Component} from 'react';
import {ConceptKnowledge, MasteryModel} from '../../data/MasteryModel';
import {conceptInventory} from '../../data/ConceptMap.js';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ExpandMoreIcon from '@material-ui/icons/ChevronRight';

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
		return(
				<Card>
					<CardContent>
						<div style={{display: 'flex'}}>
							<ExpandMoreIcon style={{cursor: 'pointer'}} onClick={evt => this.handleExpandClick()}/>
							<p>{this.props.title}</p>
						</div>
						{this.state.expand &&
								<div style={{paddingLeft: "5%"}}>
									<p>Read instruction</p>
									<p>Read practice</p>
									<p>Write instruction</p>
									<p>Write practice</p>
								</div>
						}
					</CardContent>
				</Card>
		);
	}
}

export default ConceptCard;