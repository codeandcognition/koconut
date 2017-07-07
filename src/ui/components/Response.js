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
    answers: string[]
  };

  render() {
    return (
        <div className='response '>
          {
            this.props.type === 'MultipleChoice' ?
                <MultipleChoice answers={this.props.answers}/> : ''
            //TODO: <ShortResponse />
          }
        </div>
    );
  }
}

export default Response;
