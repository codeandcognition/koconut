// @flow
import React, {Component} from 'react';
import './ShortResponse.css';
import CodeBlock from './CodeBlock';
import ReactMarkdown from 'react-markdown';

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
          <div style={{textAlign: "left"}}>
            <ReactMarkdown
                         source={this.props.prompt}
                         renderers={{CodeBlock: CodeBlock}}/>
          </div>
          <p>Type your response here:</p>
          {
            <div className="short-response-value">
              <textarea value={this.state.value} disabled={this.props.feedback ? true : false} onChange={(event) => {
                
                  this.setState({value: event.target.value});
                  this.props.inputHandler(event.target.value, this.props.questionIndex, this.props.fIndex);
                
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
