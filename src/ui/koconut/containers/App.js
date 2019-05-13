// @flow
import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import './App.css';
import PopOverMessage from './PopoverMessage';
import Types from '../../../data/ExerciseTypes.js';
import Routes from './../../../Routes';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import { ConceptKnowledge, MasteryModel } from '../../../data/MasteryModel';
import Loadable from 'react-loadable';


// Fake AJAX
import ExerciseGenerator from '../../../backend/ExerciseGenerator';
import ResponseEvaluator from '../../../backend/ResponseEvaluator';
import ExerciseTypes from '../../../data/ExerciseTypes.js';

const Sk = require('skulpt');

const Loading = () => <div></div>;
const Navbar = Loadable({
	loader: () => import('../components/Navbar'),
	loading: Loading,
});
// const PopOverMessage = Loadable({
//     loader: () => import('./PopoverMessage'),
//     loading: Loading,
// });
const ConceptSelection = Loadable({
	loader: () => import('../components/ConceptSelection'),
	loading: Loading,
});
const WorldView = Loadable({
	loader: () => import('./WorldView'),
	loading: Loading,
});
const ExerciseView = Loadable({
	loader: () => import('./ExerciseView'),
	loading: Loading,
});
const Welcome = Loadable({
	loader: () => import('../components/Welcome'),
	loading: Loading,
});
const Signup = Loadable({
	loader: () => import('../components/Signup'),
	loading: Loading,
});
const SignIn = Loadable({
	loader: () => import('../components/SignIn'),
	loading: Loading,
});
const AuthorView = Loadable({
	loader: () => import('./../../koconut-author/AuthorView'),
	loading: Loading,
});
const InstructionView = Loadable({
	loader: () => import('./InstructionView'),
	loading: Loading,
});
// TODO: Delete this path later
const AllExercises = Loadable({
	loader: () => import('./AllExercises'),
	loading: Loading,
});


// Display type enum
const displayType = {
	signup: 'SIGNUP',
	signin: 'SIGNIN',
	welcome: 'WELCOME',
	exercise: 'EXERCISE',
	feedback: 'FEEDBACK',
	concept: 'CONCEPT',
	world: 'WORLD',
	load: 'LOAD',
	instruct: 'INSTRUCT',
	author: 'AUTHOR'
};

// 
const PYTHON_API = "http://localhost:8080/checker/";

/**
 * Renders the koconut application view.
 * @class
 */
class App extends Component {
	submitResponse: Function;
	submitConcept: Function;
	submitOk: Function;
	submitTryAgain: Function;
	generateExercise: Function;
	getInstruction: Function;
	setInstructionViewError: Function;
	resetError: Function;
	resetFeedback: Function;
	switchToWorldView: Function;
	generator: ExerciseGenerator;
	theme: mixed;
	nextQuestion: Function;
	updateUserState: Function;
	storeState: Function;
	clearCounterAndFeedback: Function;
	sendExerciseViewDataToFirebase: Function;
	hasNextQuestion: Function;
	getOrderedConcepts: Function;
	goToExercise: Function;
	// updater: ResponseEvaluator;
	state: {
		exercise: any,
		exerciseType: string,
		instructionType: string,
		feedback: any, // flow pls
		followupFeedback: any,
		nextConcepts: string[],
		counter: number,
		display: string, // the current display state
		conceptOptions: number, // concept options offered, no options if <= 1
		currentConcept: ?string,
		firebaseUser: any,
		error: boolean,
		errorMessage: string,
		author: boolean,
		exerciseList: ?any[],
		conceptMapGetter: ?Map<string, number[]>,
		codeTheme: string,
		timesGotQuestionWrong: number[],
		followupTimesGotQuestionWrong: any[],
		exerciseId: string,
		exerciseRecommendations: any,
		instructionRecommendations: any,
	};

