// @flow
import React, {Component} from 'react';
import './Submit.css';

type Props = {
	hintRequestHandler: Function,
  disableHint: boolean
};

/**
 * Component displays a hint at code editor's last cursor position.
 */
class Hint extends Component {

  render() {
    return (
        <div className={"submit-container"}>
					<button className={"btn btn-submit click"} disabled={this.props.disableHint} onClick={() => {
						this.props.hintRequestHandler()
					}}>
						Get Hint
					</button>
        </div>
    );
  }
}

export default Hint;
