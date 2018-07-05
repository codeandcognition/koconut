import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import Button from '@material-ui/core/Button/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import {ConceptKnowledge, MasteryModel} from '../../data/MasteryModel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class Question extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentQuestion: {
				prompt: "",
				code: "",
				index: 0,
				difficulty: -1,
				choices: [],
				type: "",
				answer: "",
				hint: "",
				feedback: "",
				followupPrompt: "",
				followupQuestions: []
			},
			currentChoice: '',
			currentAnswer: '',
			currentQuestionFormat: 'standAlone'
		}
	}

	QuestionTypes = {
		survey: 'survey',
		writeCode: 'writeCode',
		fillBlank: 'fillBlank',
		highlightCode: 'highlightCode',
		multipleChoice: 'multipleChoice',
		shortResponse: 'shortResponse',
		memoryTable: 'memoryTable'
	};

	Difficulty = {
		low: 0,
		med: 1,
		high: 2
	};

	componentWillReceiveProps(nextProps) {
		console.log("in here");
		let question = {
					prompt: "",
					code: "",
					index: 0,
					difficulty: -1,
					choices: [],
					type: "",
					answer: "",
					hint: "",
					feedback: "",
					followupPrompt: "",
					followupQuestions: []
				};
		this.setState({
			currentQuestion: question,
			currentChoice: '',
			currentAnswer: '',
			currentQuestionFormat: 'standAlone'
		});
	}

	renderFormatForm(fieldReqs) {
		return(
				<div>
					<p>How do you want to format the question? <span style={fieldReqs.required}>required</span></p>
					<FormControl>
						<RadioGroup value={this.state.currentQuestionFormat} onChange={(evt) => this.setState({currentQuestionFormat: evt.target.value})}>
							<FormControlLabel value={"standAlone"} control={<Radio color={"primary"}/>} label={"Stand alone question"}/>
							<FormControlLabel value={"table"} control={<Radio color={"primary"}/>} label={"Format as a table"}/>
						</RadioGroup>
					</FormControl>
				</div>
		);
	}

	/**
	 * Renders the prompt for the question
	 * @param fieldReqs
	 * @returns {*}
	 */
	renderPromptField(fieldReqs) {
		return (
				<div>
					<p>Question Prompt <span style={fieldReqs.optional}>optional</span></p>
					<TextField fullWidth={true} value={this.state.currentQuestion.prompt} onChange={this.handleChange('prompt')}/>
				</div>
		);
	}

	/**
	 *
	 * @returns {*}
	 */
	renderCodeField(fieldReqs) {
		return(
				<div>
					<p>Code <span style={fieldReqs.optional}>optional</span></p>
					<textarea style={{display: 'block', width: '100%', height: '10em'}}
										value={this.state.currentQuestion.code}
										onChange={this.handleChange('code')} />
				</div>
		);
	}

	renderDifficultyField(fieldReqs) {
		return(
				<div>
					<p>Difficulty level <span style={fieldReqs.required}>required</span></p>
					<FormControl>
						<NativeSelect value={"Select difficulty level"} onChange={this.handleChange('difficulty')}>
							<option>Select difficulty level</option>
							{
								Object.keys(this.Difficulty).map((level, key) => {
									let value = this.Difficulty[level];
									return <option key={key}>{value}</option>
								})
							}
						</NativeSelect>
					</FormControl>
				</div>
		);
	}

	/**
	 * Function to render the question type drop down
	 *
	 * @returns {*} html div
	 */
	renderQuestionTypeDropdown(fieldReqs) {
		return(
				<div>
					<p className={"text-primary"}>Question Type <span style={fieldReqs.required}>required</span></p>
					<FormControl style={{display: 'block'}}
											 fullWidth={true}>
						<NativeSelect name={"Question Type"}
													value={"Select Question Type"}
													onChange={this.handleChange('type')}>
							<option>Select question type</option>
							{
								Object.keys(this.QuestionTypes).map((qType, key) => {
									let type = this.QuestionTypes[qType];
									return <option key={key}>{type}</option>
								})
							}
						</NativeSelect>
					</FormControl>
					{this.state.currentQuestion.type === this.QuestionTypes.multipleChoice ?
							this.renderChoicesInputForm() : null
					}
				</div>
		);
	}

	/**
	 * Function to render the choices input form
	 *
	 * @returns {*} html div
	 */
	renderChoicesInputForm() {
		return(
				<div>
					<label className={"text-primary"}>Choices</label>
					<TextField fullWidth={true}
										 style={{display: 'block'}}
										 onChange={(evt) => this.setState({currentChoice: evt.target.value})}
										 value={this.state.currentChoice}/>
					<Button variant={'outlined'}
									color={'secondary'}
									onClick={(evt) => {
										if (this.state.currentChoice === '') return;
										let choicesCopy = [...this.state.currentQuestion.choices];
										choicesCopy.push(this.state.currentChoice);
										this.updateQuestion('choices', choicesCopy);
										this.setState({currentChoice: ''});
									}}>
						Add choice
					</Button>
					{this.renderChoices()}
				</div>
		);
	}

	/**
	 * Function to render the choices for a multiple choice question
	 * @returns {*}
	 */
	renderChoices() {
		return(
				<div style={{width: '100%', height: '10em', borderStyle: 'solid', borderColor: '#BBDEFB'}}>
					{
						this.state.currentQuestion.choices.map((choice, key) => {
							return <Button key={key}
														 variant={'flat'}
														 style={{backgroundColor: '#ffecb3'}}
														 onClick={(evt) => {
															 let index = this.state.currentQuestion.choices.indexOf(evt.target.innerText);
															 let choicesCopy = [...this.state.currentQuestion.choices];
															 choicesCopy.splice(index, 1);
															 this.updateQuestion('choices', choicesCopy);
														 }}>
								{choice}
							</Button>
						})
					}
				</div>
		);
	}

	/**
	 * Renders the answer input field
	 */
	renderAnswer(reqs) {
		if (this.state.currentQuestion.type === this.QuestionTypes.multipleChoice) {
			return(
					<div>
						<p>Answer <span style={reqs.required}>required</span></p>
						<NativeSelect onChange={this.handleChange('answer')}>
							<option>Select the answer</option>
							{
								this.state.currentQuestion.choices.map((choice, key) => {
									return <option key={key}>{choice}</option>
								})
							}
						</NativeSelect>
					</div>
			);
		} else if (this.state.currentQuestion.type === this.QuestionTypes.memoryTable) {
			// renders a text area for the user to type in a dictionary
			// TODO: Implmenent a usable table UI
			return (
					<div>
						<p>Type in a JSON dictionary</p>
						<textarea></textarea>
					</div>
			);
		} else {
			// returns a text field for answer
			return (
					<div>
						<p>Answer <span style={reqs.required}>required</span></p>
						<TextField fullWidth={true}
											 value={this.state.currentQuestion.answer}
											 onChange={this.handleChange('answer')} />
					</div>
			);
		}
	}

	/**
	 * Renders the hint input field
	 * @returns {*}
	 */
	renderHintField(fieldReqs) {
		return (
				<div>
					<p>Hint <span style={fieldReqs.required}>required</span></p>
					<TextField fullWidth={true} value={this.state.currentQuestion.hint} onChange={this.handleChange('hint')}/>
				</div>
		);
	}

	renderFeedbackField(fieldReqs) {
		return(
				<div>
					<p>Feedback <span style={fieldReqs.required}>required</span></p>
					<TextField fullWidth={true} value={this.state.currentQuestion.feedback} onChange={this.handleChange('feedback')}/>
				</div>
		);
	}

	renderQuestionActions() {
		// TODO: on click invoke a function in Exercise tool
		return(
				<Button variant={'outlined'}
								color={'secondary'}
								onClick={() => this.writeQuestion()}
								>Add Question</Button>
		);
	}

	/**
	 * Verifies that all of the required fields are present and writes the question
	 * to the exercise.
	 */
	writeQuestion() {
		if (this.state.currentQuestion.difficulty !== -1 &&
				this.state.currentQuestion.type !== '' &&
				this.state.currentQuestion.answer !== '' &&
				this.state.currentQuestion.hint !== '' &&
				this.state.currentQuestion.feedback !== '') {
			this.props.addQuestion(this.state.currentQuestion);
		} else {
			// TODO: Make this more user friendly!
			console.log(this.state.currentQuestion.difficulty);
			console.log(this.state.currentQuestion.type);
			console.log(this.state.currentQuestion.answer);
			console.log(this.state.currentQuestion.hint);
			console.log(this.state.currentQuestion.feedback);
			window.alert("You are missing at least 1 required field.");
		}
	}

	/**
	 * Handles a change in the current question object
	 *
	 * @param field
	 * @returns {Function}
	 */
	handleChange(field) {
		return (e) => {
			this.updateQuestion(field, e.target.value);
		}
	}

	/**
	 * Updates the questions array in the current exercise
	 * @param field
	 * @param value
	 */
	updateQuestion(field, value) {
		let temp = this.state.currentQuestion;
		temp[field] = value;
		this.setState({currentQuestion: temp});
	}

	render() {
		let fieldReqs = {
			required: {
				float: 'right',
				color: '#EF5350'
			},
			optional: {
				float: 'right',
				color: '#4DD0E1'
			}
		}

		let followup = {
			border: 'solid',
			borderColor: '#9FA8DA'
		}

		let card = this.props.isFollowup ? followup : {};

		// TODO: Add a delete function
		return (
				<Card style={card}>
					<CardActions>
						<Button>Clear Fields</Button>
						<Button>Delete</Button>
					</CardActions>
					<CardContent>
						{this.renderFormatForm(fieldReqs)}
						{this.renderPromptField(fieldReqs)}
						{this.renderCodeField(fieldReqs)}
						{this.renderQuestionTypeDropdown(fieldReqs)}
						{this.renderAnswer(fieldReqs)}
						{this.renderDifficultyField(fieldReqs)}
						{this.renderHintField(fieldReqs)}
						{this.renderFeedbackField(fieldReqs)}
						{this.renderQuestionActions()}
					</CardContent>
				</Card>
		);
	}
}

export default Question;