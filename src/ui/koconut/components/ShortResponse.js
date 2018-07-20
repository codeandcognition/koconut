// @flow
import React, {Component} from 'react';
import './ShortResponse.css';

type Props = {
  inputHandler: Function
}

/**
 * The ShortResponse component renders short response exercise type
 * @class
 */
class  ShortResponse extends Component {
  state: {
    value: string
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  render() {
    return (
        <div className='short-response'>
          <h5>Type your response here:</h5>
          {
            <div className="short-response-value">
              <textarea value={this.state.value} disabled={this.props.feedback ? true : false} onChange={(event) => {
                
                  this.setState({value: event.target.value});
                  this.props.inputHandler(event.target.value, this.props.questionIndex);
                
              }}>
              </textarea>
              {/* <p>{this.state.value}</p> */}
            </div>
          }
        </div>
    );
  }
}

export default ShortResponse;
