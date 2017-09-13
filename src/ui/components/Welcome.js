//@flow
import React, {Component} from 'react';
import './Welcome.css';

const strings = {
  welcome: "Welcome to Koconut!",
  intro: "This is an intelligent tutoring system for introductory programming. We'll keep track of your knowledge, make recommendations and provide hints. We also ask for honest and consistent feedback in the interest of making this learning experience collaborative.",
  use_cases: {
    title: "Use Cases",
    cases: ["Study for your test", "Review material", "Challenge yourself",
      "Infinite practice (WIP)"]
  },
  user_modes: {
    title: "User Modes",
    modes: ["Student driven (total freedom)",
      "Negotiated (we choose some, you choose some)",
      "Guided learning -- you're not sure what to study"]
  },
  language: {
    desc: "Language: Java",
    rationale: "We're using Java because it's the introductory language in University of Washington CS courses.",
    example_desc: "This is an example of Java code:",
    example_code: ["int x = 1337;", "System.out.println(\"Hi!\");", "System.out.println(\"My name is \" + x);"]
  },
  nsf: "this project is NSF funded",
  agreement: "I have read and understand the purposes of this program.",
  iagree: "I Agree"
}

class Welcome extends Component {
  // TODO: Maybe this should be a ReactMarkdown component
  render() {
    return (
      <div className="welcome-page">
        <h2>{strings.welcome}</h2>
        <p>{strings.intro}</p>
        <h4>{strings.use_cases.title}</h4>
        <ul>{strings.use_cases.cases.map((c) => <li>{c}</li>)}</ul>
        <h4>{strings.user_modes.title}</h4>
        <ol>{strings.user_modes.modes.map((m) => <li>{m}</li>)}</ol>
        <h4>{strings.language.desc}</h4>
        <p>{strings.language.rationale}</p>
        <h4>{strings.language.example_desc}</h4>
        {strings.language.example_code.map((c) => <div><code>{c}</code></div>)}
        <h4><i>{strings.nsf}</i></h4>
        <p>{strings.agreement}</p>
        <button onClick={this.props.callBack}>{strings.iagree}</button>
      </div>)
  }
}

export default Welcome;