	constructor() {
		super();
		this.generator = new ExerciseGenerator(this.getOrderedConcepts);
		this.theme = createMuiTheme();
		this.state = {
			exercise: {},
			exerciseType: '', // yet to be defined
			instructionType: '',
			feedback: [],
			followupFeedback: [],
			nextConcepts: [],
			counter: 0, // Changed this from 1 to 0 -- cuz 0-based indexing
			display: displayType.load,
			conceptOptions: 4, // TODO: Make this not hard coded
			currentConcept: null,
			firebaseUser: null,
			error: false,
			errorMessage: '', // none
			author: false,
			exerciseList: null,
			conceptMapGetter: null,
			exerciseRecommendations: {},
			instructionRecommendations: {},
			codeTheme: '',
			timesGotQuestionWrong: [], // times the user has gotten question wrong,
			// indices are question index
			followupTimesGotQuestionWrong: [],
			exerciseId: '',
			numExercisesInCurrConcept: 0
		};
		// this.updater = new ResponseEvaluator();
		this.submitResponse = this.submitResponse.bind(this);
		this.submitConcept = this.submitConcept.bind(this);
		this.submitOk = this.submitOk.bind(this);
		this.submitTryAgain = this.submitTryAgain.bind(this);
		this.generateExercise = this.generateExercise.bind(this);
		this.getInstruction = this.getInstruction.bind(this);
		this.setInstructionViewError = this.setInstructionViewError.bind(this);
		this.resetError = this.resetError.bind(this);
		this.switchToWorldView = this.switchToWorldView.bind(this);
		this.nextQuestion = this.nextQuestion.bind(this);
		this.resetFeedback = this.resetFeedback.bind(this);
		this.updateUserState = this.updateUserState.bind(this);
		this.storeState = this.storeState.bind(this);
		this.clearCounterAndFeedback = this.clearCounterAndFeedback.bind(this);
		this.sendExerciseViewDataToFirebase = this.sendExerciseViewDataToFirebase.bind(this);
		this.hasNextQuestion = this.hasNextQuestion.bind(this);
		this.getOrderedConcepts = this.getOrderedConcepts.bind(this);
		this.goToExercise = this.goToExercise.bind(this);
	}

	sendExerciseViewDataToFirebase(exerciseId: string) {
		if (this.state.firebaseUser) {
			let uid = this.state.firebaseUser.uid;
			let pageType = 'exercise';
			this.props.firebase.database().ref(`/Users/${uid ? uid : 'nullValue'}/Data/NewPageVisit`).push({
				pageType,
				exerciseId,
				timestamp: this.props.firebase.database.ServerValue.TIMESTAMP
			});
		}
	}

	sendWorldViewDataToFirebase() {
		if (this.state.firebaseUser) {
			let uid = this.state.firebaseUser.uid;
			let pageType = 'worldview';
			this.props.firebase.database().ref(`/Users/${uid ? uid : 'nullValue'}/Data/NewPageVisit`).push({
				pageType,
				timestamp: this.props.firebase.database.ServerValue.TIMESTAMP
			});
		}
	}

	returnDisplayTypes() {
		return displayType;
	}

	/**
 * Returns sorted concepts list sorted by relevance to the user.
 * @returns {Array.<*>}
 */
	getOrderedConcepts(): ConceptKnowledge[] {
		let toSort = MasteryModel.model.filter((concept) => concept.should_teach);

		let toProcess = [];

		// count how many incoming edges each vertice has (toSort[##].dependencies.length)
		toSort.forEach(d => {
			d.incomingEdgeCount = d.dependencies.length;
		});

		let topoOrder = [];

		// insert into a to process
		toSort.forEach(d => {
			if (d.incomingEdgeCount === 0) {
				toProcess.push(d);
			}
		});

		while (toProcess.length !== 0) {
			let u = toProcess.pop();
			topoOrder.push(u);
			u.parents.forEach(d => {
				d.incomingEdgeCount--;
				if (d.incomingEdgeCount === 0) {
					toProcess.push(d);
				}
			});
		}

		return topoOrder;
	}

