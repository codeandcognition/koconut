import React, {Component} from 'react';
import  FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import firebase from 'firebase/app';
import 'firebase/auth';

class Signup extends Component {
  constructor(props) {
    super(props);
    // this.handleSubmit = this.handleSubmit.bind(this);
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
        <FormGroup>
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
    type="submit"
    variant="flat"
    color="primary"
    onClick={evt => this.handleSubmit(evt)}>Create account</Button>
    </FormGroup>
  );
  }
}

export default Signup;