import React, {Component} from 'react';
import ConceptNetwork from './ConceptNetwork';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import NativeSelect from '@material-ui/core/NativeSelect';
import Button from '@material-ui/core/Button/Button';

class ConceptEditorView extends Component {
	constructor(props) {
		super(props);
	}

	newConceptCard() {
		return (
				<Card>
					<CardContent>
						<p>Add all dependencies</p>
						<NativeSelect>

						</NativeSelect>
					</CardContent>
				</Card>
		);
	}

	render() {
		let buttonStyle = {
			margin: '5px'
		};

		return(
				<Paper>
					<ConceptNetwork/>
					<Button style={buttonStyle} variant={'contained'}>Add new concept</Button>
				</Paper>
		);
	}
}

export default ConceptEditorView;