	// TODO: Update this when reading recommendations data from Firebase
	componentDidMount() {
		this.mounted = true;
		this.props.firebase.auth().onAuthStateChanged(user => {
			if (user) {
				this.exerciseGetter = this.props.firebase.database().ref('Exercises');
				this.exerciseGetter.on('value', (snap) => {
					this.setState({
						exerciseList: snap.val(),
						firebaseUser: user
					});
				});
				this.conceptMapGetter = this.props.firebase.database().ref('ConceptExerciseMap');
				this.conceptMapGetter.on('value', (snap) => {
					this.setState({ conceptMapGetter: snap.val() }, () => { this.updateUserState() });
				});
				this.instructionMap = this.props.firebase.database().ref('Instructions');
				this.instructionMap.on('value', (snap) => {
					this.setState({ instructionsMap: snap.val() }, () => { this.updateUserState() });
				});
			}
		});
	}

  /**
   * Passed in as a prop to WorldView -> ConceptCard
   * When invoked in concept card, it generates an exercise of the given
   * concept and type
   */
	generateExercise(concept: string, exerciseType: string) {
		let exercises = this.generator.getExercisesByTypeAndConcept(exerciseType, concept, this.state.exerciseList, this.state.conceptMapGetter).results;
		let exerciseIds = this.generator.getExercisesByTypeAndConcept(exerciseType, concept, this.state.exerciseList, this.state.conceptMapGetter).exerciseIds;
		if (exercises) {
			if (exercises.length === 0) {
				this.setState({
					error: true,
					errorMessage: 'Sorry, there are no exercises available for this concept right now.'
				}, this.storeState("exercise", this.state.counter, this.state.exerciseType, concept));
			} else if (this.state.counter === exercises.length) { // reached the end of the list
				this.setState({
					error: true,
					errorMessage: 'Looks like we ran out of questions for this concept, stay-tuned for more!'
				}, this.storeState("exercise", this.state.counter, this.state.exerciseType, concept));
			} else {
				this.setState({
					display: displayType.exercise,
					exercise: exercises[exerciseType !== this.state.exerciseType || concept !== this.state.currentConcept ? 0 : this.state.counter],//this.generator.getStubExercise(), // exercises[this.state.counter].exercise, // TODO: convert this for testing
					exerciseId: exerciseIds[exerciseType !== this.state.exerciseType || concept !== this.state.currentConcept ? 0 : this.state.counter],
					currentConcept: concept,
					counter: exerciseType !== this.state.exerciseType || concept !== this.state.currentConcept ? 0 : this.state.counter,
					exerciseType: exerciseType,
					numExercisesInCurrConcept: exercises.length,
					error: false, // resets the error message,
					feedback: [],
				}, () => {
					this.storeState("exercise", this.state.counter, this.state.exerciseType, concept);
				});
			}
		}
	}

	/**
	 * Is passed as a prop to WorldView -> ConceptDialog
	 * Updates the state in App.js when invoked in ConceptDialog.js
	 *
	 * @param concept
	 * @param exerciseType
	 * @param exercise
	 * @param exerciseId
	 * @param index
	 * @param numberOfExercises
	 */
	goToExercise(concept: string, exerciseType: string, exercise: any,
		exerciseId: string, index: number, numberOfExercises: number) {
		this.setState({
			display: displayType.exercise,
			exercise: exercise,
			exerciseId: exerciseId,
			currentConcept: concept,
			counter: index,
			exerciseType: exerciseType,
			numExercisesInCurrConcept: numberOfExercises,
			error: false, // resets the error message
			feedback: []
		}, () => {
			this.storeState("exercise", this.state.counter, this.state.exerciseType, concept);
		});
	}

	/**
	 * Stores user's current state on Koconut to Firebase
	 *
	 * @param mode
	 */
	storeState(mode: string, counter: number, type: string, concept: string) {
		let state = {
			mode: mode,
			type: type,
			concept: concept,
			counter: counter
		};
		let userId = this.props.firebase.auth().currentUser.uid;
		let userRef = this.props.firebase.database().ref('Users/' + userId + '/state');
		userRef.set(state);
	}

