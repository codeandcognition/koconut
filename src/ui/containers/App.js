// @flow
import React, {Component} from 'react';

import './App.css';
import ExerciseView from './ExerciseView';
import ConceptSelection from '../components/ConceptSelection';

// Fake AJAX
import ExerciseGenerator from '../../backend/ExerciseGenerator';
import ResponseEvaluator from '../../backend/ResponseEvaluator';
import {ResponseLog} from '../../data/ResponseLog';
//import Concepts from '../../backend/Concepts';

type Exercise = {
  prompt: string,
  code: string,
  choices?: string[],
  difficulty: number,
  type: string,
  concept: string
  // exerciseID: string
}

// Display type enum
const displayType = {
  exercise: 'EXERCISE',
  feedback: 'FEEDBACk',
  concept: 'CONCEPT',
};

/**
 * Renders the koconut application view.
 * @class
 */
class App extends Component {
  submitResponse: Function;
  submitConcept: Function;
  generator: ExerciseGenerator;
  // updater: ResponseEvaluator;

  state: {
    exercise: Exercise,
    feedback: string,
    nextConcepts: string[],
    counter: number,
    display: string, // the current display state
    conceptOptions: number, // concept options offered, no options if <= 1
    currentConcept: ?string
  };

  constructor() {
    super();

    this.generator = new ExerciseGenerator();

    this.state = {
      exercise: this.generator.generateExercise(),
      feedback: '',
      nextConcepts: [],
      counter: 1,
      display: displayType.exercise,
      conceptOptions: 3,
      currentConcept: null
    };

    // this.updater = new ResponseEvaluator();
    this.submitResponse = this.submitResponse.bind(this);
    this.submitConcept = this.submitConcept.bind(this);
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
   * For DEBUG eyes only eyes 👀
   * @private
   * @returns the example exercise at the given index
   */
  _getExercise(): Exercise {
    return this.generator._generateExercise(this.state.counter);
  }

  /**
   * Submits the give answer to current exercise
   * @param answer - the answer being submitted
   */
  submitResponse(answer: string) {
    if(answer !== null && answer !== undefined) {
      ResponseEvaluator.evaluateAnswer(this.state.exercise, answer);
      // console.log(ExercisePool.pool);
      this.setState({
        feedback: ResponseLog.getFeedback(),
        nextConcepts: this.generator.getConcepts(this.state.conceptOptions),
        exercise: this.generator.generateExercise(this.state.currentConcept),
        display: this.state.conceptOptions > 1
               ? displayType.concept
               : displayType.exercise
      });
    }
  }

  /**
   * Submits the given concept
   * @param concept - the concept being submit
   */
  submitConcept(concept: string){
    if(concept !== null && concept !== undefined) {
      this.setState({
        exercise: this.generator.generateExercise(concept),
        display: displayType.exercise
      })
    }
  }
  
  /**
   * Renders the exercise view
   */
  renderExercise() {
    return (
        <ExerciseView
            exercise={this.state.exercise}
            submitHandler = {this.submitResponse}
            feedback = {this.state.feedback}
            nextConcepts = {this.state.nextConcepts}
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
   * Renders the display based on display state
   */
  renderDisplay() {
    switch(this.state.display) {
      case displayType.exercise:
        return this.renderExercise();
      case displayType.concept:
        return this.renderConceptSelection();
      default:
        break;
    }
  }

  render() {
    return (
        <div className="App">
          <div className="main">
            <h1 className="title">Welcome to the koconut demo!
              <span className="debug">
                <input
                    type="button"
                    onClick={() => this.setState(
                        {
                          exercise: this._getExercise(),
                          feedback: '',
                          counter: this.state.counter + 1
                        })}
                    value="next exercise type"
                />
              </span>
            </h1>
            {this.renderDisplay()}
          </div>
        </div>
    );
  }
}

export default App;