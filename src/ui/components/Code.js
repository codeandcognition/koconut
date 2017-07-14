// @flow
import React, {Component} from 'react';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/clike/clike';
import 'codemirror/addon/selection/mark-selection';
import 'codemirror/addon/selection/active-line';

import Types from '../../backend/Types.js';
// Flow does not like it if you import css from node_modules!
import './codemirror/codemirror.css';
import './codemirror/eclipse.css';
import './codemirror/material.css';

const placeholder = '(*)';

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

  //TODO: Make indentation work
  /**
   * Returns JSX for the Code view
   * @returns JSX for the Code view
   */
  renderCode() {
    switch (this.props.type) {
      case('FillBlank'):
        let retJSX = [];

        // Iterate by line
        for (let line of this.props.code.split(/\r\n|\n\r|\n|\r/g)) {
          let splitLine = line.split(placeholder);
          let lineJSX = [];
          lineJSX.push(<div className="code-part">{splitLine.shift()}</div>);
          // Insert blanks between splits
          while (splitLine.length > 0) {
            lineJSX.push(<textarea className="code-fill"></textarea>);
            lineJSX.push(<div className="code-part">{splitLine.shift()}</div>);
          }
          retJSX.push(<div className="code-line">{lineJSX}</div>);
        }
        return retJSX;
      default:
        return this.props.code;
    }
  }

  componentDidMount() {
    this.editor = this.refs.editor;
  }

  handleThemeChange(event: SyntheticInputEvent) {
    event.target.checked ? this.setState({theme: 'material'}) :
        this.setState({theme: 'eclipse'});
  }

  handleSelect() {
    if (this.editor) {
      let e = this.editor;
      let select = e.codeMirror.doc.getSelection()
      this.setState({highlighted: select})
      console.log(this.state.highlighted);
    }
  }
  // EXPERIMENTAL!!
  renderCodeMirror() {
    let options = {
      lineNumbers: this.state.lineNumbers,
      readOnly: this.props.type !== Types.writeCode,
      mode: this.state.mode,
      theme: this.state.theme,
      styleSelectedText: true,
      styleActiveLine: true,
    };

    return <CodeMirror ref="editor" value={this.state.code} options={options} onCursorActivity={this.handleSelect}/>;
  }


  render() {
    let isInlineResponseType = Types.isInlineResponseType(this.props.type);
    return (
        <div className={'code ' + (isInlineResponseType ? 'full' : 'half')}>
          {this.renderCodeMirror()}
          <p>
            Toggle dark theme:
            <input type="checkbox" onChange={this.handleThemeChange}/>
          </p>
          <button onClick={this.handleSelect}>highlight</button>
        </div>
    );
  }
}

export default Code;