	/**
	 * Retrieves current user's most recent state on the app from Firebase
	 */
	updateUserState() {
		if (this.props.firebase.auth().currentUser) {
			let userId = this.props.firebase.auth().currentUser.uid;
			let userRef = this.props.firebase.database().ref('Users/' + userId + '/state');
			let state = {};
			userRef.on('value', snap => {
				if (snap.val() !== null) {
					state = snap.val();
					if (this.state.conceptMapGetter) {
						let exercises = this.generator.getExercisesByTypeAndConcept(state.type, state.concept, this.state.exerciseList, this.state.conceptMapGetter).results;
						if (state.mode === "exercise") {
							this.setState({
								currentConcept: state.concept,
								counter: state.counter,
								exerciseType: state.type,
								exercise: (exercises && exercises[state.counter]) ? exercises[state.counter] : {},
								numExercisesInCurrConcept: exercises.length
							});
						} else {
							this.setState({
								counter: 0
							});
						}
					}
				}
			});
		}
	}

	/**
	 * Passed in as a prop to WorldView -> ConceptCard
	 * When invoked in concept card, this function redirects the user
	 * to the corresponding instruction view.
	 *
	 * @param concept
	 * @param instructionType
	 */
	getInstruction(concept: string, instructionType: string, pageIndex: number) {
		this.setState({
			currentConcept: concept,
			instructionType: instructionType,
			display: displayType.instruct,
			error: false // resets error state
		}, () => {
			// update state on firebase
			this.storeState("instruction", pageIndex, this.state.instructionType, concept);
		});
	}

	/**
	 * Passed as a prop to InstructionView. Invoked when there are no instructions
	 * available for a concept.
	 *
	 */
	setInstructionViewError() {
		this.switchToWorldView();
		this.setState({
			error: true,
			errorMessage: 'Looks like there are no instructions on this concept right now. Please come back later!'
		});
	}

	/**
	 * sets error state to false
	 */
	resetError() {
		this.setState({ error: false });
	}

  /**
   * Set up a firebase authentication listener when component mounts
   * Will set the state of firebaseUser to be the current logged in user
   * or null if no user is logged in.
   *
   * Can be passed down to props as this.state.firebaseUser, useful for
   * data collection.
   * Un app un-mount, stop watching authentication
   */
	componentWillUnmount() {
		this.mounted = false;
	}

	/**
	 * Returns a list of concepts relevant to the current concept
	 * @returns {*}
	 */
	getConcepts(generator: any = this.generator) {
		let size = this.state.conceptOptions;
		let concept = this.state.currentConcept;
		let ret;
		if (concept !== null && concept !== undefined) {
			ret = generator.getConceptsRelativeTo(concept);
		} else {
			ret = generator.getConcepts(size);
		}
		return ret;
	}

