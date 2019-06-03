//@flow
import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import './Welcome.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import Routes from './../../../Routes';
import LoadingView from './LoadingView';

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
		desc: "Language: Python",
		rationale: "We're using Python because it is lightweight and commonly used as an introductory computer science course programming language.",
		example_desc: "This is an example of Python code:",
		example_code: ["x = 1337", "print(\"Hi!\")", "print(\"My name is \" + x)"]
	},
	nsf: "this project is NSF funded",
	agreement: "I have read and understand the purposes of this program. I understand that my usage data will be logged and anonymized. For preliminary tests, I understand that I can request to have my data deleted.",
	iagree: "I Agree"
}

const Categories = {
	read: "READ",
	write: "WRITE"
}

const Fields = {
	init: "init",
	pKnown: "pKnown"
}

class Welcome extends Component {
	// TODO: Maybe this should be a ReactMarkdown component
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			user: {}
		}
	}

	componentWillMount() {
		this.authUnsub = firebase.auth().onAuthStateChanged(user => {
			if (user) {
				this.setState({ user: user });
				// verify waiver status
				let databaseRef = firebase.database().ref("Users/" + user.uid + "/waiverStatus");
				databaseRef.once("value", (snapshot) => {
					if (snapshot != null && snapshot.val()) {
						this.props.history.push(Routes.worldview);
					}
				});
			} else {
				this.props.history.push(Routes.signin);
			}
		});
	}

	componentDidMount() {
		this.mounted = true;
		if (this.mounted && firebase.auth().currentUser) {
			this.setState({ loading: false, firebaseUser: firebase.auth().currentUser });
		}
	}

	componentWillUnmount() {
		this.authUnsub();
		this.mounted = false;
	}

	/**
	 * update waiver status on firebase
	 */
	updateWaiverStatus() {
		let databaseRef = firebase.database()
			.ref("Users/" + this.state.firebaseUser.uid + "/waiverStatus");
		databaseRef.set(true);
		this.setDefaultPknowns();
		this.props.history.push(Routes.worldview);
	}

	// intializes user's bktParams using concept params 
	setDefaultPknowns() {
		let conceptMapGetter = firebase.database().ref('ConceptExerciseMap');
		let userRef = firebase.database().ref(`/Users/${this.state.user.uid}/bktParams`);
		conceptMapGetter.on('value', (snap) => {
			let userBKTParams = {};
			let concepts = snap.val();
			Object.keys(concepts).forEach(concept => {
				let conceptInfo = concepts[concept]["bktParams"];
				let userCentric = {};
				userCentric[Categories.read] = {[Fields.pKnown]: conceptInfo[Categories.read][Fields.init]};
				userCentric[Categories.write] = { [Fields.pKnown]: conceptInfo[Categories.write][Fields.init] };	
				userBKTParams[concept] = userCentric;
			});
			userRef.set(userBKTParams)
				.catch((e) => {
					window.alert(e);
				})
		});
	}

	render() {
		let welcomeStyle = {
			marginTop: "15vh"
		};

		return (
			<div>
				{
					this.state.loading ?
						<LoadingView /> :
						<div style={welcomeStyle} className="welcome-page">
							<h2>{strings.welcome}</h2>
							<p>{strings.intro}</p>
							<h4>{strings.use_cases.title}</h4>
							<ul>{strings.use_cases.cases.map((c, i) => <li key={i}>{c}</li>)}</ul>
							<h4>{strings.user_modes.title}</h4>
							<ol>{strings.user_modes.modes.map((m, i) => <li key={i}>{m}</li>)}</ol>
							<h4>{strings.language.desc}</h4>
							<p>{strings.language.rationale}</p>
							<h4>{strings.language.example_desc}</h4>
							{strings.language.example_code.map((c, i) => <div key={i}><code>{c}</code></div>)}
							<h4><i>{strings.nsf}</i></h4>
							<p>{strings.agreement}</p>
							<button onClick={() => this.updateWaiverStatus()}>{strings.iagree}</button>
						</div>
				}
			</div>
		)
	}
}

export default withRouter(Welcome);