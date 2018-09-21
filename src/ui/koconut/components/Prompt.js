// @flow
import React, {Component} from 'react';
import ReactMarkdown from 'react-markdown';
import './Prompt.css';

/**
 * The Prompt component contains the assessment prompt.
 * @class
 */
class Prompt extends Component {
  props: {
    exercise: any
  };

  render() {
    return (
        <div className="prompt">
          <ReactMarkdown source={this.props.exercise.prompt ? this.props.exercise.prompt : ""}>
            {/* for debugging */}
          </ReactMarkdown>
        </div>
    );
  }
}

export default Prompt;
