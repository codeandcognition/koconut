// @flow
import React, {Component} from 'react';

/**
 * The ShortResponse component renders short response question type
 * @class
 */
class ShortResponse extends Component {
  state: {
    value: string
  };

  constructor() {
    super();
    this.state = {
      value: '',
    };
  }

  render() {
    return (
        <div className='short-response'>
          <h3>Submit your response here:</h3>
          {
            <div>
              <textarea onChange={(event) => {
                this.setState({value: event.target.value});
              }}>
              </textarea>
            </div>
          }
        </div>
    );
  }
}

export default ShortResponse;
