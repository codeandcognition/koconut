// @flow
import React, {Component} from 'react';
import firebase from 'firebase/app';
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
import LoadingView from '../components/LoadingView';
import InstructionView from './InstructionView';

// Fake AJAX
import ExerciseGenerator from '../../../backend/ExerciseGenerator';
import ResponseEvaluator from '../../../backend/ResponseEvaluator';
import {ResponseLog} from '../../../data/ResponseLog';
import type {Exercise} from '../../../data/Exercises';

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
  switchToSignin: Function;
  switchToSignup: Function;
  generateExercise: Function;
  getInstruction: Function;
  setInstructionViewError: Function;
  resetError: Function;
  switchToWorldView: Function;
  switchToAuthorView: Function;
  loadDisplay: Function;
  generator: ExerciseGenerator;
  theme: mixed;
  updateWaiverStatus: Function;
  // updater: ResponseEvaluator;
  state: {
    exercise: Exercise,
		exerciseType: string,
		instructionType: string,
    feedback: string,
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
    conceptMapGetter: ?Map<string,number[]>
  };

  constructor() {
    super();
    this.generator = new ExerciseGenerator();
    this.theme = createMuiTheme();

    this.state = {
      exercise: this.generator.getStubExercise(),
			exerciseType: '', // yet to be defined
			instructionType: '',
      feedback: '',
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
      conceptMapGetter: null
    };
    // this.updater = new ResponseEvaluator();
    this.submitResponse = this.submitResponse.bind(this);
    this.submitConcept = this.submitConcept.bind(this);
    this.submitOk = this.submitOk.bind(this);
    this.submitTryAgain = this.submitTryAgain.bind(this);
    this.switchToSignin = this.switchToSignin.bind(this);
    this.switchToSignup = this.switchToSignup.bind(this);
    this.generateExercise = this.generateExercise.bind(this);
    this.getInstruction = this.getInstruction.bind(this);
    this.setInstructionViewError = this.setInstructionViewError.bind(this);
    this.resetError = this.resetError.bind(this);
    this.switchToWorldView = this.switchToWorldView.bind(this);
    this.loadDisplay = this.loadDisplay.bind(this);
    this.switchToAuthorView = this.switchToAuthorView.bind(this);
  }

  /**
   * Passed in as a prop to WorldView -> ConceptCard
   * When invoked in concept card, it generates an exercise of the given
   * concept and type
   *
   */
  generateExercise(concept: string, exerciseType: string) {
		let exercises = this.generator.getExercisesByTypeAndConcept(exerciseType, concept, this.state.exerciseList, this.state.conceptMapGetter);
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
				exercise: this.generator.getStubExercise(), // exercises[this.state.counter].exercise, // TODO: convert this for testing
				currentConcept: concept,
				exerciseType: exerciseType,
				error: false // resets the error message
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
	 *
	 */
	resetError() {
		this.setState({error: false});
	}

  /**
   * Returns a generated exercise by index
   * For DEBUG eyes only eyes 👀😭
   * @private
   * @returns the example exercise at the given index
   */
  _getExercise(): Exercise {
    return this.generator._generateExercise(this.state.counter);
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
    this.stopWatchingAuth = firebase.auth().onAuthStateChanged((fbUser) => {
      fbUser ?
          this.setState({firebaseUser: fbUser}) :
          this.setState({firebaseUser: null, display: displayType.signin});
    });
    this.stopWatchingAuth();
  }

	/**
	 * Returns a list of concepts relevant to the current concept
	 * @returns {*}
	 */
  getConcepts() {
    let size = this.state.conceptOptions;
    let concept = this.state.currentConcept;
    let ret;
    if (concept !== null && concept !== undefined) {
      ret = this.generator.getConceptsRelativeTo(concept);
    } else {
      ret = this.generator.getConcepts(size);
    }
    return ret;
  }

  /**
   * Submits the give answer to current exercise
   * @param answer - the answer being submitted
   */
  submitResponse(answer: string) {
    if (answer !== null && answer !== undefined) {
      ResponseEvaluator.evaluateAnswer(this.state.exercise, answer, () => {
        this.setState({
          feedback: ResponseLog.getFeedback(),
          nextConcepts: this.getConcepts(),
          display: this.state.exercise.type !== 'survey'
              ? displayType.feedback
              : (this.state.conceptOptions > 1
                  ? displayType.concept
                  : displayType.exercise),
        });
      });
    }
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

  submitTryAgain() {
    this.setState({
      display: displayType.exercise,
    });
  }

  renderLoadView() {
    return <LoadingView loadDisplay={() => this.loadDisplay()}/>
  }

	/**
	 * Checks whether the user is signed in, their waiver status, their
	 * permissions and changes the display type accordingly
	 *
	 */
	loadDisplay() {
    firebase.auth().onAuthStateChanged((fbUser) => {
      if (fbUser != null) {
        let databaseRef = firebase.database().ref("Users/" + fbUser.uid);
        databaseRef.once("value", (snapshot) => {
          console.log(snapshot.val());
        	if (snapshot !== null && snapshot.val() !== null) {
        		let waiverStatus = snapshot.val().waiverStatus;
        		let author = snapshot.val().permission === 'author';
        		if (waiverStatus) {
              this.setState({firebaseUser: fbUser, display: displayType.world})
            }
        		author ? this.setState({author: author}) : false;
					} else {
        	  this.setState({firebaseUser: fbUser, display: displayType.welcome});
          }
        });
        this.exerciseGetter = firebase.database().ref('Exercises');
        this.exerciseGetter.on('value', (snap) => {
          this.setState({exerciseList:snap.val()});
        });
        this.conceptMapGetter = firebase.database().ref('ConceptExerciseMap');
        this.conceptMapGetter.on('value', (snap) => {
          this.setState({conceptMapGetter: snap.val()});
        });
      } else {
        this.setState({
          display: displayType.signin,
          firebaseUser: fbUser
        });
      }
    });
  }

	/**
	 * Updates the user's waiver status upon signing up for an account
	 */
	updateWaiverStatus() {
    if (this.state.firebaseUser) {
      this.setState({display: displayType.world});
      let databaseRef = firebase.database()
				.ref("Users/" + this.state.firebaseUser.uid +
              "/waiverStatus");
      databaseRef.set(true);
    }
  }

  /**
   * Renders the sign up view
   */
  renderSignup() {
    if(this.state.firebaseUser) {
      this.setState({
        display: displayType.load
      });
    } else {
      return(
          <Signup toSignin={this.switchToSignin}/>
      );
    }
  }

	/**
	 * Renders the sign in view
	 */
	renderSignin() {
		if (this.state.firebaseUser) {
			this.setState({
				display: displayType.load
			});
		} else {
			return(
					<SignIn toSignup={this.switchToSignup} />
			);
		}
	}

	/**
	 * Remders the author view
	 */
	renderAuthorView() {
		return (<AuthorView></AuthorView>);
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
	 * Sets the display state to 'signin'. This function is passed as a prop
	 * to the Sign up view.
	 */
	switchToSignin() {
		this.setState({display: displayType.signin});
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
	  this.setState({display: displayType.world});
  }

	/**
	 * Sets the display state to 'AUTHOR'. This function is passed as a prop to
	 * to the NavBar
	 */
	switchToAuthorView() {
		this.setState({display: displayType.author});
	}

	/**
	 * Renders the welcome view
	 * @returns {*}
	 */
  renderWelcome() {
    return (
        <Welcome
        callBack={() => this.updateWaiverStatus()}
        firebaseUser={this.state.firebaseUser}
        app={this}/>
    );
  }

  /**
   * Renders the exercise view
   */
  renderExercise() {
    return (
        <ExerciseView
            exercise={this.state.exercise}
            submitHandler={this.submitResponse}
            feedback={this.state.feedback}
            nextConcepts={this.state.nextConcepts}
            submitOk={this.submitOk}
            submitTryAgain={this.submitTryAgain}
            mode={this.state.display}
            concept={this.state.currentConcept}
        />
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
        <WorldView generateExercise={this.generateExercise} getInstruction={this.getInstruction}/>
    )
  }

  /**
   * test method to render instruction view
   * @private
   */
  _renderInstructionView() {
    return(
        <InstructionView conceptType={this.state.currentConcept}
												 readOrWrite={this.state.instructionType}
												 setError={this.setInstructionViewError}/>
    )
  }

	/**
	 * Renders the display based on display state
	 */
	renderDisplay() {
		switch (this.state.display) {
			case displayType.signin:
				return this.renderSignin();
			case displayType.signup:
				return this.renderSignup();
			case displayType.welcome:
				return this.renderWelcome();
			case displayType.exercise:
			case displayType.feedback:
				return this.renderExercise();
			case displayType.concept:
				return this.renderConceptSelection();
      case displayType.world:
        return this.renderWorldView();
      case displayType.load:
        return this.renderLoadView();
      case displayType.instruct:
        return this._renderInstructionView();
			case displayType.author:
				return this.renderAuthorView();
			default:
				break;
		}
	}

  render() {
    return (
        <div className="App">
          <MuiThemeProvider theme={this.theme}>
            <Navbar firebaseUser={this.state.firebaseUser}
                    switchToWorldView={this.switchToWorldView}
										switchToAuthorView={this.switchToAuthorView}
                    display={this.state.display}
										author={this.state.author}/>
            <div className="main">
              <h1 className="title">
								{/*
                {this.state.display !== displayType.welcome ?
										<Button
												style={{marginTop: '5%'}}
												variant="outlined"
												color="secondary"
												onClick={() => this.setState(
														{
															display: displayType.exercise,
															exercise: this._getExercise(),
															feedback: '',
															counter: this.state.counter + 1,
														})}
										>Next Exercise</Button>
										: null
								}
								*/}
              </h1>
							{/*this.state.error &&
							<div className="alert alert-warning alert-dismissible fade show" role="alert" style={{marginTop: '5%'}}>
								<div>{this.state.errorMessage}</div>
								<button type="button"
												className="close"
												aria-label="Close"
												onClick={() => this.setState({error: false})}>
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							*/}
              {this.renderDisplay()}
							{this.state.error && this.renderErrorMessage()}
            </div>
          </MuiThemeProvider>
				</div>
		);
	}
}

export default App;
