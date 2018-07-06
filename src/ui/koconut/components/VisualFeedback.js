// @flow
import React, {Component} from 'react';

import './VisualFeedback.css';

/**
 * Component that displays a feedback modal after user submits an answer.
 * @class
 */

type Props = {feedback: boolean};

class VisualFeedback extends Component {
  renderFeedback: Function;

  constructor(props: Props) {
    super(props);
    this.renderFeedback = this.renderFeedback.bind(this);
  }

  /**
   * Renders check mark or "x" depending on the feedback.
   * @returns JSX
   */
  renderFeedback() {
    return this.props.feedback === "correct" ? <div className="correct"/>
        : ( <div className="incorrect-container">
              <div className="incorrect"/>
              <div className="incorrect-2"/>
            </div>  );
  }

  render() {
    return (
        <div className="visual-feedback">
          {this.renderFeedback()}
        </div>
    )
  }
}

export default VisualFeedback;
