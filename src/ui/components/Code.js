// @flow
import React, {Component} from 'react';
import CodeMirror from 'react-codemirror';
import '../../../node_modules/codemirror/mode/javascript/javascript';
import '../../../node_modules/codemirror/mode/clike/clike';
import '../../../node_modules/codemirror/mode/python/python';

import Information from '../containers/Information';
import '../../../node_modules/codemirror/lib/codemirror.css';
import '../../../node_modules/codemirror/theme/solarized.css';
import '../../../node_modules/codemirror/theme/cobalt.css';

const placeholder = '(*)';

type Props = { type: string, code: string };
/**
 * The Code component contains the code view in the assessment problem
 * @class
 */
class Code extends Component {

  constructor(props: Props) {
    super(props);
    this.state = {
      code: this.props.code,
      lineNumbers: true,
      mode: 'clike',
      theme: 'solarized'
    };

    this.changeTheme = this.changeTheme.bind(this);
  }

  //TODO: Make indentation work
  /**
   * Returns JSX for the Code view
   * @returns JSX for the Code view
   */
  renderCode() {
    switch(this.props.type) {
      case('FillBlank'):
        let retJSX = [];

        // Iterate by line
        for(let line of this.props.code.split(/\r\n|\n\r|\n|\r/g)) {
          let splitLine = line.split(placeholder);
          let lineJSX = [];
          lineJSX.push(<div className="code-part">{splitLine.shift()}</div>);
          // Insert blanks between splits
          while(splitLine.length > 0) {
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

  changeTheme(event) {
    this.setState({
      theme: event.target.value
    });
  }
  // EXPERIMENTAL!!
  renderCodeMirror() {
    let options = {
      lineNumbers: this.state.lineNumbers,
      readOnly: this.props.type !== 'WriteCode',
      mode: this.state.mode,
      theme: this.state.theme
    };

    return <CodeMirror ref="editor" value={this.state.code} options={options}/>
  }

  render() {
    let isInlineResponseType = Information.isInlineResponseType(
        this.props.type);
    return (
        <div className={'code ' + (isInlineResponseType ? 'full' : 'half')}>
          {this.renderCodeMirror()}
          <p>Select a theme:
            <select onChange={this.changeTheme} id="select">
              <option selected>solaris</option>
              <option>cobalt</option>
            </select>
          </p>
        </div>
    );
  }
}

export default Code;
