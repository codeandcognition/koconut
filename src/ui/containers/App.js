// @flow
import React, {Component} from 'react';
import './App.css';
import Exercise from './Exercise';

import {exampleQuestions} from '../../backend/Questions.js';

/**
 * Renders the koconut application view.
 * @class
 */

class App extends Component {
  state: {
    questionID: number
  };

  constructor() {
    super();
    this.state = {
      questionID: 0,
    };
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
                        questionID: ((this.state.questionID + 1) %
                            exampleQuestions.length),
                      })}
                  value="next question type"
              />
            </span>
            </h1>

            <Exercise question={exampleQuestions[this.state.questionID]}/>
          </div>
        </div>
    );
  }
}

export default App;