// @flow
import React, {Component} from 'react';
import './Submit.css';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from "@material-ui/core/Button/Button"; // for debugging button

/**
 * The Submit component represents a button to submit an answer
 * @class
 */
class Submit extends Component {
  Props: {
    submitHandler: Function,
    disabled: boolean
  };

  constructor(props) {
    super(props);
    this.state = {
      openDialog: false
    };
  }

  displayDialog() {
		return (
				<Dialog aria-labelledby="continue-pop-up" open={this.state.openDialog}>
					<DialogTitle id="simple-dialog-title">You're doing great!</DialogTitle>
					<Button onClick={() => {
					  this.setState({openDialog: false});
						this.props.submitHandler();
          }}
									variant={'outlined'}>Continue</Button>
				</Dialog>
    );
  }

  render() {
    return (
        <div className="submit-container">
          <button disabled={this.props.disabled}
                  className={"btn btn-submit click"}
                  onClick={() => {
										this.setState({openDialog: true});
                  }}>
            Submit
          </button>
          {this.state.openDialog && this.displayDialog()}
        </div>
    );
  }
}

export default Submit;
