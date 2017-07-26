// @flow

import React, {Component} from 'react';
import AceEditor from 'react-ace';

// Ace language support
import 'brace/mode/java';

// Ace themes
import 'brace/theme/eclipse';
import 'brace/theme/solarized_dark';

// Tool imports
import Types from '../../data/ExerciseTypes.js'

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
   * When component renders, set cursor to (0, 0)
   */
  componentDidMount() {
    this.resetCursor();
    
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
    this.refs.aceEditor.editor.moveCursorTo(0, 0);
    this.refs.aceEditor.editor.clearSelection();
  }


  /**
   * Handles the dark/light checkbox toggle event.
   */
  handleThemeChange() {
    this.setState({
      toggle: !this.state.toggle,
      theme: (this.state.toggle ? 'solarized_dark' : 'eclipse'),
    });
  }

  /**
   * Stores highlighted text from text area in component state: highlighted.
   */
  handleSelect(e: any /* need to make Flow play nicely */) {
    let selected = this.refs.aceEditor.editor.session.getTextRange(e.getRange());
    this.setState( {highlighted: selected} );
    // this check mitigates a bug caused by spam switching exercises
    if(this.props.updateHandler !== undefined) {
      this.props.updateHandler(this.state.highlighted);
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
    let ace = this.refs.aceEditor.editor;
    let line = ace.getCursorPosition().row; // Get line of cursor position

    this.setState({hint: true});
    this.setState({curLine: line});
  }

  /**
   *  Renders Ace with preferred options.
   *  Handles editable/non-editable state for code view.
   *  @returns JSX for the CodeMirror component
   */
  renderAce() {
    return <AceEditor
        ref="aceEditor"
        width="100%"
        height="20em"
        value={this.state.code}
        readOnly={this.props.type !== Types.fillBlank &&
        this.props.type !== Types.writeCode}
        mode={this.state.mode}
        theme={this.state.theme}
        highlightActiveLine={true}
        onChange={(e) => {
          this.setState({code: e});
          if (this.props.updateHandler !== undefined) {
            this.props.updateHandler(this.props.type !== Types.highlightCode
                ? this.state.code
                : this.state.highlighted);
          }
        }}
        onSelectionChange={this.props.type === Types.highlightCode
            ? this.handleSelect
            : undefined}
        setOptions={{
          showLineNumbers: true,
          tabSize: 2,
        }}
        minLines={6}
    />;
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
          {this.renderAce()}
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
