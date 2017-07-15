// @flow
import React, {Component} from 'react';
import './App.css';
import Problem from './Problem';

import {exampleQuestions} from '../../backend/Questions.js';

/**
 * Renders the koconut application view.
 * @class
 */

class App extends Component {

  render() {
    return (
        <div className="App">
          <div className="main">
            <h1 className="title">Welcome to the koconut demo!</h1>
            <Problem question={exampleQuestions[2]}/>
          </div>
        </div>
    );
  }
}

export default App;
