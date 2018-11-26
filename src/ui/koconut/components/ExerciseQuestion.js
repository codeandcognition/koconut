import React, {Component} from 'react';
import Types from '../../../data/ExerciseTypes.js';
import Submit from './Submit';
import AceEditor from 'react-ace';
// import "./CodeEditor.css";
import 'brace/mode/python';

type Props = {
	question: any,
	renderCodeView: Function,
	renderResponseView: Function,
	answer: any,
	submitHandler: Function,
};

class ExerciseQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      mode: 'python',
      theme: 'textmate'
    }

    this.renderAce = this.renderAce.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Updates state based on editor changes
   * @param value - the post-change content
   * @param event - an Ace change event
   */
  handleChange(value: string, event: Object) {
    // TODO: Actually prevent rows
    // TODO: Also, newlines and deletion isn't safe
    // console.log(event);
    // console.log('handlechange')
    
    // Data logger aspect of handling 
    let dl = this.props.dataLogger;
    let textPosition = this.refs.aceEditor.editor.getCursorPosition();
    let key;
    if(event.lines.length > 1 || event.lines[0].length > 1) {
      key = "PASTE";
    } else {
      key = event.lines[0];
    }
    dl.addData({
      event: "KEYBOARD",
      keyPressed: key,
      textContent: this.refs.aceEditor.editor.getValue(),
      textPosition
    })

    // set state of value
    if (event.start.row !== -1) {
      this.setState({code: value});
    } else {
      this.setState({code: this.state.code});
    }
  }

  renderAce() {
    return <AceEditor
        ref="aceEditor"
        className={"ace-editor"}
        width="12em"
        height="20em"
        value={this.state.code}
        // readOnly={this.props.type !== Types.fillBlank &&
        // this.props.type !== Types.writeCode && this.props.type !== Types.highlightCode}
        mode={this.state.mode}
        theme={this.state.theme}
        highlightActiveLine={true}
        // onInput={this.handleInput}
        // onCursorChange={this.handleCursorChange}
        onChange={this.handleChange}
        // onSelectionChange={this.handleSelect}
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
    />
  }

  componentDidMount() {
    let dl = this.props.dataLogger;
    if(this.refs.aceEditor) {
      let aceEditorTextInputEl = this.refs.aceEditor.editor.textInput.getElement(); 
      aceEditorTextInputEl.addEventListener('keydown', e => {
        let {key} = e;
        if(key === "ArrowLeft" || key === "ArrowRight" || key === "ArrowDown" || 
          key === "ArrowUp") {
          let textPosition = this.refs.aceEditor.editor.getCursorPosition();
          dl.addData({
            event: "KEYBOARD",
            keyPressed: key,
            textPosition
          })
        } 
      });
      
      this.refs.aceEditor.editor.addEventListener('click', e => {
        let textPosition = e.editor.getCursorPosition();
        dl.addData({
          event: "MOUSE",
          keyPressed: "LeftClick",
          textPosition
        })
      });
    } 
  }

  render() {

    return (
      <div>
        <div className="information" style={{width: "100%", display: "flex", textAlign: "center", justifyContent: "space-between"}}>
          {this.props.question.code && this.props.question.type !== Types.writeCode && this.props.renderCodeView(this.props.question, this.props.index, this.props.fIndex, this.renderAce)}
          <div style={{width: "100%", margin: "0", padding: "0"}}>
            {this.props.renderResponseView(this.props.question, this.props.index, this.props.fIndex)}
            {!(this.props.feedback) &&
            <Submit disabled={this.props.answer[this.props.index] === undefined}
										submitHandler={() => {
											this.props.dataLogger.sendDataToFirebase();
                      this.props.submitHandler(this.props.answer, this.props.index, this.props.question.type, this.props.fIndex);
                      // console.log(this.props.dataLogger.getData());
                    }} />
            }
          </div>
        </div>
        {this.props.renderFeedback}
      </div>
    );
  }

}

export default ExerciseQuestion;