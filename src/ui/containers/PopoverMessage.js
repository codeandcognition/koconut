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
			open: false,
			changed: false
		}
	}
	handleClose() {
		this.setState({open: !this.props.toggleError});
	}

	/**
	 * Listens for a change in the props, mainly the error state and updates the
	 * state accordingly
	 *
	 * @param nextProps
	 */
	componentWillReceiveProps(nextProps) {
		this.setState({open: nextProps.toggleError});
	}

	render() {

		return(

				<Dialog
						open={this.state.open}
						aria-labelledby="Oops"
						aria-describedby="Sorry, there are no exercises available for this concept right now."
				>
					<DialogTitle>{"Oops"}</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Sorry, there are no exercises available for this concept right now.
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button color="primary" autoFocus>
							Close
						</Button>
					</DialogActions>
				</Dialog>

		);
	}
}

export default PopOver;