  /**
   * checkAnswer will check the answers client side to provide the feedback
   * to the Response.js object later on
   * @param {string[]} answer string array of answers for each question
   * @param {number} questionIndex index of question to check the answer of
   * @param {string} questionType type of question
   * @param {number} fIndex followup question index
   * @return {string[]}
   */
	async checkAnswer(answer: any, questionIndex: number, questionType: string, fIndex: number) {
		let question = (fIndex === -1) ? this.state.exercise.questions[questionIndex] : this.state.exercise.questions[questionIndex].followupQuestions[fIndex];
		let requestBody = {};
		requestBody.userAnswer = answer[questionIndex];

		switch (questionType) {
			case Types.multipleChoice:
				requestBody.questionCode = "";
				requestBody.testCode = "";
				requestBody.expectedAnswer = question.answer;
				await this.verifyUserAnswer(questionType, requestBody, questionIndex, fIndex);
				break;
			case Types.fillBlank || Types.isInlineResponseType:
				requestBody.expectedAnswer = question.answer;
				requestBody.questionCode = question.code ? question.code : "";
				requestBody.testCode = "";
				break;
			case Types.highlightCode:
				requestBody.userAnswer = answer.trim();
				requestBody.expectedAnswer = question.answer;
				requestBody.testCode = "";
				break
			case Types.checkboxQuestion:
				requestBody.questionCode = "";
				requestBody.testCode = "";
				requestBody.expectedAnswer = question.answer;
				break;
			case Types.memoryTable:
				requestBody.questionCode = "";
				requestBody.testCode = "";

				// convert values to strings (ex: int to str)
				let expectedAnswer = {};
				Object.keys(question.answer).forEach((variableName) => {
					let valueHistory = question.answer[variableName];
					let values = [];
					valueHistory.forEach((val) => {
						values.push(val + "");
					});
					expectedAnswer[variableName] = values;
				});

				requestBody.expectedAnswer = expectedAnswer;
				break;
			case Types.writeCode:
				// need to add in pre/post conditions to user answer
				if (question.preCondition) {
					let preCondition = question.preCondition.replace("<SEED>", this.getRandomInteger(1, 1000));
					requestBody.userAnswer = preCondition + "\n" + requestBody.userAnswer;
					requestBody.testCode = preCondition + "\n" + question.answer;
				}
				if (question.postCondition) {
					requestBody.userAnswer = requestBody.userAnswer + "\n" + question.postCondition;
					requestBody.testCode = requestBody.testCode + "\n" + question.postCondition;
				}
				requestBody.expectedAnswer = "";
				break;
			case Types.table:
				let cells = question.data;
				let numberOfColumns = question.colNames.length;
				let numberOfRows = cells.length / numberOfColumns;
				let questions = [];

				for (let i = 0; i < numberOfRows; i++) {
					questions[i] = [];
				}

				let cell = 0;
				for (let i = 0; i < numberOfRows; i++) {
					for (let j = 0; j < numberOfColumns; j++) {
						let row = questions[i];
						if (cells[cell].answer) {
							row.push(cells[cell]);
						}
						cell++;
						questions[i] = row;
					}
				}

				// omit cells that map to prompt cells in the table
				let answer = requestBody.userAnswer;
				for (let i = 0; i < answer.length; i++) {
					let row = answer[i];
					let numQuestionsInRow = questions[i].length;
					row = row.slice(numberOfColumns - numQuestionsInRow, numberOfColumns);

					answer[i] = row;
				}
				requestBody.userAnswer = answer;
				requestBody.questions = questions;
				break;
			default:
				return;
		}
		await this.verifyUserAnswer(questionType, requestBody, questionIndex, fIndex);
	}

	getRandomInteger(min: number, max: number) {
		return Math.floor(Math.random() * (max - min)) + min
	}

	/**
	 * Updates the app state with feedback for user
	 * @param {string} type is indicates question type
	 * @param {*} feedback 
	 * @param {*} questionIndex 
	 * @param {*} fIndex 
	 */
	setFeedback(type: string, feedback: any, questionIndex: number, fIndex: number) {
		if (type == ExerciseTypes.table) {
			let question = this.state.exercise.questions[questionIndex];
			let numberOfColumns = question.colNames.length;
			let numberOfQuestionColumns = feedback[0].length;
			let temp = [];
			for (let i = 0; i < numberOfColumns - numberOfQuestionColumns; i++) {
				temp.push({});
			}
			for (let i = 0; i < feedback.length; i++) {
				let line = feedback[i];
				feedback[i] = temp.concat(line);
			}
		}
		let temp = [];
		if (fIndex === -1) {
			temp = this.state.feedback;
			temp[questionIndex] = feedback;
		} else {
			temp = this.state.followupFeedback;
			temp[fIndex] = feedback;
		}
		let passed = true;
		if (type === ExerciseTypes.table) {
			for (let i = 0; i < feedback.length; i++) {
				let item = feedback[i];
				passed = Object.keys(item).length > 0 && item.pass;
				if (!passed) {
					break;
				}
			}
		} else {
			passed = feedback.pass;
		}

		// update feedback in state
		this.setState({
			feedback: fIndex === -1 ? temp : [],
			followupFeedback: fIndex === 1 ? [] : temp,
			nextConcepts: this.getConcepts(),
			display: this.state.exercise.type !== 'survey'
				? displayType.exercise
				: (this.state.conceptOptions > 1
					? displayType.concept
					: displayType.exercise),
		}, () => {
			if (!passed) {
				this.updateWrongAnswersCount(false, questionIndex, fIndex);
			}
		});
	}

