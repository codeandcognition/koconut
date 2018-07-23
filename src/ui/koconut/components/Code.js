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
      this.resetCursor();
    }
  }

  /**
   * Resets the cursor position to (0, 0)
   */
  resetCursor() {
    if(this.refs.aceEditor) {
      this.refs.aceEditor.editor.moveCursorTo(0, 0);
      this.refs.aceEditor.editor.clearSelection();

    }
  }

  /**
   * Handles the dark/light checkbox toggle event.
   *
   * TODO UNUSED
   */
  handleThemeChange() {
    this.setState({
      toggle: !this.state.toggle,
      theme: (this.state.toggle ? 'solarized_dark' : 'eclipse'),
    }, () => {
      this.props.toggleCodeTheme(this.state.theme);
    });
  }

  /**
   * Stores highlighted text from text area in component state: highlighted.
   */
  handleSelect(e: any /* need to make Flow play nicely */) {
    let selected = this.refs.aceEditor.editor.session.getTextRange(
        e.getRange());
    this.setState({highlighted: selected});
    // this check mitigates a bug caused by spam switching exercises
    if (this.props.updateHandler !== undefined) {
      this.props.updateHandler(selected, this.props.questionIndex); // William summer 2018
    }
  }

  /**
   *  Resets both the code state and answer state.
   */
  handleReset() {
    this.setState({code: this.props.code});
    this.props.updateHandler(this.props.code);
    this.resetCursor();
  }

  /**
   * Sets hint position to the line of the last cursor position within Ace.
   * TODO: Fix positioning
   */
  handleHintRequest() {
    // TODO: stub function, rework entirely, maybe remove

    // let ace = this.refs.aceEditor.editor;
    // let line = ace.getCursorPosition().row; // Get line of cursor position
    //
    // this.setState({hint: true});
    // this.setState({curLine: line});
  }

  /**
   * Updates state based on editor changes
   * @param value - the post-change content
   * @param event - an Ace change event
   */
  handleChange(value: string, event: Object) {
    // TODO: Actually prevent rows
    // TODO: Also, newlines and deletion isn't safe
    if(event.start.row !== -1) {
      this.setState({code: value});
      if (this.props.updateHandler !== undefined) { // wow such type safety
        // submit code or highlighted code
        this.props.updateHandler(value, this.props.questionIndex); // William Summer 2018 // shift-ctrl-f note in case fix doesn't work
      }
    } else {
      this.setState({code: this.state.code});
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
