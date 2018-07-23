// @flow

import React, {Component} from 'react';
import AceEditor from 'react-ace';
//import ace from 'brace';

// Ace language support
import 'brace/mode/java';

// Ace themes
import 'brace/theme/eclipse';
import 'brace/theme/solarized_dark';

// Tool imports
import Types from '../../../data/ExerciseTypes.js';

// Component imports

import ReactMarkdown from 'react-markdown';

// CSS for Code component
import './Code.css';
import CodeBlock from './CodeBlock';

// Ace Range datatype
// const { Range } = ace.acequire('ace/range');

type Props = {
  type: string,
  code: string,
  updateHandler?: Function //optional
};

/**
 * The Code component contains the code view in the assessment problem
 * @class
 */
class Code extends Component {
  // Binding: https://github.com/facebook/flow/issues/1397
  code: Object;

  state: {
    code: string,
    lineNumbers: boolean,
    mode: string,
    theme: string,
    highlighted: string,
    toggle: boolean,
    hint: boolean,
    curLine: number
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      code: this.props.code,
      lineNumbers: true,
      mode: 'java',
      theme: this.props.codeTheme,
      highlighted: '',
      toggle: true,
      hint: false,
      curLine: 0,
    };
  }

  /**
   * When component renders, set cursor to (0, 0)
   */
  componentDidMount() {
    if (this.props.updateHandler !== undefined)
      this.props.updateHandler(this.state.code);
  }

  /**
   * Updates the code state when a new code prop is received
   * @param nextProps - the new prop object being received
   */
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.code !== this.props.code) {
      this.setState({
        code: nextProps.code,
      });
    }
  }

  renderMarkdown() {
    let code = "```java\n" + this.state.code + "\n```";
    return <ReactMarkdown className={"flex-grow-1"}
                          source={code}
                          renderers={{code: CodeBlock}}
                          escapeHtml={true}
    />
  }

  render() {
  	// don't render the reset button for a highlightCode exercise
    let isWriteType = Types.isInlineResponseType(this.props.type);
    let reset = isWriteType && this.props.type !== Types.highlightCode ?
        <input type="button" value="reset code" onClick={this.handleReset}/> :
        '';

    // let hint = this.state.hint;
    // let curLine = this.state.curLine;

    return (
        <div className={'codeContainer ' + (isWriteType ? 'full' : 'half') +
        ' ' + this.props.type}>
          <h4 style={{fontWeight: "bold", textAlign: "left"}}>Code</h4>
          {(isWriteType && this.props.feedback) ?
            '' :
              <div ref="code"
                   className={'code ' + (isWriteType ? 'full' : 'half') +
                   ' ' + this.props.type}>
                {!isWriteType && this.renderMarkdown()}
                <div className="code-config">
                  {/* <button onClick={this.handleHintRequest}>?</button> */}
                  {reset}
                </div>

                {/* {hint ? <Hint content="//TODO: Place hint here."
                              pos={curLine}
                              close={() => this.setState({hint: false})}/> : ''} */}
              </div>
          }
        </div>
    );
  }
}

export default Code;
