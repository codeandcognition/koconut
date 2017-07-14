// @flow
import React, {Component} from 'react';
import MultipleChoice from './MultipleChoice';
import ShortResponse from './ShortResponse';

/**
 * The Response component contains the response section in the assessment problem
 * @class
 */
class Response extends Component {
  props: {
    type: string,
    answers?: string[],
    selected: ?string,
    updateHandler: Function
  };

  /**
   * Returns JSX based on the response type
   * @returns JSX for a type of response (MultipleChoice, ShortResponse)
   */
  renderResponse() {
    switch(this.props.type) {
      case('MultipleChoice'):
        return <MultipleChoice
                answers={this.props.answers}
                selected={this.props.selected}
                handleClick={this.props.updateHandler}
              />;
      case('ShortResponse'):
        return <ShortResponse />;
      default:
        return <div className="BAD">Not a valid question type :(</div>;
    }
  }

  render() {
    return (
        <div className='response'>
          {this.renderResponse()}
        </div>
    );
  }
}

export default Response;
