// @flow
import React, {Component} from 'react';

/**
 * The Question component contains the assessment prompt.
 * @class
 */
class Question extends Component {
  props: {
    type:string;
  };

  render() {
    return (
        <div className="question">
          <h2>{/*Question goes here*/}</h2>
        </div>
    );
  }
}

export default Question;
