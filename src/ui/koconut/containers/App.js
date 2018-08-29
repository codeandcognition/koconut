// @flow
import React, {Component} from 'react';
import 'firebase/auth';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import './App.css';
import Navbar from '../components/Navbar';
import ExerciseView from './ExerciseView';
import ConceptSelection from '../components/ConceptSelection';
import Welcome from '../components/Welcome';
import Signup from '../components/Signup';
import SignIn from '../components/SignIn';
import WorldView from './WorldView';
import AuthorView from './../../koconut-author/AuthorView';
import PopOverMessage from './PopoverMessage';
import InstructionView from './InstructionView';
import Types from '../../../data/ExerciseTypes.js';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import Routes from './../../../Routes';
import {BrowserRouter as Router, Switch, Redirect, Route} from 'react-router-dom';

// Fake AJAX
import ExerciseGenerator from '../../../backend/ExerciseGenerator';
import ResponseEvaluator from '../../../backend/ResponseEvaluator';
import type {Exercise} from '../../../data/Exercises';

const Sk = require('skulpt');


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
  // updater: ResponseEvaluator;
  state: {
    exercise: Exercise,
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
    exerciseList: ?Exercise[],
    conceptMapGetter: ?Map<string,number[]>,
    codeTheme: string,
    timesGotQuestionWrong: number[],
    followupTimesGotQuestionWrong: any[],
    exerciseId: string
  };

  constructor() {
    super();
    this.generator = new ExerciseGenerator();
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
      codeTheme: '',
      timesGotQuestionWrong: [], // times the user has gotten question wrong,
      // indices are question index
      followupTimesGotQuestionWrong: [],
      exerciseId: ''
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
  }

  sendExerciseViewDataToFirebase(exerciseId:string) {
  	if (this.state.firebaseUser) {
			let uid = this.state.firebaseUser.uid;
			let pageType = 'exercise';
			this.props.firebase.database().ref(`/Users/${uid?uid:'nullValue'}/Data/NewPageVisit`).push({
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
			this.props.firebase.database().ref(`/Users/${uid?uid:'nullValue'}/Data/NewPageVisit`).push({
				pageType,
				timestamp: this.props.firebase.database.ServerValue.TIMESTAMP
			});
		}
  }

  returnDisplayTypes() {
    return displayType;
  }

  componentDidMount() {
  	this.mounted = true;
  	firebase.auth().onAuthStateChanged(user => {
  		if (user) {
				this.exerciseGetter = this.props.firebase.database().ref('Exercises');
				this.exerciseGetter.on('value', (snap) => {
					this.setState({
						exerciseList:snap.val(),
						firebaseUser: user
					});
				});
				this.conceptMapGetter = this.props.firebase.database().ref('ConceptExerciseMap');
				this.conceptMapGetter.on('value', (snap) => {
					this.setState({conceptMapGetter: snap.val()}, () => {this.updateUserState()});
				});
			}
		});
	}

  /**
   * Passed in as a prop to WorldView -> ConceptCard
   * When invoked in concept card, it generates an exercise of the given
   * concept and type
   *
   * TODO: add user data on firebase for progress tracking
   */
  generateExercise(concept: string, exerciseType: string) {
		let exercises = this.generator.getExercisesByTypeAndConcept(exerciseType, concept, this.state.exerciseList, this.state.conceptMapGetter).results;
		let exerciseIds = this.generator.getExercisesByTypeAndConcept(exerciseType, concept, this.state.exerciseList, this.state.conceptMapGetter).exerciseIds;
		if (exercises) {
      if (exercises.length === 0) {
        this.setState({
          error: true,
          errorMessage: 'Sorry, there are no exercises available for this concept right now.'
        });
      } else if (this.state.counter === exercises.length) { // reached the end of the list
        // go back to the world view
        this.switchToWorldView();
        this.setState({
          error: true,
          errorMessage: 'Looks like we ran out of questions for this concept, stay-tuned for more!'
        });
      } else {
        this.setState({
          display: displayType.exercise,
          exercise: exercises[exerciseType !== this.state.exerciseType || concept !== this.state.currentConcept ? 0 : this.state.counter],//this.generator.getStubExercise(), // exercises[this.state.counter].exercise, // TODO: convert this for testing
          exerciseId: exerciseIds[exerciseType !== this.state.exerciseType || concept !== this.state.currentConcept ? 0 : this.state.counter],
          currentConcept: concept,
          counter: exerciseType !== this.state.exerciseType || concept !== this.state.currentConcept ? 0 : this.state.counter,
          exerciseType: exerciseType,
          error: false // resets the error message
        }, () => {
						this.storeState("exercise", this.state.counter, this.state.exerciseType, concept);
        });
      }
    }
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
		}
		let userId = firebase.auth().currentUser.uid;
		let userRef = firebase.database().ref('Users/' + userId + '/state');
		userRef.set(state);
	}

	/**
	 * Retrieves current user's most recent state on the app from Firebase
	 */
	updateUserState() {
		if (firebase.auth().currentUser) {
			let userId = firebase.auth().currentUser.uid;
			let userRef = firebase.database().ref('Users/' + userId + '/state');
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
								exercise: (exercises && exercises[state.counter]) ? exercises[state.counter] : {}
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
  getInstruction(concept: string, instructionType: string) {
  	this.setState({
			currentConcept: concept,
			instructionType: instructionType,
			display: displayType.instruct,
			error: false // resets error state
  	}, () => {
  		// update state on firebase
			this.storeState("instruction", 0, this.state.instructionType, concept);
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
		this.setState({error: false});
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
  checkAnswer(answer: any, questionIndex: number, questionType: string, fIndex: number) {
    let question = (fIndex === -1) ? this.state.exercise.questions[questionIndex] : this.state.exercise.questions[questionIndex].followupQuestions[fIndex];
    let feedbackTemp = (fIndex === -1) ? this.state.feedback : this.state.followupFeedback;
    let checkerForCorrectness = true;
    if (questionType === Types.table) {
    	checkerForCorrectness = this.verifyTableQuestion(question, questionIndex, fIndex, answer, feedbackTemp);
    } else if (questionType === Types.checkboxQuestion) { // Assumes question.answer and answer are both arrays
      checkerForCorrectness = this.verifyCheckboxQuestion(question, questionIndex, answer, fIndex, feedbackTemp);
    } else if (questionType === Types.memoryTable) {
    	checkerForCorrectness = this.verifyMemoryTable(question, questionIndex, answer, fIndex, feedbackTemp);
		} else {
			checkerForCorrectness = this.verifyOtherQuestions(question, questionIndex, answer, fIndex, feedbackTemp, questionType);
		}
		this.updateWrongAnswersCount(checkerForCorrectness, questionIndex, fIndex);
		return feedbackTemp;
  }

	/**
	 * verifies the correctness of user input for table questions
	 *
	 * @param question
	 * @param questionIndex
	 * @param fIndex
	 * @param answer
	 * @param feedbackTemp
	 * @returns {boolean}
	 */
  verifyTableQuestion(question: any, questionIndex: number, fIndex : number, answer: [], feedbackTemp: any) {
		// basically the answer will come in looking like this for a table type problem
		// mixed with regular problems
		// let stub = ["a", "a", [["", "a", "a"], ["", "a", "a"]], "a"];
		let checkerForCorrectness = true;
		let colNames = question.colNames;
		let allCells = question.data;
		let answerArr = (fIndex === -1) ? answer[questionIndex] : answer[questionIndex][fIndex];
		let addToFeedback = [];
		allCells.forEach((d, i) => {
			let arrayIndexToPushTo = Math.floor(i / colNames.length);
			if (!addToFeedback[arrayIndexToPushTo]) {
				addToFeedback[arrayIndexToPushTo] = [];
			}
			let subArrayIndex = i % colNames.length;
			let cellValue = null;
			if (d.answer === "") {
				cellValue = null;
				// sorry to whoever has to understand this later :(
				// it's for the greater good and expandability
			} else if (answerArr &&
					answerArr[arrayIndexToPushTo] && d.answer ===
					answerArr[arrayIndexToPushTo][subArrayIndex]) {
				cellValue = "correct";
			} else {
				cellValue = "incorrect";
				checkerForCorrectness = false;
			}
			addToFeedback[arrayIndexToPushTo][subArrayIndex] = cellValue;
		});
		if (fIndex === -1) {
			feedbackTemp[questionIndex] = addToFeedback;
		} else {
			feedbackTemp[questionIndex] = feedbackTemp[questionIndex] ? feedbackTemp[questionIndex] : [];
			feedbackTemp[questionIndex][fIndex] = addToFeedback;
		}
		return checkerForCorrectness;
	}

	/**
	 * Verifies the correctness of a checkbox question
	 * @param question
	 * @param questionIndex
	 * @param answer
	 * @param fIndex
	 * @param feedbackTemp
	 * @returns {boolean}
	 */
	verifyCheckboxQuestion(question: any, questionIndex: number, answer: any, fIndex: number, feedbackTemp: any) {
		let isCorrect = true;
		let answerArr = (fIndex === -1) ? answer[questionIndex] : answer[questionIndex][fIndex];
		let checkerForCorrectness = true;
		if (answerArr && question.answer.length === answerArr.length) {
			question.answer.forEach((item) => {
				if (!answerArr.includes(item)) {
					isCorrect = false;
					checkerForCorrectness = false;
				}
			})
		} else {
			isCorrect = false;
			checkerForCorrectness = false;
		}
		if (fIndex === -1) {
			feedbackTemp[questionIndex] = isCorrect ? "correct" : "incorrect";
		} else {
			feedbackTemp[questionIndex] = feedbackTemp[questionIndex] ? feedbackTemp[questionIndex] : [];
			feedbackTemp[questionIndex][fIndex] = isCorrect ? "correct" : "incorrect";
		}
		return checkerForCorrectness;
	}

	/**
	 * helper function to check answer for memory table questions
	 * @param answerKey
	 * @param userInput
	 * @returns {boolean}
	 */
  arrayEquals(answerKey: string[], userInput: string[]) {
  	if (!userInput || answerKey.length !== userInput.length) {
  		return false;
		}
		let equals = true;
		for (let i = 0; i < answerKey.length; i++) {
			// intended comparision (types are different)
			if (answerKey[i].toString() !== userInput[i].toString()) {
				return false;
			}
		}
		return equals;
	}

	/**
	 * Function to check correctness of user input for memory table questions
	 * Process the parameters before passing them to a helper method to handle the
	 * case where the question is a follow up question
	 *
	 * @param question
	 * @param questionIndex
	 * @param answer
	 * @param fIndex
	 * @param feedbackTemp
	 * @returns {boolean}
	 */
	verifyMemoryTable(question: any, questionIndex : number, answer: any, fIndex: number, feedbackTemp : any) {
  	let checkerForCorrectness = true;
		if (fIndex === -1) {
			let response = answer[questionIndex];
			feedbackTemp[questionIndex] = "correct";
			this.verifyMemoryTableHelper(question, questionIndex, response, feedbackTemp);
			checkerForCorrectness = feedbackTemp[questionIndex] === "correct";
		} else {
			let response = !answer[questionIndex] && [];
			feedbackTemp[questionIndex] = !feedbackTemp[questionIndex] && [];
			response = answer[questionIndex][fIndex];
			feedbackTemp[questionIndex][fIndex] = "correct";
			this.verifyMemoryTableHelper(question, fIndex, response, feedbackTemp[questionIndex]);
			checkerForCorrectness = feedbackTemp[questionIndex][fIndex] === "correct";
		}
		return checkerForCorrectness;
	}

	/**
	 * Compares user input with the correct answer for a memory table question
	 * @param question
	 * @param questionIndex
	 * @param response
	 * @param feedback
	 */
	verifyMemoryTableHelper(question: any, questionIndex : number, response: any, feedback : any) {
		let answer = question.answer;
    console.log(answer)
    console.log(response)
		if (typeof(answer) === "string") {
			answer = JSON.parse(answer);
		}
		Object.keys(response).forEach((variable) => {
			if (feedback[questionIndex] === "correct") {
				if(response.hasOwnProperty(variable)) {
					let values = response[variable];
					let valuesKey = answer[variable];
					let equal = this.arrayEquals(values, valuesKey);
					feedback[questionIndex] = equal ? "correct" : "incorrect";
				} else {
					feedback[questionIndex] = "incorrect";
				}
			}
		});
	}

	/**
	 *
	 * @param question
	 * @param questionIndex
	 * @param answer
	 * @param fIndex
	 * @param feedbackTemp
	 * @returns {boolean}
	 */
	verifyOtherQuestions(question: any, questionIndex: number, answer: any, fIndex: number, feedbackTemp: any, questionType: any) {
  	let checkerForCorrectness = true;

    // For writecode. // TODO refactor reused code
    if(questionType === Types.writeCode) {
      if (fIndex !== -1) {
        feedbackTemp[questionIndex] = feedbackTemp[questionIndex] ? feedbackTemp[questionIndex] : [];
      }
      let index = (fIndex === -1) ? questionIndex: fIndex;
      let temp = (fIndex === -1) ? feedbackTemp : feedbackTemp[questionIndex];
      let learnerAnswer = (fIndex === -1) ? answer[questionIndex] : answer[questionIndex][fIndex];
      let executedAnswer = this.runCode(learnerAnswer);
      let expectedAnswer = this.runCode(question.answer);
      if (executedAnswer === expectedAnswer) {
        temp[index] = 'correct';
      } else {
        temp[index] = 'incorrect';
        checkerForCorrectness = false;
      }
      if (fIndex === -1) {
        feedbackTemp = temp;
      } else {
        feedbackTemp[questionIndex] = feedbackTemp[questionIndex] ? feedbackTemp[questionIndex] : [];
        feedbackTemp[questionIndex] = temp;
      }
    } else {
      if (fIndex !== -1) {
        feedbackTemp[questionIndex] = feedbackTemp[questionIndex] ? feedbackTemp[questionIndex] : [];
      }
      let index = (fIndex === -1) ? questionIndex : fIndex;
      let temp = (fIndex === -1) ? feedbackTemp : feedbackTemp[questionIndex];
      let learnerAnswer = (fIndex === -1) ? answer[questionIndex].trim() : answer[questionIndex][fIndex].trim();
      if (question.answer === learnerAnswer) {
        temp[index] = "correct";
      } else {
        temp[index] = "incorrect";
        checkerForCorrectness = false;
      }
      if (fIndex === -1) {
        feedbackTemp = temp;
      } else {
        feedbackTemp[questionIndex] = feedbackTemp[questionIndex] ? feedbackTemp[questionIndex] : [];
        feedbackTemp[questionIndex] = temp;
      }
    }

		
		return checkerForCorrectness;
	}

    /**
   * runCode will run the code provided in a python interpreter (Skulpt)
   * Most of this code comes from Skulpt's examples. Documentation for this
   * will be in the docs folder.
   * @param code input python code as a string
   * @returns {string} python std output as a string
   */
  runCode(code: string): string {
    function builtinRead(x) {
      if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
          throw new Error("File not found: '" + x + "'");
      return Sk.builtinFiles["files"][x];
    }
    let output = [];
    Sk.configure({output: d => output.push(d), read: builtinRead});
    try {
      Sk.importMainWithBody("<stdin>", false, code);
    } catch(e) {
      return e.toString();
    }
    return output.join("").trim();
  }

  /**
   * updateWrongAnswersCount updates the count for wrong answers
   * @param {boolean} checkerForCorrectness correctness false or true
   * @param {number} questionIndex question index
   * @param {number} fIndex followup question index
   */
  updateWrongAnswersCount(checkerForCorrectness: boolean, questionIndex: number, fIndex: number) {
    var temp;
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
      let feedback = this.checkAnswer(answer, questionIndex, questionType, fIndex);
      ResponseEvaluator.evaluateAnswer(this.state.exercise, answer
          , () => { // TODO: Reconfigure for followup question answer structure
        this.setState({
          feedback: (fIndex === -1) ? feedback : this.state.feedback,
          followupFeedback: (fIndex === -1) ? this.state.followupFeedback : feedback,
          nextConcepts: this.getConcepts(),
          display: this.state.exercise.type !== 'survey'
              ? displayType.exercise
              : (this.state.conceptOptions > 1
                  ? displayType.concept
                  : displayType.exercise),
        });
      }, questionIndex, questionType, feedback, this.state.exerciseId);
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
    tempFeedback[questionIndex] = null;
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
					<Signup/>
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
					<AuthorView/>
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
														resetError={this.resetError}/>);
	}

	/**
	 * Sets the display state to 'signup'. This function is passed as a prop
	 * to the Sign in view
	 */
	switchToSignup() {
		this.setState({display: displayType.signup});
	}

  /**
   * Sets the display state to 'WORLD". This function is passed as a prop
   * to the the navigationbar.
   */
	switchToWorldView() {
	  this.setState({display: displayType.world, counter: 0, feedback: []}, () => {this.sendWorldViewDataToFirebase()});
  }

  clearCounterAndFeedback() {
    this.setState({counter: 0, feedback: []});
  }


	/**
	 * Renders the welcome view
	 * @returns {*}
	 */
  renderWelcome() {
    return (
        <Welcome app={this}/>
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
							toggleCodeTheme={(theme) => this.setState({codeTheme: theme})}
							timesGotQuestionWrong={this.state.timesGotQuestionWrong}
							followupTimesGotQuestionWrong={this.state.followupTimesGotQuestionWrong}
							nextQuestion={this.nextQuestion}
							resetFeedback={this.resetFeedback}
              clearCounterAndFeedback={this.clearCounterAndFeedback}
              sendExerciseViewDataToFirebase={this.sendExerciseViewDataToFirebase}
              exerciseId={this.state.exerciseId}
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
    return(
				<div>
					{this.renderNavBar()}
					<WorldView switchToWorldView={this.switchToWorldView} generateExercise={this.generateExercise} getInstruction={this.getInstruction}/>
				</div>
    )
  }

  /**
   * test method to render instruction view
   * @private
   */
  _renderInstructionView() {
    return(
    		<div>
					{this.renderNavBar()}
					<InstructionView conceptType={this.state.currentConcept}
													 readOrWrite={this.state.instructionType}
													 setError={this.setInstructionViewError}
													 generateExercise={this.props.generateExercise}
													 storeUserState={this.storeState}
                           clearCounterAndFeedback={this.clearCounterAndFeedback}/>
				</div>
		);
  }

	/**
	 * predefined routes within koconut
	 */
	renderDisplay() {
		return (
				<Router>
					<Switch>
						<Route exact path={Routes.home} component={() => this.renderSignin()}/>
						<Route exact path={Routes.signin} component={() => this.renderSignin()}/>
						<Route exact path={Routes.signup} component={() => this.renderSignup()}/>
						<Route exact path={Routes.welcome} component={() => this.renderWelcome()}/>
						<Route exact path={Routes.worldview} component={() => this.renderWorldView()}/>
						<Route exact path={Routes.author} component={() => this.renderAuthorView()}/>
						<Route exact path={Routes.instruction} component={() => this._renderInstructionView()}/>
						<Route exact path={Routes.practice} render={() => this.renderExercise()}/>
						<Redirect to={Routes.home} />
					</Switch>
				</Router>
		);
	}

	/**
	 * renders the nav bar component for the app
	 * @returns {*}
	 */
	renderNavBar() {
		return (<Navbar switchToWorldView={this.switchToWorldView}/>);
	}

  render() {
    return (
        <div className="App">
          <MuiThemeProvider theme={this.theme}>
            <div className="main">
              {this.renderDisplay()}
							{this.state.error && this.renderErrorMessage()}
            </div>
          </MuiThemeProvider>
				</div>
		);
	}
}

export default App;
