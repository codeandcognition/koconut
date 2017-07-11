// @flow
import React, {Component} from 'react';

/**
 * The WriteCode component renders the response panel to allow writing code
 * @class
 */
class WriteCode extends Component {
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
        <div className='write-code'>
          <h1>Hi</h1>
        </div>
    );
  }
}

export default WriteCode;
