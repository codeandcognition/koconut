// @flow
import React, {Component} from 'react';
import './Submit.css';

/**
 * The Submit component represents a button to submit an answer
 * @class
 */
class Submit extends Component {
  props: {
    submitHandler: Function
  };

  render() {
    return (
        <div className="submit-container">
          <div className="btn btn-submit" onClick={this.props.submitHandler}>
           Submit
          </div>
        </div>
    );
  }
}

export default Submit;
