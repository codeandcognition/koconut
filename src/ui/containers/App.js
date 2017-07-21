// @flow
import React, {Component} from 'react';
import './App.css';
import Exercise from './Exercise';

// Fake AJAX
import ExerciseGenerator from '../../backend/ExerciseGenerator';
import ModelUpdater from '../../backend/ModelUpdater';
import Concepts from '../../backend/Concepts';

/**
 * Renders the koconut application view.
 * @class
 */

class App extends Component {
  submitResponse: Function;
  generator: ExerciseGenerator;

  state: {
    question: ?number
  };

  constructor() {
    super();
    this.state = {
      question: null
    };

    this.generator = new ExerciseGenerator();
    this.submitResponse = this.submitResponse.bind(this);
  }

  componentWillMount() {
    this.setState({question: this.getExercise()});
  }

  // Fake AJAX
  getExercise() {
    return this.generator.generateExercise();
  }

  submitResponse(answer: string) {
    console.log(answer);
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
                        question: this.getExercise(),
                      })}
                  value="next question type"
              />
            </span>
            </h1>

            <Exercise
                question={this.state.question}
                submitHandler = {this.submitResponse}
            />
          </div>
        </div>
    );
  }
}

export default App;