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

  // TODO: Document all these functions

  componentDidMount() {
    this.editor = this.refs.editor;
    if (this.props.updateHandler !== undefined)
      this.props.updateHandler(this.state.code);
  }

  handleThemeChange(event: SyntheticInputEvent) {
    event.target.checked ? this.setState({theme: 'material'}) : this.setState(
        {theme: 'eclipse'});
  }

  handleSelect() {
    if (this.editor) {
      let e = this.editor;
      let select = e.codeMirror.doc.getSelection();
      this.setState({highlighted: select});
      console.log(this.state.highlighted);
    }
  }

  renderCodeMirror() {
    let options = {
      lineNumbers: this.state.lineNumbers,
      readOnly: this.props.type !== Types.writeCode,
      mode: this.state.mode,
      theme: this.state.theme,
      styleSelectedText: true,
      styleActiveLine: true,
    };

    return <CodeMirror
        ref="editor"
        value={this.state.code}
        options={options}
        onChange={(e) => {
          this.setState({code: e});
          if (this.props.updateHandler !== undefined)
            this.props.updateHandler(this.state.code);
        }}
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
            <input
                type="button"
                value="RESET!"
                onClick={() => (this.setState({code: this.props.code}))}
            />
          </p>
          <button onClick={this.handleSelect}>highlight</button>
        </div>
    );
  }
}

export default Code;
