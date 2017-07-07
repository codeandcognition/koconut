// @flow
import React, {Component} from 'react';
import './App.css';
import Problem from './Problem';

/**
 * This is a component.
 * @class
 */
class App extends Component {
  test(a: number, b: number): number {
    let x: number = a + b;
    return x;
  }

  /*
   TODO: Questions need types.
   Assume we'll have these question types as property of some question object:
   WriteCode
   FillBlank
   MultipleChoice
   ShortResponse
   HighlightCode
   */

  render() {
    var testQuestion = {
      content: 'What is the value of x after code execution?',
      type: 'MultipleChoice',
      answers: ['0', '5', '10', '100']
    };
    return (
        <div className="App">
          { /* TODO: not hard-code type value */ }
          <Problem question={testQuestion}/>
        </div>
    );
  }
}

export default App;
