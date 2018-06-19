import React, {Component} from 'react';
import  FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import firebase from 'firebase/app';
import 'firebase/auth';

class Signup extends Component {
	constructor(props) {
		super(props);
	}

	handleSubmit(evt) {
		evt.preventDefault();
		console.log(this.state);
		firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
		.then(user => {
			return user.updateProfile({displaName: this.state.displayName});
		}).catch(err => this.setState({
			errorMessage: err.message,
			errCode: err.code
		}));
	}

	render() {
		return(
				<FormGroup style={{maxWidth: '50vh', margin: 'auto'}}>
					<h1 style={{margin: 'auto'}}>Koconut</h1>
					<img style={{width: "10vh", margin: 'auto'}} src={"https://i.pinimg.com/originals/bd/87/87/bd8787a601af7682d857f6c365d4421b.png"} alt={"cocount"} />
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
							onClick={evt => this.handleSubmit(evt)}>Create account</Button>
					{/* Sign in link is styled to go along with Material UI's styles */}
					<p style={{cursor: 'pointer', color: '#E91E63', textAlign: 'center'}} onClick={evt => this.props.toSignin()}>Sign in instead</p>
				</FormGroup>
		);
	}
}

export default Signup;