// @flow
import React, {Component} from 'react';

/**
 * The ShortResponse component renders short response question type
 * @class
 */
type Props = {
  inputHandler: Function
}

class ShortResponse extends Component {
  state: {
    value: string
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  // TODO: fix bug where
  render() {
    return (
        <div className='short-response'>
          <h3>Type your response here:</h3>
          {
            <div className="short-response-value">
              <textarea onChange={(event) => {
                this.setState({value: event.target.value});
                this.props.inputHandler(this.state.value);
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
