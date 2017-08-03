// @flow
import React, {Component} from 'react';

import './App.css';
import ExerciseView from './ExerciseView';

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

/**
 * Renders the koconut application view.
 * @class
 */
class App extends Component {
  submitResponse: Function;
  generator: ExerciseGenerator;
  // updater: ResponseEvaluator;

  state: {
    exercise: Exercise,
    feedback: string,
    nextConcepts: string,
    counter: number // TODO: DEBUG
  };

  constructor() {
    super();

    this.generator = new ExerciseGenerator();

    this.state = {
      exercise: this.generator.generateExercise(),
      feedback: '',
      nextConcepts: '',
      counter: 0
    };

    // this.updater = new ResponseEvaluator();
    this.submitResponse = this.submitResponse.bind(this);
  }

  /**
   * Sets the initial exercise on load
   */
  componentWillMount() {
    this.setState({exercise: this.getExercise()});
  }

  /**
   * Return a generated exercise
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
        nextConcepts: this.generator.getConcepts(3).toString(),
        exercise: this.getExercise()
      });
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

            <ExerciseView
                exercise={this.state.exercise}
                submitHandler = {this.submitResponse}
                feedback = {this.state.feedback}
                nextConcepts = {this.state.nextConcepts}
            />
          </div>
        </div>
    );
  }
}

export default App;