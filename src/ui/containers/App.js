// @flow
import React, {Component} from 'react';
import './App.css';
import Problem from './Problem';

import Questions from '../../backend/Questions.js'

/**
 * This is a component.
 * @class
 */
class App extends Component {

  render() {
    return (
        <div className="App">
          <Problem question={Questions.exampleQuestions[3]}/>
        </div>
    );
  }
}

export default App;
