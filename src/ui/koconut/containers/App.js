// @flow
import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import './App.css';
import PopOverMessage from './PopoverMessage';
import Types from '../../../data/ExerciseTypes.js';
import Routes from './../../../Routes';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import { ConceptKnowledge, MasteryModel } from '../../../data/MasteryModel';
import conceptMap from '../../../data/ConceptMap';
import Loadable from 'react-loadable';
import { ModelUpdater } from './../../../backend/ModelUpdater';
import { filterCompletedInstructions, filterCompletedExercises } from './../../../utils/queryCompleted';
import _isEmpty from 'lodash/isEmpty';
import {REC_RESPONSES, CONDITIONS} from './../../../utils/Conditions';
import _ from 'lodash';

// Fake AJAX
import ExerciseGenerator from '../../../backend/ExerciseGenerator';
// import ResponseEvaluator from '../../../backend/ResponseEvaluator'; // replaced w/ koconut-api /checker endpoint
import ExerciseTypes from '../../../data/ExerciseTypes.js';
import LoadingView from '../components/LoadingView';
import Profile from './Profile';
import Tutorial from './Tutorial';

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
const ProfileView = Loadable({
	loader: () => import('./Profile'),
	loading: Loading,
})
const TutorialView = Loadable({
	loader: () => import('./Tutorial'),
	loading: Loading,
})
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

// Concept Exercise categories Enums
const Categories = {
	read: "READ",
	write: "WRITE"
}

// BKT enums
const Fields = {
	init: "init",
	pKnown: "pKnown"
}

// first exercise to recommend (practice reading data types) #coldstart
const EXERCISE_ID_FIRST_REC = {'types-read-rules': REC_RESPONSES[0]};

