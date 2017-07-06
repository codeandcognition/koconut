// @flow
import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

/**
 * This is a component.
 * @class
 */
class App extends Component {
  test(a: number, b: number): number {
    let x: number = a + b;
    return x;
  }

  /**
   * Greetings globe!
   */
  render() {
    return (
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <h2>Welcome to React</h2>
          </div>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
            This is a test {this.test(1, 2)}
          </p>
        </div>
    );
  }
}

export default App;
