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

  render() {
    return (
        <div className="submit-container">
          <div className={"btn btn-submit " + (this.props.click ?
              'click' : 'no-click')}
               onClick={this.props.click ? this.props.submitHandler
                   : (()=>null)}> {/*Return null if cannot click*/}
            Submit
          </div>
        </div>
    );
  }
}

export default Submit;
