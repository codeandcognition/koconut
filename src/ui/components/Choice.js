// @flow
import React, {Component} from 'react';

/**
 * The Choice component represents a choice in a multiple choice question
 * @class
 */
class Choice extends Component {
  props: {
    content: string
  };

  render() {
    return (
        <div className='choice'>
          {this.props.content}
        </div>
    );
  }
}

export default Choice;
