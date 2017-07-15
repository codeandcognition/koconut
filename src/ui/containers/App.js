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

  render() {
    return (
        <div className="App">
          <Problem question={exampleQuestions[3]}/>
        </div>
    );
  }
}

export default App;
