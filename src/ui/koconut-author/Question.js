import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import Button from '@material-ui/core/Button/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Table from './Table';

class Question extends Component {
	constructor(props) {
		super(props);

		this.renderStandAloneQuestion = this.renderStandAloneQuestion.bind(this);

		let question = {
			prompt: "",
			code: "",
			difficulty: -1,
			choices: [],
			type: "",
			answer: "",
			hint: "",
			feedback: {},
			followupPrompt: "",
			followupQuestions: []
		};

		// if the question has been added before, use the data prop
		if (this.props.insideTable && this.props.data !== undefined) {
			question = this.props.data;
		}

		this.state = {
			currentQuestion: question,
			currentChoice: '',
			currentAnswer: '',
			currentQuestionFormat: 'standAlone',
			checkboxOption: 'choice',
			feedback: question.feedback
		};
	}

	QuestionTypes = {
		survey: 'survey',
		writeCode: 'writeCode',
		fillBlank: 'fillBlank',
		highlightCode: 'highlightCode',
		multipleChoice: 'multipleChoice',
		shortResponse: 'shortResponse',
		memoryTable: 'memoryTable',
		checkboxQuestion: 'checkboxQuestion'
	};

	Difficulty = {
		low: 0,
		med: 1,
		high: 2
	};

	fieldReqs = {
		required: {
			float: 'right',
			color: '#EF5350'
		},
		optional: {
			float: 'right',
			color: '#4DD0E1'
		}
	};

