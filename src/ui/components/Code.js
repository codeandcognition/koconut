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

type Props = { type: string, code: string };

/**
 * The Code component contains the code view in the assessment problem
 * @class
 */
class Code extends Component {
  // Binding: https://github.com/facebook/flow/issues/1397
  handleThemeChange: Function;
  handleSelect: Function;
  editor: Object;

  constructor(props: Props) {
    super(props);
    this.state = {
      code: this.props.code,
      lineNumbers: true,
      mode: 'text/x-java',
      theme: 'eclipse',
    };

    this.handleThemeChange = this.handleThemeChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  /**
   * When component renders, store CodeMirror reference for later use.
   */
  componentDidMount() {
    this.editor = this.refs.editor;
  }

  /**
   * Handles the dark/light checkbox toggle event.
   * @param event
   */
  handleThemeChange(event: SyntheticInputEvent) {
    this.setState(
        event.target.checked ? ({theme: 'material'}: { theme: 'eclipse' }));
  }

  /**
   * Stores highlighted text from text area in component state: highlighted.
   */
  handleSelect() {
    if (this.editor) {
      let e = this.editor;
      let select = e.codeMirror.doc.getSelection();
      this.setState({highlighted: select});
      console.log(select);
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
      readOnly: this.props.type === Types.highlightCode,
      mode: this.state.mode,
      theme: this.state.theme,
      styleSelectedText: true,
      // styleActiveLine: true, TODO: Determine when to use active line
    };

    return <CodeMirror
        ref="editor"
        value={this.state.code}
        options={options}
        onChange={(e) => this.setState({code: e})}
        onCursorActivity={this.handleSelect}
    />;
  }

  render() {
    let isInlineResponseType = Types.isInlineResponseType(this.props.type);
    return (
        <div className={'code ' + (isInlineResponseType ? 'full' : 'half')}>
          {this.renderCodeMirror()}
          <p>
            Toggle dark theme:
            <input type="checkbox" onChange={this.handleThemeChange}/>
            <input type="button" value="RESET!"
                   onClick={() => (this.setState({code: this.props.code}))}
            />
          </p>
        </div>
    );
  }
}

export default Code;
