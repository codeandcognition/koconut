// @flow

import React, {Component} from 'react';

// CodeMirror bug isn't fixed on main branch yet, so we'll use this package...
// for now: https://github.com/JedWatson/react-codemirror/pull/107
import CodeMirror from '@skidding/react-codemirror';

// CodeMirror language support
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/clike/clike';

// CodeMirror add-ons
import 'codemirror/addon/selection/mark-selection';

// Flow does not like it if you import css from node_modules!
// CodeMirror localized themes
import './codemirror/codemirror.css';
import './codemirror/eclipse.css';
import './codemirror/material.css';

// Tool imports
import Types from '../../backend/Types.js'

// Component imports
import Hint from './Hint.js';

// CSS for Code component
import './Code.css';

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
  handleThemeChange: Function;
  handleSelect: Function;
  handleReset: Function;
  handleHintRequest: Function;
  editor: Object;
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
      mode: 'text/x-java',
      theme: 'eclipse',
      highlighted: '',
      toggle: true,
      hint: true,
      curLine: 0,
    };

    this.handleThemeChange = this.handleThemeChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleHintRequest = this.handleHintRequest.bind(this);
  }

  /**
   * When component renders, store CodeMirror reference for later use.
   */
  componentDidMount() {
    this.editor = this.refs.editor;
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

  /**
   * Handles the dark/light checkbox toggle event.
   */
  handleThemeChange() {
    this.setState({
      toggle: !this.state.toggle,
      theme: (this.state.toggle ? 'material' : 'eclipse'),
    });
  }

  /**
   * Stores highlighted text from text area in component state: highlighted.
   */
  handleSelect() {
    if (this.editor) {
      this.setState({highlighted: this.editor.codeMirror.doc.getSelection()});
      if (this.props.updateHandler !== undefined) {
        this.props.updateHandler(this.state.highlighted);
      }
    }
  }

  /**
   *  Renders CodeMirror with preferred options.
   *  Handles editable/non-editable state for code view.
   *  @returns JSX for the CodeMirror component
   */
  renderCodeMirror() {
    let options = {
      lineNumbers: this.state.lineNumbers,
      readOnly: this.props.type !== Types.fillBlank &&
      this.props.type !== Types.writeCode,
      mode: this.state.mode,
      theme: this.state.theme,
      styleSelectedText: true,
    };

    return <CodeMirror
        ref="editor"
        value={this.state.code}
        options={options}
        onChange={(e) => {
          this.setState({code: e});
          if (this.props.updateHandler !== undefined) {
            this.props.updateHandler(this.props.type !== Types.highlightCode
                ? this.state.code
                : this.state.highlighted);
          }
        }}
        onCursorActivity={this.props.type === Types.highlightCode
            ? this.handleSelect
            : undefined}
    />;
  }

  /**
   *  Resets both the code state and selected state.
   */
  handleReset() {
    this.setState({code: this.props.code});
    this.props.updateHandler(this.props.code);
  }

  /**
   * Sets hint position to the line of the last cursor position within CodeMirror.
   */
  handleHintRequest() {
    let height = 0;
    if (this.editor) {
      let cm = this.editor.codeMirror;
      let line = cm.doc.getCursor(); // Get line of cursor position
      height = cm.heightAtLine(line.line, 'local'); // Find height at line

      this.setState({hint: true});
      this.setState({curLine: height});
    }
  }

  render() {
    let isInlineResponseType = Types.isInlineResponseType(this.props.type);
    let reset = isInlineResponseType ? <input type="button" value="reset code"
                                              onClick={this.handleReset}/> : '';

    let hint = this.state.hint;
    let curLine = this.state.curLine;

    return (
        <div ref="code"
             className={'code ' + (isInlineResponseType ? 'full' : 'half') +
             ' ' + this.props.type}>
          {this.renderCodeMirror()}
          <div className="code-config">
            <button onClick={this.handleHintRequest}>?</button>
            <button onClick={this.handleThemeChange}>
              {this.state.toggle ? 'dark theme' : 'light theme'}
            </button>
            {reset}
          </div>

          { hint ? <Hint active={this.state.hint}
                         content="//TODO: Place hint here."
                         pos={curLine}
                         close={() => this.setState({hint: false})}/> : '' }
        </div>
    );
  }
}

export default Code;
