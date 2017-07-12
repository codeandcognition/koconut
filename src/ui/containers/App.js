// @flow
import React, {Component} from 'react';
import './App.css';
import Problem from './Problem';

import {Questions} from '../../backend/ExampleQuestions.js'

/**
 * This is a component.
 * @class
 */
class App extends Component {

  render() {
    return (
        <div className="App">
          <Problem question={Questions.exampleQuestions[0]}/>
        </div>
    );
  }
}

export default App;
