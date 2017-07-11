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
      case('FillBlank'):
        return <div />;
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
    // TODO: Other question types!
  }
}

export default Response;
