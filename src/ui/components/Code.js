// @flow
import React, {Component} from 'react';
// CodeMirror bug isn't fixed on main branch yet, so we'll use this package...
// for now: https://github.com/JedWatson/react-codemirror/pull/107
import CodeMirror from '@skidding/react-codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/clike/clike';
import 'codemirror/addon/selection/mark-selection';
import 'codemirror/addon/selection/active-line';

import Types from '../../backend/Types.js';
// Flow does not like it if you import css from node_modules!
import './codemirror/codemirror.css';
import './codemirror/eclipse.css';
import './codemirror/material.css';

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
  editor: Object;

  state: {
    code: string,
    lineNumbers: boolean,
    mode: string,
    theme: string,
    highlighted: string
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
    };

    this.handleThemeChange = this.handleThemeChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  /**
   * When component renders, store CodeMirror reference for later use.
   */
  componentDidMount() {
    this.editor = this.refs.editor;
    if (this.props.updateHandler !== undefined)
      this.props.updateHandler(this.state.code);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.code !== this.props.code) {
      this.setState({
        code: nextProps.code,
      });
    }
  }

  /**
   * Handles the dark/light checkbox toggle event.
   * @param event
   */
  handleThemeChange(event: SyntheticInputEvent) {
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
      let e = this.editor;
      let select = e.codeMirror.doc.getSelection();
      this.setState({highlighted: select});
      if (this.props.updateHandler !== undefined) {
        this.props.updateHandler(this.state.highlighted);
      }
      console.log(this.state.highlighted);
    }
  }

  /**
   *  Renders CodeMirror with preferred options.
   *  Handles editable/non-editable state for code view.
   * @returns {JSX/HTML}
   */
  renderCodeMirror() {
    let options = {
      lineNumbers: this.state.lineNumbers,
      readOnly: this.props.type !== Types.fillBlank &&
                this.props.type !== Types.writeCode,
      mode: this.state.mode,
      theme: this.state.theme,
      styleSelectedText: true,
      // styleActiveLine: true, TODO: Determine when to use active line
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

  render() {
    let isInlineResponseType = Types.isInlineResponseType(this.props.type);
    let reset = isInlineResponseType ? <input type="button" value="RESET!"
                                              onClick={this.handleReset}/> : '';
    return (
        <div className={'code ' + (isInlineResponseType ? 'full' : 'half')}>
          <div className="code-config">
            {/*Dark theme:
            <input type="checkbox" onChange={this.handleThemeChange}/>*/}
            <button onClick={this.handleThemeChange}>
              {this.state.toggle ? 'dark theme' : 'light theme'}
            </button>
            <input type="button" value="reset code"
                   onClick={() => (this.setState({code: this.props.code}))}
            />
          </div>
          {this.renderCodeMirror()}
        </div>
    );
  }
}

export default Code;
