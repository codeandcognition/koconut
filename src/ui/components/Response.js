// @flow
import React, {Component} from 'react';
import MultipleChoice from './MultipleChoice';
//TODO: import ShortResponse from './ShortResponse';

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

  render() {
    return (
        <div className='response '>
          {
            this.props.type === 'MultipleChoice' ?
                <MultipleChoice
                    answers={this.props.answers}
                    selected={this.props.selected}
                    handleClick={this.props.updateHandler}
                /> : ''
            //TODO: <ShortResponse />
          }
        </div>
    );
  }
}

export default Response;
