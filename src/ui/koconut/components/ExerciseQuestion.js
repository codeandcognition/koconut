import React, {Component} from 'react';
import Types from '../../../data/ExerciseTypes.js';
import Submit from './Submit';
import HintButton from './Hint';
import AceEditor from 'react-ace';
import 'brace/mode/python';
import HintContainer from '../containers/HintContainer';
import ExerciseTypes from '../../../data/ExerciseTypes.js';

type Props = {
	question: any,
	renderCodeView: Function,
	renderResponseView: Function,
	answer: any,
	submitHandler: Function,
	hintRequestHandler: Function,
	prevQuestionAttemptCorrect: Boolean,
	exerciseId: string
};

class ExerciseQuestion extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      code: '',
      mode: 'python',
      theme: 'textmate',
			hintForIndex: -1,
			hintFor: null
    };

    this.renderAce = this.renderAce.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.hintRequestHandler = this.hintRequestHandler.bind(this);
	}
	
	componentDidUpdate(prevProps, prevState, snapshot){
		// on changing exercise
		if(prevProps.exerciseId && this.props.exerciseId && prevProps.exerciseId != this.props.exerciseId) {
			this.setState({
				code: '', // clear code editor

				// clear hints
				hintForIndex: -1,
				hintFor: null
			});
		}		
	}

   /**
   * Updates state based on editor changes
   * @param value - the post-change content
   * @param event - an Ace change event
   */
  handleChange(value: string, event: Object) {
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
        width="auto"
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
          showLineNumbers: false,
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

  hintRequestHandler() {
		let hintActive = this.state.hintFor;

		if (!hintActive) {
			// if table question
			if (this.props.question.data) {
				// if first time
				let target = 2;
				if (!this.props.feedback) {
					let table = this.props.answer[0];
					target = this.getQuestionNumber(table);
				} else {
					target = this.getQuestionNumber(this.props.feedback)
				}
				// do something to activate the hint!
				this.setState({
					hintForIndex: target,
					hintFor: this.props.question.data[target-1]
				});
			} else {
				this.setState({
					hintForIndex: -1,
					hintFor: this.props.question
				});
			}
		} else { // hint already set, so disable it
			this.setState({
				hintForIndex: -1,
				hintFor: null
			});
		}
	}

	/**
	 * getQuestionNumber returns the question for which the hint will be displayed
	 *
	 * @param table -- is the newly constructed answer array or the feedback array
	 * @returns {number}
	 */
	getQuestionNumber(table) {
		if (!table) {
			return 2;
		}
		let target = 0;
		for (let i = 0; i < table.length; i++) {
			for (let j = 0; j < table[i].length; j++) {
				target++;
				if (j !== 0 && (!table[i][j] || table[i][j] === "incorrect")) {
					return target
				}
			}
		}
	}

	renderHint() {
		return <HintContainer content={this.state.hintFor.hint}/>
	}

  render() {
		let disableSubmit = true;
		if (this.props.answer) {
			// determine whether submit should be disabled
			// to avoid evaluating incomplete answers
			let answer = this.props.answer[this.props.index];
			if (answer) {
				if (this.props.question.type === ExerciseTypes.table) {
					// count the number of answers expected
					let numAnswerCells = 0;
					this.props.question.data.forEach(cell => {
						if (!cell.prompt && !cell.code) {
							numAnswerCells++;
						}
					});

					// count the number of answers entered by user
					let count = 0;
					for (let i = 0; i < answer.length; i++) {
						if (answer[i]) {
							for (let j = 0; j < answer[i].length; j++) {
								if (answer[i][j]) {
									count++;
								}
							}
						}
					}
					disableSubmit = count < numAnswerCells;
				} else {
					disableSubmit = false;
				}
			}
		}
		
		let submitButtonText = this.props.feedback ? "Try Again" : "Submit";
    return (
      <div>
        <div className="information" style={{width: "100%", display: "flex", textAlign: "center", justifyContent: "space-between"}}>
          {this.props.question.code && this.props.question.type !== Types.writeCode && this.props.renderCodeView(this.props.question, this.props.index, this.props.fIndex, this.renderAce)}
          <div style={{width: "100%", margin: "0", padding: "0"}}>
            {this.props.renderResponseView(this.props.question, this.props.index, this.props.fIndex, this.state.hintForIndex)}
						<div style={{display: 'flex', justifyContent: 'space-between', margin: '0.5% 2% 0.5% 2%'}}>
							<div style={{display: 'flex'}}>
								<HintButton hintRequestHandler={this.hintRequestHandler} disableHint={false}/>
								{this.state.hintFor && this.renderHint()}
							</div>

							{this.props.feedback && this.props.feedback.length > 0 && this.props.prevQuestionAttemptCorrect==false?
								<p>Update your answer to try again!</p>
								:
								<Submit text={submitButtonText}
									disabled={disableSubmit}
									submitHandler={() => {
										window.scrollBy(0, 60); // scroll down a bit so people can see feedback. could improve: https://stackoverflow.com/a/51828976
										this.props.submitHandler(this.props.answer, this.props.index, this.props.question.type, this.props.fIndex)
									}
									}
								/>
							}
							</div>
          </div>
        </div>
        {this.props.renderFeedback}
      </div>
    );
  }

}

export default ExerciseQuestion;