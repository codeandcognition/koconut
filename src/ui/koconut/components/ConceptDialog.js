import React, {Component} from 'react';
import { Link} from "react-router-dom";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
// import './ConceptDialog.css'

type Props = {
	title: string,
	conceptKey: string,
	open: boolean,
	generateExercise: Function,
	getInstruction: Function
};

class ConceptDialog extends Component {
	constructor(props: Props) {
		super(props);
		this.state = {
			open: true
		}
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
		return (
				<Dialog open={this.state.open}>
					<DialogContent>
						<div className={'dialogHeader'}>
							<h2>{this.props.title}</h2>
							<i className="far fa-times-circle icon" onClick={() => this.handleClose()}/>
						</div>
						<p>
							Lorem ipsum dolor sit amet, no mucius lobortis definiebas vim, justo
							placerat liberavisse cu per. Errem delenit sit in, ut cum virtute
							tacimates, affert soleat eloquentiam id his. Eu sea elitr repudiare
							scripserit. Eos homero deseruisse id, sonet accumsan dignissim ex quo.
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

