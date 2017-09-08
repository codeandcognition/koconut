//@flow
import React, {Component} from 'react';
import './Welcome.css';

class Welcome extends Component {

  render() {
    return (
      <div className="welcome-page">
        <h2>Welcome to Koconut!</h2>

        <p>
          This is an intelligent tutoring system.
          We're doing this to help you learn introductory programming.
          We'll keep track of your knowledge, and make recommendations.
          We also ask for your feedback in the interest of making this learning experience collaborative.
        </p>

        <h4>Use Cases:</h4>
        <ul>
          <li>Study for your test</li>
          <li>Review material</li>
          <li>Challenge yourself</li>
          <li>Infinite practice (WIP)</li>
        </ul>

        <h4>User Modes</h4>
        <ol>
          <li>Student driven -- total freedom</li>
          <li>Negotiated -- we choose some, you choose some</li>
          <li>Guided learning -- you're not sure what to study</li>
        </ol>

        <h4>Language: Java</h4>
        <p>We're using Java because it's the introductory language in University of Washington CS courses.</p>

        <h4>This is an example of Java code:</h4>

        <code>int x = 1337;</code><br/>
        <code>System.out.println("So " + x);</code>

        <h4>
          <i>this project is NSF funded</i>
        </h4>

        <p>I have read and understand the purposes of this program.</p>
        <button onClick={this.props.callBack}>I Agree</button>
      </div>)
  }
}

export default Welcome;