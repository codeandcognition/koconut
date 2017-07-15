// @flow
import React, {Component} from 'react';
import './App.css';
import Problem from './Problem';

import {exampleQuestions} from '../../backend/Questions.js';

/**
 * This is a component.
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
          <Problem question={exampleQuestions[this.state.questionID]}/>
          <div className="Debug">
            <input
                type="button"
                onClick={() => this.setState(
                    {
                      questionID: ((this.state.questionID + 1) %
                      exampleQuestions.length),
                    })}
                value="Debug: Toggle Question"
            />
          </div>
        </div>
  );
  }
  }

  export default App;
