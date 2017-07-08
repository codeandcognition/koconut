// @flow
import React, {Component} from 'react';

/**
 * The Question component contains the assessment prompt.
 * @class
 */
class Question extends Component {
  props: {
    content: string
  };

  render() {
    return (
        <div className="question">
          <h2>{this.props.content}</h2>
        </div>
    );
  }
}

export default Question;
