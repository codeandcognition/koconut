// @flow
import React, {Component} from 'react';
import './Prompt.css';

/**
 * The Prompt component contains the assessment prompt.
 * @class
 */
class Prompt extends Component {
  props: {
    content: string,
    type: string
  };

  render() {
    return (
        <div className="prompt">
          <h2>{this.props.content}
            {/* for debugging */}
            <span className="exercise-type">({this.props.type})</span>
          </h2>
        </div>
    );
  }
}

export default Prompt;
