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
    click: boolean
  };

  /**
   * Determines whether the submit button is clickable and returns JSX.
   * @returns {XML}
   */
  renderSubmitButton() {
    let click = this.props.click ? 'click' : 'no-click';
    let onclick = this.props.click ? this.props.submitHandler : (() => null);
    return (
        <div className={"btn btn-submit " + click} onClick={onclick}>
          Submit
        </div>);
  }

  render() {
    return (
        <div className="submit-container">
          {this.renderSubmitButton()}
        </div>
    );
  }
}

export default Submit;
