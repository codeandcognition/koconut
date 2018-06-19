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


// Fake AJAX
import ExerciseGenerator from '../../backend/ExerciseGenerator';
import ResponseEvaluator from '../../backend/ResponseEvaluator';
import {ResponseLog} from '../../data/ResponseLog';
//import Concepts from '../../backend/Concepts';
import type {Exercise} from '../../data/Exercises';
import typeof FirebaseUser from 'firebase';
// Display type enum
const displayType = {
	signup: 'SIGNUP',
	signin: 'SIGNIN',
	welcome: 'WELCOME',
	exercise: 'EXERCISE',
	feedback: 'FEEDBACK',
	concept: 'CONCEPT',
  world: 'WORLD'
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
  generator: ExerciseGenerator;
  theme: mixed;
  // updater: ResponseEvaluator;
  state: {
    exercise: Exercise,
    feedback: string,
    nextConcepts: string[],
    counter: number,
    display: string, // the current display state
    conceptOptions: number, // concept options offered, no options if <= 1
    currentConcept: ?string,
    firebaseUser: ?FirebaseUser
  };
  constructor() {
    super();
    this.generator = new ExerciseGenerator();
    this.theme = createMuiTheme();

    this.state = {
      exercise: this.generator.generateExercise(),
      feedback: '',
      nextConcepts: [],
      counter: 1,
      display: displayType.signin, // TODO: Change this to sign in
      conceptOptions: 4, //TODO: Make this not hard coded
      currentConcept: null,
      firebaseUser: null
    };
    // this.updater = new ResponseEvaluator();
    this.submitResponse = this.submitResponse.bind(this);
    this.submitConcept = this.submitConcept.bind(this);
    this.submitOk = this.submitOk.bind(this);
    this.submitTryAgain = this.submitTryAgain.bind(this);
    this.switchToSignin = this.switchToSignin.bind(this);
    this.switchToSignup = this.switchToSignup.bind(this);
  }
  /**
   * Return a generated exercise
   * TODO: Remove, this is redundant?
   * @returns a generated exercise
   */
  getExercise(): Exercise {
    return this.generator.generateExercise();
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
   */
  componentDidMount() {
      this.stopWatchingAuth = firebase.auth().onAuthStateChanged((fbUser) => {
          fbUser ?
            this.setState({firebaseUser: fbUser}) :
            this.setState({firebaseUser: null, display: displayType.signin});
      });

  }
  /**
   * Un app un-mount, stop watching authentication
   */
  componentWillUnmount() {
    this.stopWatchingAuth();
  }
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
          // exercise: this.generator.generateExercise(this.state.currentConcept),
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
      this.setState({
        currentConcept: concept,
        exercise: this.generator.generateExercise(concept),
        display: displayType.exercise,
      });
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
  /**
   * Renders the sign up view
   */
  renderSignup() {
    if(this.state.firebaseUser) {
      this.setState({
        display: displayType.welcome
      });
    } else {
      return(
          <Signup toSignin={this.switchToSignin}/>
      );
    }
  }

	/**
	 *
	 */
	renderSignin() {
		if(this.state.firebaseUser) {
			this.setState({
				display: displayType.welcome
			});
		} else {
			return(
					<SignIn toSignup={this.switchToSignup}/>
			);
		}
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
	 * Renders the welcome view
	 * @returns {*}
	 */
  renderWelcome() {
    return (
        <Welcome
            callBack={() => this.setState({display: displayType.world})}/>
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
        <WorldView />
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
			default:
				break;
		}
	}

  render() {
    return (
        <div className="App">
          <MuiThemeProvider theme={this.theme}>
            <Navbar firebaseUser={this.state.firebaseUser} />
            <div className="main">
              <h1 className="title">
                {(this.state.display !== displayType.signin) && (this.state.display !== displayType.signup) ?
                    <span className="debug">
                  <input
                      type="button"
                      onClick={() => this.setState(
                          {
                            exercise: this._getExercise(),
                            feedback: '',
                            counter: this.state.counter + 1,
                          })}
                      value="next exercise type"
                  />
                </span> : ''}
              </h1>
              {this.renderDisplay()}
            </div>
          </MuiThemeProvider>
				</div>
		);
	}
}

export default App;
