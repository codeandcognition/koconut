import React, {Component} from 'react';
import Types from '../../../data/ExerciseTypes';
import AceEditor from 'react-ace';
import Button from '@material-ui/core/Button';
import "./CodeEditor.css";
import ReactMarkdown from 'react-markdown';
import CodeBlock from'./CodeBlock';

class CodeEditor extends Component {
  handleSelect: Function;
  handleChange: Function;
  handleThemeChange: Function;
  handleSelect: Function;
  handleReset: Function;
  handleHintRequest: Function;
  handleChange: Function;
  code: Object;
  toggle: boolean;

  state: {
    code: string,
    mode: string,
    theme: string,
    toggle: false,
    highlighted: string
  };

  constructor(props) {
    super(props);

    this.state = {
      mode: 'python',
      theme: 'textmate',
      code: this.props.code,
      highlighted: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
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
    if (event.start.row !== -1) {
      this.setState({code: value}, () => {
				if (this.props.inputHandler !== undefined) { // wow such type safety
					// submit code or highlighted code
					this.props.inputHandler(value, this.props.questionIndex, this.props.fIndex); // William Summer 2018 // shift-ctrl-f note in case fix doesn't work
				}
      });
    } else {
      this.setState({code: this.state.code});
    }
  }

  /**
   * Stores highlighted text from text area in component state: highlighted.
   */
  handleSelect(e: any /* need to make Flow play nicely */) {
    let selected = this.refs.aceEditor.editor.session.getTextRange(
        e.getRange());
    selected = selected.trimEnd();
    selected = selected.trimStart();
    this.setState({highlighted: selected}, () => {
			// this check mitigates a bug caused by spam switching exercises
			if (this.props.inputHandler !== undefined) {
				this.props.inputHandler(selected, this.props.questionIndex, this.props.fIndex); // William summer 2018
			}
    });
  }

  /**
   *  Renders Ace with preferred options.
   *  Handles editable/non-editable state for code view.
   */
  renderAce() {
    return <AceEditor
        ref="aceEditor"
        className={"ace-editor"}
        width="100%"
        height="20em"
        value={this.state.code}
        readOnly={this.props.type !== Types.fillBlank &&
        this.props.type !== Types.writeCode && this.props.type !== Types.highlightCode}
        mode={this.state.mode}
        theme={this.state.theme}
        highlightActiveLine={true}
        onChange={this.handleChange}
        onSelectionChange={this.props.type === Types.highlightCode
            ? this.handleSelect
            : undefined}
        setOptions={{
          showLineNumbers: true,
          tabSize: 2,
        }}
        minLines={6}
        editorProps={{
          $blockScrolling: Infinity,
        }}
        markers={[//TODO: Remove me :O
          {
            startRow: 0,
            startCol: 0,
            endRow: 100,
            endCol: 100,
            className: 'box',
            type: 'background'
          }
        ]}
        /* https://github.com/securingsincity/react-ace/issues/29#issuecomment-296398653 */
    />;
  }

  /**
   *  Resets both the code state and answer state.
   */
  handleReset() {
    console.log(this.props.code);
    this.setState({code: this.props.code});
    this.props.inputHandler(this.props.code, this.props.questionIndex);
    this.resetCursor();
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

  render() {
    return(
        <div style={{textAlign: "left"}}>
          <ReactMarkdown className={"flex-grow-1"}
                         source={this.props.prompt}
                         renderers={{CodeBlock: CodeBlock}}/>
          {this.renderAce()}
          {this.props.type === Types.highlightCode && <p className={"answer-preview"}>Your answer: {this.state.highlighted}</p>}
          <div className={"button-container"}>
            <Button variant={"contained"} color={"secondary"} onClick={() => this.handleReset()}><i
                className="fas fa-sync-alt" /></Button>
          </div>
        </div>
    );
  }

}

export default CodeEditor;