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
    content: string,
    type: string
  };

  render() {
    return (
        <div className="prompt">
          <ReactMarkdown source={this.props.content}>
            {/* for debugging */}
            <span className="exercise-type">({this.props.type})</span>
          </ReactMarkdown>
        </div>
    );
  }
}

export default Prompt;
