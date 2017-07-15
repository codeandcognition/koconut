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
          <h3>Type your response here:</h3>
          {
            <div className="short-response-value">
              <textarea onChange={(event) => {
                this.setState({value: event.target.value});
              }}>
              </textarea>
              <p>{this.state.value}</p>
            </div>
          }
        </div>
    );
  }
}

export default ShortResponse;
