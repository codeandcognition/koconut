import React, {Component} from 'react';
import './App.css';
import Problem from './Problem';

/**
 * This is a component.
 */
class App extends Component {

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
    return (
        <div className="App">
          { /* TODO: not hardcode type value */ }
          <Problem type="WriteCode"/>
        </div>
    );
  }
}

export default App;
