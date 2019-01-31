// @flow
import React, {Component} from 'react';
import './Submit.css';

/**
 * The Submit component represents a button to submit an answer
 * @class
 */
class Submit extends Component {
  props: {
    submitHandler: Function,
    disabled: boolean,
    text: string
  };

  render() {
    return (
        <div className="submit-container">
          <button disabled={this.props.disabled}
                  className={"btn btn-submit click"}
                  onClick={this.props.submitHandler}>
            {this.props.text}
          </button>
        </div>
    );
  }
}

export default Submit;