// const PYTHON_API = "http://127.0.0.1:5000/checker/"; // TODO for prod: change this route
const PYTHON_API = "https://codeitz.herokuapp.com/checker/" // prod route

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
		userBKTParams: any,
		instructionsRead: any,
		exercisesCompleted: any,
		selectedIndex: string,
		prevQuestionAttemptCorrect: boolean
	};	

	_isMounted = false;

	constructor() {
		super();
		this.generator = new ExerciseGenerator(this.getOrderedConcepts);
		this.modelUpdater = null; // initialized in componentDidMount()

		this.theme = createMuiTheme();
		this.state = {
			exercise: {},
			exerciseType: '', // "READ" or "WRITE"
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
			exerciseList: null, // TODO: could remove and replace with Object.keys(this.state.exerciseConceptMap)
			conceptMapGetter: null,
			exerciseRecommendations: sessionStorage.getItem('exerciseRecommendations') || EXERCISE_ID_FIRST_REC, // TODO: could have this match based on user ID
			instructionRecommendations: {},
			codeTheme: '',
			timesGotQuestionWrong: [], // times the user has gotten question wrong,
			// indices are question index
			followupTimesGotQuestionWrong: [],
			exerciseId: sessionStorage.getItem('exerciseId') || '',
			numExercisesInCurrConcept: 0,
			userBKTParams: {},
			maxNumRecommendations: 6, // change or set elsewhere?,
			instructionsRead: {},
			selectedIndex: "", // index of instruction or exercise in focus. e.g. READ0, READe1, WRITE1,
			prevQuestionAttemptCorrect: null, // true if prev question attempt correct, false otherwise
			userCondition: null, // experimental condition user is in
			exerciseConceptMap: {}, //mapping for exercise id to concepts
			postSurveyLink: null,
			surveysAvailable: true // could run out of surveys, could expire
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
		this.updateInstructionsRead = this.updateInstructionsRead.bind(this);
		this.getSurveyUrl = this.getSurveyUrl.bind(this);
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

	componentDidMount() {
		this._isMounted = true;
		this.props.firebase.auth().onAuthStateChanged(async (user) => {
			if (user) {
				this.exerciseGetter = this.props.firebase.database().ref('Exercises');
				this.conceptMapGetter = this.props.firebase.database().ref('ConceptExerciseMap');

				this.setState({uid: user.uid});

				// set state for bkt params
				let userRef = this.props.firebase.database().ref(`/Users/${user.uid}/bktParams`);
				userRef.on("value", (snap) => {
					if (this._isMounted && snap.val()) {
						this.setState({
							userBKTParams: snap.val()
						});
					}
				});

				// set state for userCondition
				let userRefCondition = this.props.firebase.database().ref(`/Users/${user.uid}/condition`);
				userRefCondition.on("value", (snap) => {
					if (this._isMounted && snap.val()) {
						this.setState({
							userCondition: snap.val()
						});
					}
				});

				// set state for exerciseRecommendations
				let exerciseRecommendations = {};
				let userAnswerSubs = this.props.firebase.database().ref(`/Users/${user.uid}/Data/AnswerSubmission`);
				userAnswerSubs.on('value', (snap) => {
					if (this._isMounted && snap.val()) {
						let oldestTimestamp = -1; // larger is older
						let data = snap.val();
						for(let id in data) {
							if(data[id]["timestamp"] > oldestTimestamp && Object.keys(data[id]).includes("resultingRecommendations")) {
								oldestTimestamp = data[id]["timestamp"];
								exerciseRecommendations = Object.assign({}, data[id]["resultingRecommendations"]);
							}
						}

						this.setState({
							// only top recommendation for C2
							exerciseRecommendations: (this.state.userCondition === CONDITIONS.C2 ? this.getTopRecommendation(exerciseRecommendations) : exerciseRecommendations)
						});

					}
				});

				// set state for survey url if exists
				let surveyLinks = this.props.firebase.database().ref("surveyLinks/");
				surveyLinks.orderByChild('uid').equalTo(user.uid).limitToFirst(1).on('value', (snap) => {
					// survey already assigned to this user
					if(snap.val() && Object.keys(snap.val()).length > 0) { // filter b/c bug w/ limitToFirst() can create empty first element
						let url = snap.val()[Object.keys(snap.val())[0]].link;
						this.setState({postSurveyLink: url});
					}
				});

				// log start time
				this.props.firebase.database().ref(`/Users/${user.uid}/Data/SessionEvents`).push({
					type: "start",
					timestamp: this.props.firebase.database.ServerValue.TIMESTAMP
				});

				let completedInstructionsRef = this.props.firebase.database().ref(`/Users/${user.uid}/Data/NewPageVisit`);
				let instructionsRead = await filterCompletedInstructions(this.conceptMapGetter, completedInstructionsRef);

				let completedExercisesRef = this.props.firebase.database().ref(`/Users/${user.uid}/Data/AnswerSubmission`);
				let exercisesCompleted = await filterCompletedExercises(this.conceptMapGetter, completedExercisesRef, this.exerciseGetter);

				this.exerciseGetter.on('value', (snap) => {
					if (this._isMounted) {
						this.setState({
							exerciseList: snap.val(),
							firebaseUser: user
						}, () => {
							// get bkt params
							let userBKTParams = {};
							this.conceptMapGetter.on('value', (snap) => {
								// for previous users who weren't given bktParams upon creation
								// if this.state.userBKTParams is undefined or empty object
								if (!this.state.userBKTParams || Object.entries(this.state.userBKTParams).length === 0) {
									let concepts = snap.val();
									Object.keys(concepts).forEach(concept => {
										let conceptInfo = concepts[concept]["bktParams"];
										let userCentric = {};
										userCentric[Categories.read] = { [Fields.pKnown]: conceptInfo[Categories.read][Fields.init] };
										userCentric[Categories.write] = { [Fields.pKnown]: conceptInfo[Categories.write][Fields.init] };
										userBKTParams[concept] = userCentric;
									});
									let ref = this.props.firebase.database().ref(`Users/${user.uid}/bktParams`);
									ref.set(userBKTParams).catch(err => {
										console.log(err);
									})
								} else {
									userBKTParams = this.state.userBKTParams;
								}

								this.setState({
									conceptMapGetter: snap.val(),
									instructionsRead: instructionsRead,
									exercisesCompleted: exercisesCompleted,
									userBKTParams: userBKTParams // TODO: Delete this line later? unclear why set twice in componentDidMount()
								}, () => {
									this.updateUserState();
									this.initializeModelUpdater(); // need to wait until exerciseList & conceptMapGetter both set
									this.createExerciseConceptMap();
								});
							});

						});
					}
				});

				this.instructionMap = this.props.firebase.database().ref('Instructions');
				this.instructionMap.on('value', (snap) => {
					if (this._isMounted) {
						this.setState({ instructionsMap: snap.val() }, () => { this.updateUserState() });
					}
				});
			}
		});
	}

	/**
	 * Update state.exerciseConceptMap w/ object where key is exercise and value is concept (disregarding "read" or "write"). 
	 * Opposite of concept exercise-map 
	 */
	createExerciseConceptMap() {
		let exerciseConceptMap = {};
		if(this.state.conceptMapGetter) {
			for (let conceptName in this.state.conceptMapGetter){
				let concept = this.state.conceptMapGetter[conceptName];

				for(let key in Categories){
					let category = Categories[key];
					if(Object.keys(concept).includes(category)){
						for(let eid in concept[category]){
							exerciseConceptMap[concept[category][eid]] = conceptName;
						}
					} else console.log(`${Categories[key]} exercises not found for ${conceptName}`);
				}
			}
		}
		this.setState({
			exerciseConceptMap: exerciseConceptMap
		})
	}

	initializeModelUpdater() {
		let conceptParams = {};
		let exerciseParams = {};
		if (this.state.conceptMapGetter) {
			Object.keys(this.state.conceptMapGetter).forEach((conceptKey) => {
				let params = this.state.conceptMapGetter[conceptKey].bktParams;
				conceptParams[conceptKey] = params;
			});
		}
		if (this.state.exerciseList) {
			Object.keys(this.state.exerciseList).forEach((exerciseID) => {
				let params = this.state.exerciseList[exerciseID].bktParams;
				exerciseParams[exerciseID] = params;
			});
		}
		this.modelUpdater = new ModelUpdater(conceptParams, exerciseParams, this.state.userBKTParams, this.state.conceptMapGetter, 
			conceptMap, this.state.exercisesCompleted);
	}

	// return an object w/ only the top recommended exercise (key is ID, value is info about recommendation). For C2
	getTopRecommendation = (recommendedExercises) => {
		let outputC2 = {}
		outputC2[Object.keys(recommendedExercises)[0]] = recommendedExercises[Object.keys(recommendedExercises)[0]];
		return outputC2;
	}
	// update state w/ exercise recommendations and also push answer submission data to firebase
	updateRecommendations = (recommendedExercises, questionIndex, userAnswer, passed) => {
		this.setState({
			exerciseRecommendations: (this.state.userCondition === CONDITIONS.C2 ? this.getTopRecommendation(recommendedExercises) : recommendedExercises)
		}, () => {
			// not ideal to be doing this here, but need recommendedExercises to be pushed as well
			let dataToPush = {
				exerciseId: this.state.exerciseId,
				questionIndex: questionIndex,
				timestamp: this.props.firebase.database.ServerValue.TIMESTAMP,
				answer: userAnswer,
				correctness: passed,
				resultingRecommendations: this.state.exerciseRecommendations // TODO: race condition: do not wait for state.exerciseRecommendations to finish update
			};
			let userID = this.props.firebase.auth().currentUser.uid;
			this.props.firebase.database().ref(`/Users/${userID ? userID : 'nullValue'}/Data/AnswerSubmission`).push(dataToPush);
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
			selectedIndex: `${exerciseType}e${index}`, // "e" to distingusih from instruction #yuck
			error: false, // resets the error message
			feedback: [],
			prevQuestionAttemptCorrect: null
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
								counter: 0,
								currentConcept: state.concept
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
			selectedIndex: `${instructionType}${pageIndex}`,
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
		this._isMounted = false;
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
		if (answer[questionIndex]) {
			// TODO: when user answer is string (e.g. MC, write code), this turns it into char array which is then turned back later. Annoying and worth fixing later.
			requestBody.userAnswer = typeof answer[questionIndex][Symbol.iterator] === 'function' ? [...answer[questionIndex]] : answer[questionIndex];
		}

		switch (questionType) {
			case Types.multipleChoice:
				requestBody.questionCode = "";
				requestBody.testCode = "";
				requestBody.expectedAnswer = question.answer;
				requestBody.userAnswer = requestBody.userAnswer.join().replace(/,/g, ''); // turn userAnswer from char array to string and drop "," separator
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
					if(valueHistory){
						if(Array.isArray(valueHistory)) {
							valueHistory.forEach((val) => {
								values.push(String(val));
							});
						} else { // single value
							values.push(String(valueHistory));
						}
					} else throw `no value history for var ${variableName}`;
					expectedAnswer[variableName] = values;
				});

				requestBody.expectedAnswer = expectedAnswer;
				break;
			case Types.writeCode:
				// need to add in pre/post conditions to user answer
				requestBody.userAnswer = requestBody.userAnswer.join().replace(/,/g, ''); // turn userAnswer from char array to string and drop "," separator

				if (!("testCode" in requestBody)) {
					requestBody.testCode = question.answer;
				}

				if (question.preCondition) {
					let preCondition = question.preCondition.replace("<SEED>", this.getRandomInteger(1, 1000));
					requestBody.userAnswer = preCondition + "\n" + requestBody.userAnswer;
					requestBody.testCode = preCondition + "\n" + requestBody.testCode;
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
				let userAnswer = requestBody.userAnswer;
				for (let i = 0; i < userAnswer.length; i++) {
					let row = userAnswer[i];
					let numQuestionsInRow = questions[i].length;
					row = row.slice(numberOfColumns - numQuestionsInRow, numberOfColumns);

					userAnswer[i] = row;
				}
				requestBody.userAnswer = userAnswer;
				requestBody.questions = questions;
				break;
			default:
				return;
		}
		let feedback = await this.verifyUserAnswer(questionType, requestBody, questionIndex, fIndex);
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
	setFeedback(type: string, feedback: any, questionIndex: number, fIndex: number, userAnswer: string) {
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
				item.forEach((cell) => {
					if ('pass' in cell && !cell.pass) {
						passed = false;
					}
				});
				// passed = Object.keys(item).length > 0 && item.pass;
			}
		} else {
			passed = feedback.pass;
		}

		// update feedback in state
		this.setState({
			feedback: fIndex === -1 ? temp : [],
			followupFeedback: fIndex === 1 ? [] : temp,
			nextConcepts: this.getConcepts(),
			prevQuestionAttemptCorrect: passed,
			display: this.state.exercise.type !== 'survey'
				? displayType.exercise
				: (this.state.conceptOptions > 1
					? displayType.concept
					: displayType.exercise),
		}, async () => {
			let userID = this.props.firebase.auth().currentUser.uid;
			if (this.modelUpdater) {
				// given response, get new pknown
				let pkNew = await this.modelUpdater.update(passed, this.state.exerciseId, this.state.currentConcept, 
					this.state.exerciseType, questionIndex, userAnswer, this.state.instructionsRead, this.state.exercisesCompleted, this.updateRecommendations);

				// update pknown on firebase
				let databaseRef = this.props.firebase.database().ref(`Users/${userID}/bktParams/${this.state.currentConcept}/${this.state.exerciseType}/pKnown`);
				databaseRef.set(pkNew)
					.catch((e) => {
						console.log(e);
					})
			}
			if (!passed) {
				this.updateWrongAnswersCount(false, questionIndex, fIndex);
			}
		});

		return passed; // a bit odd that setFeedback() returns whether answer is correct...
	}

	/**
	 * Sends a request to the Correctness API to verify user response, updating state & returning response
	 * @param {*} requestBody 
	 * @param {*} questionIndex 
	 * @param {*} fIndex 
	 */
	async verifyUserAnswer(endpointExtension: string, requestBody: any, questionIndex: number, fIndex: number) {
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
			let userAnswer = requestBody["userAnswer"] ? requestBody["userAnswer"] : null;
			let passed = this.setFeedback(endpointExtension, feedback, questionIndex, fIndex, userAnswer);

			// updates checkmarks in NavItem on correctness
			if (passed) {
				let exercisesCompleted = Object.assign({}, this.state.exercisesCompleted); // deep copy
				exercisesCompleted[this.state.currentConcept].push(this.state.exerciseId); // add exercise to complete list
				this.setState({ exercisesCompleted: exercisesCompleted })
			}

			return feedback;
		}
		let feedback = await request();
		return feedback;
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
		} else {
			temp = this.state.followupTimesGotQuestionWrong;
			temp[questionIndex] = temp[questionIndex] ? temp[questionIndex] : [];
			if (!temp[questionIndex][fIndex]) {
				temp[questionIndex][fIndex] = 0;
			}
			if (!checkerForCorrectness) {
				temp[questionIndex][fIndex]++;
			}
		}
		this.setState({
			timesGotQuestionWrong: (fIndex === -1) ? temp : this.state.timesGotQuestionWrong,
			followupTimesGotQuestionWrong: (fIndex === -1) ? this.state.followupTimesGotQuestionWrong : temp
		});
	}

	/**
	 * Given a concept, read or write, and instruction index, update this.state.instructionsRead 
	 * to reflect a new page of instruction being read.
	 * @param {string} concept 
	 * @param {string} readOrWrite
	 * @param {number} index 
	 */
	updateInstructionsRead(concept: string, readOrWrite: string, instructionIndex: number) {
		if (this.state.instructionsRead) {
			let additionalInstructionRead = (concept in this.state.instructionsRead) && (readOrWrite in this.state.instructionsRead[concept])
				&& !this.state.instructionsRead[concept][readOrWrite].includes(instructionIndex); // nth instruction of concept & readOrWrite
			let firstInstructionRead = !(concept in this.state.instructionsRead) || !(readOrWrite in this.state.instructionsRead[concept]); // first instruction of concept & readOrWrite

			if (additionalInstructionRead || firstInstructionRead) {
				let instructionsRead = Object.assign({}, this.state.instructionsRead); // deep copy
				if (!(concept in instructionsRead)) {
					instructionsRead[concept] = {};
				}

				if (!(readOrWrite in instructionsRead[concept])) {
					instructionsRead[concept][readOrWrite] = [];
				}

				instructionsRead[concept][readOrWrite].push(instructionIndex);
				instructionsRead[concept][readOrWrite].sort();
				this.setState({
					instructionsRead: instructionsRead
				});
			}
		}
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
		this.setState({
			display: displayType.exercise,
			feedback: (followupIndex === -1) ? tempFeedback : this.state.feedback,
			followupQuestions: (followupIndex === -1) ? this.state.followupFeedback : tempFeedback
		});
	}

	// update state.postSurveyLink w/ URL to post-survey (from 'surveyLinks' collection). 
	// update state.surveysAvailable to false if no surveys available
	getSurveyUrl() {	
		if(!this.state.postSurveyLink) {
			let uid = this.props.firebase.auth().currentUser.uid;
			let surveyLinks = this.props.firebase.database().ref("surveyLinks/");
			surveyLinks.orderByChild('uid').equalTo(uid).limitToFirst(1).on('value', (snap) => {
				// survey already assigned to this user. really shouldn't be in this condition b/c handled in componentDidMount()	
				if(snap.val() && Object.keys(snap.val()).length > 0) { // filter b/c bug w/ limitToFirst() can create empty first element
					let url = snap.val()[Object.keys(snap.val())[0]].link;
					this.setState({postSurveyLink: url});
				}
				else { // if no survey assigned to user (expected condition), assign one
					surveyLinks.orderByChild('uid').equalTo(null).limitToFirst(1).on('value', (snapshot) => {
						if(snapshot.val() && Object.keys(snapshot.val()).length > 0) { // check for available survey
							var availableSurvey = snapshot.val()[Object.keys(snapshot.val())[0]]; // removing empty elements b/c they sometimes exist...?

							// update surveyLinks with user uid to show that link is used
							if(!this.state.postSurveyLink && availableSurvey && 'key' in availableSurvey) { 
								let uidRef = this.props.firebase.database().ref(`surveyLinks/${availableSurvey.key}/uid`);
								uidRef.set(uid).catch(err => { // need state.postSurveyLink in conditional to prevent weird infinite loop w/ uidRef.set()...
									console.log(err);
								}); 
	
								let timeRef = this.props.firebase.database().ref(`surveyLinks/${availableSurvey.key}/whenAssigned`);
								timeRef.set(this.props.firebase.database.ServerValue.TIMESTAMP).catch(err => {
									console.log(err);
								}); 

								this.setState({postSurveyLink: availableSurvey.link});
							}
						} else {
							this.setState({surveysAvailable: false});
						}
					});
				}
			});		
		}
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
		this.setState({
			display: displayType.world,
			counter: 0,
			feedback: [],
			selectedIndex: ""
		}, () => { this.sendWorldViewDataToFirebase() });
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
			<Welcome app={this} userCondition={this.state.userCondition} firebase={this.props.firebase} 
				switchToWorldView={this.switchToWorldView}
			/>
		);
	}

	/**
	 * Renders the exercise view   
	 */
	renderExercise() {
		return (
			<div>
				{this.renderNavBar()}
				{this.state.currentConcept &&
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
						userBKTParams={this.state.userBKTParams}
						instructionsRead={this.state.instructionsRead}
						exercisesCompleted={this.state.exercisesCompleted}
						selectedIndex={this.state.selectedIndex}
						prevQuestionAttemptCorrect={this.state.prevQuestionAttemptCorrect}
						userCondition={this.state.userCondition}
						switchToWorldView={this.switchToWorldView}
						exerciseConceptMap={this.state.exerciseConceptMap}
					/>
				}
				{!this.state.currentConcept &&
					<LoadingView />
				}
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
					instructionRecommendations={this.state.instructionRecommendations}
					userBKTParams={this.state.userBKTParams}
					instructionsRead={this.state.instructionsRead}
					exercisesCompleted={this.state.exercisesCompleted}
					selectedIndex={this.state.selectedIndex}
					userCondition={this.state.userCondition}
					exerciseConceptMap={this.state.exerciseConceptMap}
				/>
			</div>
		)
	}

	/**
	 * Renders instruction view
	 */
	renderInstructionView() {
		return (
			<div>
				{this.renderNavBar()}
				{this.state.currentConcept &&
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
						instructionRecommendations={this.state.instructionRecommendations}
						userBKTParams={this.state.userBKTParams}
						instructionsRead={this.state.instructionsRead}
						updateInstructionsRead={this.updateInstructionsRead}
						exercisesCompleted={this.state.exercisesCompleted}
						selectedIndex={this.state.selectedIndex}
						userCondition={this.state.userCondition}
						switchToWorldView={this.switchToWorldView}
						exerciseConceptMap={this.state.exerciseConceptMap}
					/>
				}
				{!this.state.currentConcept &&
					<LoadingView />}
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

	renderProfile() {
		return (
			<div>
				{this.renderNavBar()}
				<Profile
					firebase={this.props.firebase}
					userCondition={this.state.userCondition}
				/>
			</div>
		)
	}

	renderTutorial() {
		return(
			<div>
				{this.renderNavBar()}
				<Tutorial 
					firebase={this.props.firebase}
					userCondition={this.state.userCondition}
					switchToWorldView={this.switchToWorldView}
				/>
			</div>
		)
	}

	/**
	 * predefined routes within koconut
	 */
	renderDisplay() {
		return (
			<Switch>
				<Route exact path={Routes.home} component={() => this.renderSignup()} />
				<Route exact path={Routes.signin} component={() => this.renderSignin()} />
				<Route exact path={Routes.signup} component={() => this.renderSignup()} />
				<Route exact path={Routes.welcome} component={() => this.renderWelcome()} />
				<Route exact path={Routes.worldview} component={() => this.renderWorldView()} />
				<Route exact path={Routes.author} component={() => this.renderAuthorView()} />
				<Route exact path={Routes.instruction} component={() => this.renderInstructionView()} />
				<Route exact path={Routes.practice} render={() => this.renderExercise()} />
				<Route exact path={Routes.allexercises} render={() => this.renderAllExercises()} />
				<Route exact path={Routes.profile} render={() => this.renderProfile()} />
				<Route exact path={Routes.tutorial} render={() => this.renderTutorial()} />
				<Redirect to={Routes.home} />
			</Switch>
		);
	}

	/**
	 * renders the nav bar component for the app
	 * @returns {*}
	 */
	renderNavBar() {
		return (
			<Navbar 
				switchToWorldView={this.switchToWorldView} 
				userCondition={this.state.userCondition} 
				surveyUrl={this.state.postSurveyLink}
				surveysAvailable={this.state.surveysAvailable}
				getSurveyUrl={this.getSurveyUrl}
			/>
		);
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
