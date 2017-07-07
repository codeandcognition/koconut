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

  render() {
    // Sorry excuse for a backend
    let questionTypes = ['WriteCode', 'FillBlank', 'HighlightCode', 'MultipleChoice', 'ShortResponse'];
    let testQuestion = {
      content: 'What is the value of x after code execution?',
      code: 'int x = 1;',
      type: questionTypes[3],
      answers: ['1', '5', '10', '100']
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
