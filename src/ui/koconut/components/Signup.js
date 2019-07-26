import React, {Component} from 'react';
import { Link, withRouter } from "react-router-dom";
import Routes from './../../../Routes';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import firebase from 'firebase/app';
import LoadingView from './LoadingView';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Homepage from './Homepage/Homepage';
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
      confirmation: "",
      accessCode: "", // code to specify condition
      accessCodeVisible: false, // if true, textbox asking for access code appears
      accessCodeInvalid: false,
      userExperienceError: false,
      userExperience: "" // response to "I am..." question
		}; // need this declaration here, render crashes otherwise
  }
  
  CONDITIONS = {
    C1: "C1",
    E1: "E1",
    C2: "C2",
    INVALID: "INVALID"
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

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
	/**
	 * Creates a Firebase user account if user info is acceptable,
	 * displays a warning otherwise
	 */
	handleSubmit(evt) {
		evt.preventDefault();
		let mismatch = this.state.password !== this.state.confirmation;
    this.setState({errorMessage: "", errCode: "", userExperienceError: false}); // unclear why userExperienceError being set to false here, esp. with it being checked a few lines later. race condition!
    
    let condition = this.determineCondition(this.state.accessCode);

    if(mismatch) { // ensure passwords match
      this.setState({mismatch});
    } else if(this.state.userExperience === "") { // ensure experience selected
      this.setState({userExperienceError: true});
    } else if(condition == this.CONDITIONS.INVALID){ // ensure access code is valid
      this.setState({accessCodeInvalid: true});
    } else {
      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(user => {
          let uid = user.user.uid;
          if(uid) {
            firebase.database().ref(`/Users/${uid}/Data/SessionEvents`).push({
              type: "start",
              timestamp: firebase.database.ServerValue.TIMESTAMP
            });
            firebase.database().ref(`/Users/${uid}/userExperience`).set(this.state.userExperience);
            firebase.database().ref(`/Users/${uid}/condition`).set(condition);
          }
          this.setState({currentUser: user});
          return user.updateProfile({displayName: this.state.displayName});
        })
        .then(this.state.currentUser ? () => this.setState({loading: false}, () => {
          this.props.history.push(Routes.signin)
        }) : null)
        .catch((error) => {
          this.setState({
            errorMessage: error.message,
            errCode: error.code
          });
        });
    }
  }
  
  /**
   * Given access code which is either string or null, determine the condition
   * if accessCode is a string which can be cast to an integer, then do the following based on the result % primeNum:
   * {3: "C1", 5: "E1", 7: "C2", else: "INVALID"}
   * else: return random condition
   */
  determineCondition(accessCode, primeNum=47){
    if(accessCode) {
      if(!isNaN(accessCode)) {
        switch(Number(accessCode) % primeNum) {
          case 3: 
            return this.CONDITIONS.C1;
          case 5:
            return this.CONDITIONS.E1;
          case 7:
            return this.CONDITIONS.C2;
          default:
            return this.CONDITIONS.INVALID;
        }
      } else return this.CONDITIONS.INVALID;
    }

    // base case: no access code submitted => random option
    let randInt = Math.floor(Math.random()*Object.keys(this.CONDITIONS).length); // random int in range of Object.keys(CONDITIONS)
    return this.CONDITIONS[Object.keys(this.CONDITIONS)[randInt]]; // random option
  }

	/**
	 * renders the sign up form
	 */
	renderForm() {
    let buttonStyle = {
			marginBottom: "15px",
      textAlign: 'center',
      marginRight: '5%',
      marginTop: 10
		};
		return (
				<div>
					<div style={{textAlign: "center", padding: "10vw", width: '100%'}} className="container">
            <Homepage>
              <div style={{backgroundColor: 'white',
                border: "1px solid #4054B2",
                borderRadius: 10}}>

                <form style={{width: '100%'}}>
                  <FormGroup style={{width: '90%',  margin: 'auto'}}>
                  <h1 style={{textAlign: 'left', marginTop: 30, fontSize: 25}}>Sign up to start learning!</h1>
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
                    {this.state.userExperienceError ? <p className="alert alert-warning"
                                              style={{marginTop: '3%', marginBottom: '0%'}}>You must select one of the options below</p> : null}
                    
                    <FormControl style={{marginTop: 10, textAlign: 'center'}}>
                      <InputLabel htmlFor="userExperience_">I am...</InputLabel>
                      <Select
                        value={this.state.userExperience}
                        onChange={this.handleChange}
                        inputProps={{
                          name: 'userExperience',
                          id: 'userExperience_',
                        }}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={"NEW"}>new to programming</MenuItem>
                        <MenuItem value={"NEWPYTHON"}>a programmer learning python</MenuItem>
                        <MenuItem value={"STUDENT"}>student reviewing for a midterm or test</MenuItem>
                        <MenuItem value={"PROGRAMMEROLD"}>programmer that hasn't used python in a while</MenuItem>
                      </Select>
                    </FormControl>

                    {this.state.accessCodeVisible && this.state.accessCodeInvalid ? <p className="alert alert-warning"
                      style={{marginTop: '3%', marginBottom: '0%'}}>Sorry, the access code is invalid. Please submit another one, or leave it blank.</p> : null}
                      
                    {this.state.accessCodeVisible ?
                      <TextField
                        id="accessCode"
                        type="text"
                        label="access code (optional)"
                        placeholder="Enter access code"
                        onInput={evt => this.setState({accessCode: evt.target.value})} 
                      />
                    :
                      <span style={{width:'100%', textAlign: 'left'}}>
                        <Button onClick={() => {this.setState({accessCodeVisible: true})}}>
                          <small>I have an access code.</small>
                        </Button>
                      </span>
                    }
                    
                  </FormGroup>
                  <div style={{width: '100%', textAlign: 'right'}}>
                    <Button style={buttonStyle}
                        variant={"contained"}
                        color={"primary"}
                        onClick={(evt) => this.handleSubmit(evt)}>Create account</Button>
                  </div>
                </form>
              </div>
              {/* Sign in link is styled to go along with Material UI's styles */}
              <p style={{textAlign: 'left', marginLeft: '2%', marginTop: '2%'}}>Already have an account? <Link to={Routes.signin}>
                <span>
                  Sign in instead
                </span>
              </Link></p>
              {this.state.errCode ?
                  <p className="alert alert-danger"
                    style={{marginTop: '3%', marginBottom: '0%'}}>{this.state.errorMessage}</p>
                  :
                  null
              }
            </Homepage>
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