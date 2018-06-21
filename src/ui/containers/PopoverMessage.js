import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


class PopOver extends Component {
	constructor(props) {
		super(props);
		// this.handleClose = this.handleClose.bind(this);
		this.state = {
			open: true,
			dialogText: this.props.errorMessage
		}
	}
	handleClose() {
		this.setState({open: !this.state.open});
	}

	/**
	 * Listens for a change in the props, mainly the error state and updates the
	 * state accordingly
	 *
	 * @param nextProps
	 */
	componentWillReceiveProps(nextProps) {
		this.setState({
			open: nextProps.toggleError,
			dialogText: nextProps.errorMessage
		});
	}

	render() {

		return(

				<Dialog
						open={this.state.open}
						aria-labelledby="Oops"
						aria-describedby={this.state.dialogText}
				>
					<DialogTitle>{"Oops"}</DialogTitle>
					<DialogContent>
						<DialogContentText>
							{this.state.dialogText}
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => this.handleClose()}
										color="primary" autoFocus>
							Close
						</Button>
					</DialogActions>
				</Dialog>

		);
	}
}

export default PopOver;