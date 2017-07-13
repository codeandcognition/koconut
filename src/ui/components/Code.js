// @flow
import React, {Component} from 'react';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/clike/clike';

import Information from '../containers/Information';
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

  constructor(props: Props) {
    super(props);
    this.state = {
      code: this.props.code,
      lineNumbers: true,
      mode: 'text/x-java',
      theme: 'eclipse',
    };

    this.handleThemeChange = this.handleThemeChange.bind(this);
  }

  /**
   * Updates the theme state based on whether the input is checked or not
   * @param event - React Event for the checkbox
   */
  handleThemeChange(event: SyntheticInputEvent) {
    event.target.checked ? this.setState({theme: 'material'})
        : this.setState({theme: 'eclipse'});
  }

  /**
   * Returns JSX for the CodeMirror component with the current options stored
   * in state
   * @returns JSX for the CodeMirror component
   */
  renderCodeMirror() {
    let options = {
      lineNumbers: this.state.lineNumbers,
      readOnly: this.props.type !== 'WriteCode',
      mode: this.state.mode,
      theme: this.state.theme,
    };

    return <CodeMirror
        ref="editor"
        value={this.state.code}
        options={options}
        onChange={(e) => (this.setState({code: e}))}
    />;
  }

  // TODO: Figure out why setState won't update code content
  render() {
    let isInlineResponseType = Information.isInlineResponseType(
        this.props.type);
    return (
        <div className={'code ' + (isInlineResponseType ? 'full' : 'half')}>
          {this.renderCodeMirror()}
          <p>
            Toggle dark theme:
            <input type="checkbox" onChange={this.handleThemeChange}/>
            <input
                type="button"
                value="RESET!"
                onClick={() => (this.setState({code: this.props.code}))}
            />
          </p>

        </div>
    );
  }
}

export default Code;