	componentWillReceiveProps() {
		let question = {
			prompt: "",
			code: "",
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
			currentQuestionFormat: 'standAlone',
			checkboxOption: 'choice'
		});
	}

	renderFormatForm() {
		return(
				<div>
					<p style={{color: '#3F51B5'}}>How do you want to format the question? <span style={this.fieldReqs.required}>required</span></p>
					<FormControl>
						<RadioGroup value={this.state.currentQuestionFormat} onChange={(evt) => this.setState({currentQuestionFormat: evt.target.value})}>
							<FormControlLabel value={"standAlone"} control={<Radio color={"primary"}/>} label={"Stand alone question"}/>
							<FormControlLabel value={"table"} control={<Radio color={"primary"}/>} disabled={this.props.insideTable} label={"Format as a table"}/>
						</RadioGroup>
					</FormControl>
				</div>
		);
	}

	/**
	 * Renders the prompt for the question
	 *
	 * @returns {*}
	 */
	renderPromptField() {
		let style = {
			whiteSpace: 'pre-wrap'
		};
		return (
				<div>
					<p style={{color: '#3F51B5'}}>Question Prompt <span style={this.fieldReqs.optional}>optional</span></p>
					<TextField style={style}
										 fullWidth={true}
										 value={this.state.currentQuestion.prompt}
										 onChange={this.handleChange('prompt')}/>
				</div>
		);
	}

	/**
	 *
	 * @returns {*}
	 */
	renderCodeField() {
		return(
				<div>
					<p style={{color: '#3F51B5'}}>Code <span style={this.fieldReqs.optional}>optional</span></p>
					<textarea style={{display: 'block', width: '100%', height: '10em', whiteSpace: 'pre-wrap'}}
										value={this.state.currentQuestion.code}
										onChange={this.handleChange('code')} />
				</div>
		);
	}

	renderDifficultyField() {
		return(
				<div>
					<p style={{color: '#3F51B5'}}>Difficulty level <span style={this.fieldReqs.required}>required</span></p>
					<FormControl>
						<NativeSelect value={this.state.currentQuestion.difficulty} onChange={this.handleChange('difficulty')}>
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
	renderQuestionTypeDropdown() {
		return(
				<div>
					<p style={{color: '#3F51B5'}}>Question Type <span style={this.fieldReqs.required}>required</span></p>
					<FormControl style={{display: 'block'}}
											 fullWidth={true}>
						<NativeSelect name={"Question Type"}
													value={this.state.currentQuestion.type}
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
					<p style={{color: '#3F51B5'}}>Choices</p>
					<TextField fullWidth={true}
										 style={{display: 'block'}}
										 onChange={(evt) => this.setState({currentChoice: evt.target.value})}
										 value={this.state.currentChoice}/>
					<Button style={{margin: '15px'}}
									variant={'outlined'}
									color={'secondary'}
									onClick={() => {
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
														 style={{backgroundColor: '#ffecb3', margin: '3px'}}
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
	renderAnswer() {
		if (this.state.currentQuestion.type === this.QuestionTypes.multipleChoice) {
			return(
					<div>
						<p style={{color: '#3F51B5'}}>Answer <span style={this.fieldReqs.required}>required</span></p>
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
						<p style={{color: '#3F51B5'}}>Type in a JSON dictionary</p>
						<textarea style={{width: '100%', height: '10em', fontFamily: 'monospace', whiteSpace: 'pre-wrap'}}
											onChange={this.handleChange('answer')}/>
					</div>
			);
		} else if (this.state.currentQuestion.type === this.QuestionTypes.checkboxQuestion) {
				return this.renderCheckboxAnswerField();
		} else {
			// returns a text field for answer
			return (
					<div>
						<p style={{color: '#3F51B5'}}>Answer <span style={this.fieldReqs.required}>required</span></p>
						<TextField fullWidth={true}
											 value={this.state.currentQuestion.answer}
											 onChange={this.handleChange('answer')} style={{whiteSpace: 'pre-wrap'}} />
					</div>
			);
		}
	}

	/**
	 * Renders the answer form for a checkbox question
	 *
	 * @returns {*}
	 */
	renderCheckboxAnswerField() {
		return(
				<div>
					<p style={{color: '#3F51B5'}}>Choices (enter one at a time) <span style={this.fieldReqs.required}>required</span></p>
					<TextField fullWidth={true}
										 style={{display: 'block'}}
										 onChange={(evt) => this.setState({currentChoice: evt.target.value})}
										 value={this.state.currentChoice}/>
					<br/>

					<p style={{color: '#3F51B5'}}>Is current choice one of the answers? <span style={this.fieldReqs.required}>required</span></p>
					<RadioGroup value={this.state.checkboxOption} onChange={(evt) => this.setState({checkboxOption: evt.target.value})}>
						<FormControlLabel value={'answer'} control={<Radio color={"primary"}/>} label={"Yes"}/>
						<FormControlLabel value={'choice'} control={<Radio color={"primary"}/>} disabled={this.props.insideTable} label={"No"}/>
					</RadioGroup>

					<Button style={{margin: '15px'}}
									variant={'outlined'}
									color={'secondary'}
									onClick={() => {
										if (this.state.currentChoice === '') return;
										let choicesCopy = [...this.state.currentQuestion.choices];
										choicesCopy.push(this.state.currentChoice);
										this.updateQuestion('choices', choicesCopy);
										if (this.state.checkboxOption === 'answer') {
											let answersCopy = [...this.state.currentQuestion.answer];
											answersCopy.push(this.state.currentChoice);
											this.updateQuestion('answer', answersCopy);
										}
										this.setState({currentChoice: ''});
									}}>
						Add Choice
					</Button>

					{this.renderCheckBoxAnswers()}
				</div>
		);
	}

	renderCheckBoxAnswers() {
		return(
				<div style={{width: '100%', height: '10em', borderStyle: 'solid', borderColor: '#BBDEFB'}}>
					{
						this.state.currentQuestion.choices.map((choice, key) => {
							let style = {
								backgroundColor: '#ffecb3',
								margin: '3px'
							};
							if (this.state.currentQuestion.answer.includes(choice)) {
								style['border'] = 'solid';
								style['borderColor'] = '#8BC34A';
							} else {
								style['border'] = 'none'
							}
							return <Button key={key}
														 variant={'flat'}
														 style={style}
														 onClick={(evt) => {
														 	 let choiceIndex = this.state.currentQuestion.choices.indexOf(evt.target.innerText);
														 	 let choicesCopy = [...this.state.currentQuestion.choices];
														 	 choicesCopy.splice(choiceIndex, 1);
															 this.updateQuestion('choices', choicesCopy);

															 if (this.state.currentQuestion.answer.includes(choice)) {
																 let index = this.state.currentQuestion.answer.indexOf(evt.target.innerText);
																 let answersCopy = [...this.state.currentQuestion.answer];
																 answersCopy.splice(index, 1);
																 this.updateQuestion('answer', answersCopy);
															 }
														 }}>
								{choice}
							</Button>
						})
					}
				</div>
		);
	}

	/**
	 * Renders the hint input field
	 * @returns {*}
	 */
	renderHintField() {
		return (
				<div>
					<p style={{color: '#3F51B5'}}>Hint <span style={this.fieldReqs.required}>required</span></p>
					<TextField fullWidth={true} value={this.state.currentQuestion.hint} onChange={this.handleChange('hint')}/>
				</div>
		);
	}

	renderFeedbackField() {
		let style = {
			width: '100%',
			height: '10em',
			fontFamily: 'monospace'
		};
		return(
				<div>
					<p style={{color: '#3F51B5'}}>Feedback <span style={this.fieldReqs.required}>required</span></p>
					<p>Fill in the following JSON object</p>
					<p className={"text-warning"}>Note: For open-ended questions, incorrect field is an array of strings.</p>
					<textarea value={this.state.feedback}
										style={style}
										onChange={evt => this.setState({feedback: evt.target.value})}/>
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

	renderStandAloneQuestion() {
		let followup = {
			border: 'solid',
			borderColor: '#9FA8DA'
		};
		let card = this.props.isFollowup ? followup : {};
		return(
				<Card style={card}>
					<CardContent>
						{this.renderFormatForm()}
						<br/>
						{this.renderPromptField()}
						<br/>
						{this.renderCodeField()}
						<br/>
						{this.renderQuestionTypeDropdown()}
						<br/>
						{this.renderAnswer()}
						<br/>
						{this.renderDifficultyField()}
						<br/>
						{this.renderHintField()}
						<br/>
						{this.renderFeedbackField()}
						<br/>
						{this.renderQuestionActions()}
					</CardContent>
				</Card>
		);
	}

	renderQuestionForm() {
		if (this.state.currentQuestionFormat === 'standAlone') {
			return this.renderStandAloneQuestion();
		}
		return <Table renderStandAloneQuestion={this.renderStandAloneQuestion} addQuestion={this.props.addQuestion}/>;
	}

	/**
	 * Verifies that all of the required fields are present and writes the question
	 * to the exercise.
	 */
	writeQuestion() {
		if (this.state.currentQuestion.type &&
				this.state.currentQuestion.answer !== '' &&
				this.state.currentQuestion.hint &&
				this.state.feedback &&
				this.state.currentQuestion.difficulty !== -1) {
			if (this.state.currentQuestion.type === this.QuestionTypes.memoryTable) {
				this.updateQuestion('answer', JSON.parse(this.state.currentQuestion.answer));
			}
			this.updateQuestion('feedback', JSON.parse(this.state.feedback));
			this.props.addQuestion(this.state.currentQuestion);
		} else {
			// TODO: Make this more user friendly!
			console.log("difficulty: ", this.state.currentQuestion.difficulty);
			console.log("question type: ", this.state.currentQuestion.type);
			console.log("answer: ", this.state.currentQuestion.answer);
			console.log("hint: ", this.state.currentQuestion.hint);
			console.log("feedback: ", this.state.feedback);
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
		this.generateFeedbackTemplate();
	}

	/**
	 *
	 */
	generateFeedbackTemplate() {
		let template = {};
		if (this.state.currentQuestion.type === this.QuestionTypes.multipleChoice) {
			this.state.currentQuestion.choices.map(choice => {
				template[choice] = "";
			});
		} else {
			template["correct"] = "";
			// feedback for incorrect answers is in the form of an array of strings
			// so as to display feedback based on the number of tries
			template["incorrect"] = [];
		};
		this.setState({feedback: JSON.stringify(template, null, 2)});
	}

	render() {
		// TODO: Add a delete function
		return (
				this.renderQuestionForm()
		);
	}
}

export default Question;