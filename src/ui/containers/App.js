// @flow
import React, {Component} from 'react';

import './App.css';
import ExerciseView from './ExerciseView';

// Fake AJAX
import ExerciseGenerator from '../../backend/ExerciseGenerator';
import ResponseEvaluator from '../../backend/ResponseEvaluator';
import {ResponseLog} from '../../data/ResponseLog';
import ExercisePool from '../../data/ExercisePool';
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
    nextConcepts: string
  };

  constructor() {
    super();

    this.generator = new ExerciseGenerator();

    this.state = {
      exercise: this.generator.generateExercise(),
      feedback: '',
      nextConcepts: ''
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
   * Submits the give answer to current exercise
   * @param answer - the answer being submitted
   */
  submitResponse(answer: string) {
    ResponseEvaluator.evaluateAnswer(this.state.exercise, answer);
    console.log(ExercisePool.pool);
    this.setState({
      feedback: ResponseLog.getFeedback(),
      nextConcepts: ExercisePool.pool.entries()
    });
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
                        exercise: this.getExercise(),
                        feedback: ''
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