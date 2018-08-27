import React, {Component} from 'react';
import { Link, withRouter } from "react-router-dom";
import Routes from './../../../Routes';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import firebase from 'firebase/app';
import LoadingView from './LoadingView';
import 'firebase/auth';

type Props = {
	toSignin: Function
}

class Signup extends Component {
	constructor(props: Props) {
		super(props);
		this.state = {
			loading: true,
			email: "",
			password: "",
			confirmation: ""
		}; // need this declaration here, render crashes otherwise
	}

	componentDidMount() {
		this.authUnsub = firebase.auth().onAuthStateChanged(user => {
			this.setState({ currentUser: user, loading: false }, () => {
				if (user) {
					this.props.history.push(Routes.signin);
				} else {
					this.props.history.push(Routes.signup);
				}
			});
		});

	}

	componentWillUnmount() {
		this.authUnsub();
	}

	/**
	 * Creates a Firebase user account if user info is acceptable,
	 * displays a warning otherwise
	 */
	handleSubmit(evt) {
		evt.preventDefault();
		let mismatch = this.state.password !== this.state.confirmation;
		this.setState({errorMessage: "", errCode: ""});
		if (!mismatch) {
			firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
			.then(user => {
        let uid = user.user.uid;
        if(uid) {
          firebase.database().ref(`/Users/${uid}/Data/SessionEvents`).push({
            type: "start",
            timestamp: firebase.database.ServerValue.TIMESTAMP
          });
        }
				return user.updateProfile({displayName: this.state.displayName});
			})
			.then(this.state.currentUser ? () => this.props.history.push(Routes.signin) : null)
			.catch((error) => {
				this.setState({
					errorMessage: error.message,
					errCode: error.code
				});
			});
		} else {
			this.setState({mismatch: mismatch});
		}
	}

	/**
	 * renders the sign up form
	 */
	renderForm() {
		return (
				<div>
					<div style={{textAlign: "center", padding: "10vw"}} className="container">
						<h1>Koconut</h1>
						<img style={{width: "10vh", margin: 'auto'}}
								 src={"https://i.pinimg.com/originals/bd/87/87/bd8787a601af7682d857f6c365d4421b.png"}
								 alt={"cocount"} />
						<h3>a tutor to help you learn</h3>
						<form>
							<FormGroup style={{maxWidth: '50vh', marginLeft: 'auto', marginRight: 'auto'}}>
								{this.state.errCode ?
										<p className="alert alert-danger"
											 style={{marginTop: '3%', marginBottom: '0%'}}>{this.state.errorMessage}</p>
										:
										null
								}
								<TextField
										id="displayName"
										type="text"
										label="Display name"
										placeholder="Enter your display name"
										onInput={evt => this.setState({displayName: evt.target.value})}/>
								<TextField
										id="email"
										type="email"
										label="Email Address"
										placeholder="Enter your email address"
										onInput={evt => this.setState({email: evt.target.value})}/>
								{this.state.mismatch ? <p className="alert alert-warning"
																					style={{marginTop: '3%', marginBottom: '0%'}}>Make sure your passwords match</p> : null}
								<TextField
										id="password"
										type="password"
										label="Password"
										placeholder="Enter your password"
										onInput={evt => this.setState({password: evt.target.value})}/>
								<TextField
										id="confirmPassword"
										type="password"
										label="Confirm Password"
										placeholder="Re-enter your password"
										onInput={evt => this.setState({confirmation: evt.target.value})}/>
								<Button
										style={{marginTop: '5%', width: '30vh', marginLeft: 'auto', marginRight: 'auto'}}
										type="submit"
										variant="outlined"
										onClick={(evt) => this.handleSubmit(evt)}>Create account</Button>
								{/* Sign in link is styled to go along with Material UI's styles */}
								<Link to={Routes.signin}><p style={{cursor: 'pointer', color: '#E91E63', textAlign: 'center'}}>Sign in instead</p></Link>
							</FormGroup>
						</form>
					</div>
				</div>
		);
	}

	render() {
		return(
				<div>
					{this.state.loading ? <LoadingView/> : this.renderForm()}
				</div>
		);
	}
}

export default withRouter(Signup);