	/**
	 * Sends a request to the Correctness API to verify user response
	 * @param {*} requestBody 
	 * @param {*} questionIndex 
	 * @param {*} fIndex 
	 */
	async verifyUserAnswer(endpointExtension: string, requestBody: any, questionIndex: number, fIndex: number) {
		console.log(requestBody);

		const request = async () => {
			const response = await fetch(PYTHON_API + endpointExtension, {
				method: "POST",
				mode: "cors",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requestBody)
			})
			const feedback = await response.json();
			this.setFeedback(endpointExtension, feedback, questionIndex, fIndex);
		}
		await request();
	}

  /**
   * updateWrongAnswersCount updates the count for wrong answers
   * @param {boolean} checkerForCorrectness correctness false or true
   * @param {number} questionIndex question index
   * @param {number} fIndex followup question index
   */
	updateWrongAnswersCount(checkerForCorrectness: boolean, questionIndex: number, fIndex: number) {
		let temp;
		if (fIndex === -1) {
			temp = this.state.timesGotQuestionWrong;
			if (!temp[questionIndex]) {
				temp[questionIndex] = 0;
			}
			if (!checkerForCorrectness) {
				temp[questionIndex]++;
			}
			// console.log("wrong count", temp);
		} else {
			temp = this.state.followupTimesGotQuestionWrong;
			temp[questionIndex] = temp[questionIndex] ? temp[questionIndex] : [];
			if (!temp[questionIndex][fIndex]) {
				temp[questionIndex][fIndex] = 0;
			}
			if (!checkerForCorrectness) {
				temp[questionIndex][fIndex]++;
			}
			// console.log("followup wrong count", temp);
		}
		this.setState({
			timesGotQuestionWrong: (fIndex === -1) ? temp : this.state.timesGotQuestionWrong,
			followupTimesGotQuestionWrong: (fIndex === -1) ? this.state.followupTimesGotQuestionWrong : temp
		});
	}

  /**
   * Submits the give answer to current exercise
   * @param answer - the answer being submitted
   */
	submitResponse(answer: any, questionIndex: number, questionType: string, fIndex: number) {
		if (answer !== null && answer !== undefined) {
			// sets feedback / followupFeedback
			this.checkAnswer(answer, questionIndex, questionType, fIndex);
		}
	}

	resetFeedback() {
		this.setState({
			feedback: [],
			followupFeedback: [],
			timesGotQuestionWrong: [],
			followupTimesGotQuestionWrong: []
		});
	}

  /**
   * Submits the given concept
   * @param concept - the concept being submit
   */
	submitConcept(concept: string) {
		if (concept !== null && concept !== undefined) {
			let newCounter = concept === this.state.currentConcept ? (this.state.counter + 1) : 0;
			this.setState({
				concept: concept,
				counter: newCounter
			}, () => this.generateExercise(concept, this.state.exerciseType));
		}
	}

  /**
   * Invoked when student toggles OK button after receiving feedback
   */
	submitOk() {
		this.setState({
			nextConcepts: this.getConcepts(),
			display: displayType.concept,
		});
	}

  /**
   * nextQuestion will set the state of the exercise to be the next question.
   */
	nextQuestion() {
		this.setState({
			counter: this.state.counter + 1,
			feedback: [],
			followupFeedback: [],
			timesGotQuestionWrong: [],
			followupTimesGotQuestionWrong: []
		}, () => {
			this.generateExercise(this.state.currentConcept, this.state.exerciseType);
		});
	}

	// TODO William rewrite this to make it clear feedback instead of
	// just changing displaytype
	submitTryAgain(questionIndex: number, followupIndex: number) {
		let tempFeedback = (followupIndex === -1) ? this.state.feedback : this.state.followupFeedback;
		// console.log(tempFeedback[questionIndex]);
		// tempFeedback[questionIndex] = null;
		this.setState({
			display: displayType.exercise,
			feedback: (followupIndex === -1) ? tempFeedback : this.state.feedback,
			followupQuestions: (followupIndex === -1) ? this.state.followupFeedback : tempFeedback
		});
	}

  /**
   * renders the sign up view
   */
	renderSignup() {
		return (
			<div>
				<Signup />
			</div>
		);
	}

	/**
	 * renders the sign in view
	 */
	renderSignin() {
		return (<SignIn />);
	}

	/**
	 * Remders the author view
	 */
	renderAuthorView() {
		return (
			<div>
				{this.renderNavBar()}
				<AuthorView />
			</div>
		);
	}

	/**
	 * Renders the PopOverMessage if we run out of exercises. Passes error state
	 * as a prop
	 *
	 * @returns {*}
	 */
	renderErrorMessage() {
		return (<PopOverMessage toggleError={this.state.error}
			errorMessage={this.state.errorMessage}
			closeMessage={"Back to world view"}
			resetError={this.resetError} />);
	}

  /**
   * Sets the display state to 'WORLD". This function is passed as a prop
   * to the the navigationbar.
   * 
   * NOTE: This function does not actually set the state to world view. Because
   * React router has been implemented, all this does is set an internal state
   * to be set to displayType.world. This is still an important function because
   * it calls the firebase database and sends log data!
   */
	switchToWorldView() {
		this.setState({ display: displayType.world, counter: 0, feedback: [] }, () => { this.sendWorldViewDataToFirebase() });
	}

	clearCounterAndFeedback() {
		this.setState({ counter: 0, feedback: [] });
	}

	hasNextQuestion() {
		return this.state.counter < this.state.numExercisesInCurrConcept - 1;
	}


	/**
	 * Renders the welcome view
	 * @returns {*}
	 */
	renderWelcome() {
		return (
			<Welcome app={this} />
		);
	}

  /**
   * Renders the exercise view
   */
	renderExercise() {
		return (
			<div>
				{this.renderNavBar()}
				<ExerciseView
					updateUserState={this.updateUserState}
					exercise={this.state.exercise}
					readOrWrite={this.state.exerciseType}
					submitHandler={this.submitResponse}
					feedback={this.state.feedback}
					followupFeedback={this.state.followupFeedback}
					nextConcepts={this.state.nextConcepts}
					submitOk={this.submitOk}
					submitTryAgain={this.submitTryAgain}
					mode={this.state.display}
					concept={this.state.currentConcept}
					codeTheme={this.state.codeTheme}
					toggleCodeTheme={(theme) => this.setState({ codeTheme: theme })}
					timesGotQuestionWrong={this.state.timesGotQuestionWrong}
					followupTimesGotQuestionWrong={this.state.followupTimesGotQuestionWrong}
					nextQuestion={this.nextQuestion}
					resetFeedback={this.resetFeedback}
					clearCounterAndFeedback={this.clearCounterAndFeedback}
					sendExerciseViewDataToFirebase={this.sendExerciseViewDataToFirebase}
					exerciseId={this.state.exerciseId}
					generateExercise={this.generateExercise}
					hasNextQuestion={this.hasNextQuestion}
					getInstruction={this.getInstruction}
					exercisesList={this.state.exerciseList}
					conceptMapGetter={this.state.conceptMapGetter}
					getOrderedConcepts={this.getOrderedConcepts}
					goToExercise={this.goToExercise}
					instructionsMap={this.state.instructionsMap}
					exerciseRecommendations={this.state.exerciseRecommendations}
					instructionRecommendations={this.state.instructionRecommendations}
				/>
			</div>
		);
	}
  /**
   * Renders the concept selection view
   */
	renderConceptSelection() {
		return (
			<ConceptSelection
				concepts={this.state.nextConcepts}
				submitHandler={this.submitConcept}
			/>
		);
	}

  /**
   * Renders the world view
   */
	renderWorldView() {
		return (
			<div>
				{this.renderNavBar()}
				<WorldView firebase={this.props.firebase}
					switchToWorldView={this.switchToWorldView}
					generateExercise={this.generateExercise}
					getInstruction={this.getInstruction}
					getOrderedConcepts={this.getOrderedConcepts}
					exercisesList={this.state.exerciseList}
					conceptMapGetter={this.state.conceptMapGetter}
					goToExercise={this.goToExercise}
					instructionsMap={this.state.instructionsMap}
					exerciseRecommendations={this.state.exerciseRecommendations}
					instructionRecommendations={this.state.instructionRecommendations} />
			</div>
		)
	}

  /**
   * test method to render instruction view
   * @private
   */
	_renderInstructionView() {
		return (
			<div>
				{this.renderNavBar()}
				<InstructionView conceptType={this.state.currentConcept}
					readOrWrite={this.state.instructionType}
					setError={this.setInstructionViewError}
					generateExercise={this.generateExercise}
					storeUserState={this.storeState}
					sendExerciseViewDataToFirebase={this.sendExerciseViewDataToFirebase}
					exerciseId={this.state.exerciseId}
					clearCounterAndFeedback={this.clearCounterAndFeedback}
					getInstruction={this.getInstruction}
					getOrderedConcepts={this.getOrderedConcepts}
					exercisesList={this.state.exerciseList}
					conceptMapGetter={this.state.conceptMapGetter}
					goToExercise={this.goToExercise}
					instructionsMap={this.state.instructionsMap}
					exerciseRecommendations={this.state.exerciseRecommendations}
					instructionRecommendations={this.state.instructionRecommendations} />
			</div>
		);
	}

	/**
	 * Path that links to all exercises
	 * @returns {*}
	 */
	renderAllExercises() {
		// show all exercises view in development mode
		if (true /*!process.env.NODE_ENV || process.env.NODE_ENV ===
		 'development'*/) { // TODO: Uncomment this for large scale deployment
			return (<AllExercises getOrderedConcepts={this.getOrderedConcepts} />);
		} else {
			return this.renderWorldView();
		}
	}

	/**
	 * predefined routes within koconut
	 */
	renderDisplay() {
		return (
			<Switch>
				<Route exact path={Routes.home} component={() => this.renderSignin()} />
				<Route exact path={Routes.signin} component={() => this.renderSignin()} />
				<Route exact path={Routes.signup} component={() => this.renderSignup()} />
				<Route exact path={Routes.welcome} component={() => this.renderWelcome()} />
				<Route exact path={Routes.worldview} component={() => this.renderWorldView()} />
				<Route exact path={Routes.author} component={() => this.renderAuthorView()} />
				<Route exact path={Routes.instruction} component={() => this._renderInstructionView()} />
				<Route exact path={Routes.practice} render={() => this.renderExercise()} />
				<Route exact path={Routes.allexercises} render={() => this.renderAllExercises()} />
				<Redirect to={Routes.home} />
			</Switch>
		);
	}

	/**
	 * renders the nav bar component for the app
	 * @returns {*}
	 */
	renderNavBar() {
		return (<Navbar switchToWorldView={this.switchToWorldView} />);
	}

	render() {
		return (
			<div className="App">
				<Router>
					<MuiThemeProvider theme={this.theme}>
						<div className="main">
							{this.renderDisplay()}
							{this.state.error && this.renderErrorMessage()}
						</div>
					</MuiThemeProvider>
				</Router>
			</div>
		);
	}
}

export default App;
