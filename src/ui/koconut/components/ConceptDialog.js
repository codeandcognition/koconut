import React, {Component} from 'react';
import { Link} from "react-router-dom";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import './ConceptDialog.css';
import ConceptInventory from './../../../data/ConceptMap';

type Props = {
	title: string,
	conceptCode: string,
	open: boolean,
	generateExercise: Function,
	getInstruction: Function
};

class ConceptDialog extends Component {
	constructor(props: Props) {
		super(props);
		this.state = {
			open: true
		};
		this.handleClose = this.handleClose.bind(this);
	}

	componentWillReceiveProps(props: Props) {
		this.setState({
			open: props.open
		})
	}

	handleClose() {
		this.setState({
			open: false
		});
	}

	render() {
		console.log(ConceptInventory[this.props.conceptCode], ConceptInventory[this.props.conceptCode].explanations.definition)
		return (
				<Dialog open={this.state.open} onClose={this.handleClose}>
					<DialogContent>
						<div className={'dialogHeader'}>
							<h2>{this.props.title}</h2>
							<i className="far fa-times-circle icon" onClick={() => this.handleClose()}/>
						</div>
						<p>
							{ConceptInventory[this.props.conceptCode].explanations.definition}
						</p>
						<div>
							<Button color={"primary"} variant={'outlined'} className={'link'}>Learn</Button>
							<br/>
							<Button color={"primary"} variant={'outlined'} className={'link'}>Practice</Button>
						</div>
					</DialogContent>
				</Dialog>
		);
	}
}

export default ConceptDialog;

