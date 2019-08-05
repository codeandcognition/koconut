import React, {Component} from 'react';
import { Link, withRouter} from "react-router-dom";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Routes from './../../../Routes';
import LoadingView from '../components/LoadingView';
import Homepage from '../components/Homepage/Homepage';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {CONDITIONS} from '../../../utils/Conditions';

class SignIn extends Component {

  constructor(props) {
    super(props);
    // noinspection JSAnnotator
    this.state = {
    	loading: true,
      errorMessage: "",
      emailAddress: "",
      password: "",
      showPasswordResetView: false,
      forgotPasswordEmail: "",
      passwordResetMessage: "",
      passwordResetError: false,
      userCondition: null
    }
  }

  componentDidMount() {
  	this.mounted = true;
		this.authUnsub = firebase.auth().onAuthStateChanged(user => {
			if (user) {
				if (this.mounted) {
					this.setState({currentUser: user}, () => this.routeUser());
				}
			} else {
				if (this.mounted) {
					this.setState({loading: false}, () => {
						this.props.history.push(Routes.signin);
					});
				}
			}
		});
	}

	componentWillUnmount() {
  	// stop the auth listener
  	this.authUnsub();
  	this.mounted = false;
	}

	/**
	 * Signs user into their account via Firebase authentication
	 */
  signInUser() {
    firebase.auth().signInWithEmailAndPassword(this.state.emailAddress, this.state.password)
        .then(user => {
          let uid = user.user.uid;
          if(uid) {
            firebase.database().ref(`/Users/${uid}/Data/SessionEvents`).push({
              type: "start",
              timestamp: firebase.database.ServerValue.TIMESTAMP
            });
						this.setState({loading: false, currentUser: user}, () => {
							this.routeUser();
            });
            
            // set state for userCondition
            let userRefCondition = this.props.firebase.database().ref(`/Users/${uid}/condition`);
            userRefCondition.on("value", (snap) => {
              if (this.mounted && snap.val()) {
                this.setState({
                  userCondition: snap.val()
                });
              }
            });            
          }
          // return user.updateProfile({displayName: this.state.displayName});
        })
        .catch((error) => {
          this.setState({errorMessage: error.message});
        });
  }

	/**
	 * routes user to the world view or the welcome view depending on their waiver
	 * status
	 */
	routeUser() {
    if(this.state.currentUser && this.state.currentUser.uid) {
      let databaseRef = firebase.database()
        .ref("Users/" + this.state.currentUser.uid);
      databaseRef.once("value").then((snapshot) => {
        if (snapshot !== null && snapshot.val() !== null) {
          let snap = snapshot.val();
          let waiverStatus = snap.waiverStatus;
          if (waiverStatus) {
            this.mounted && this.setState({loading: false}, () => this.props.history.push(Routes.worldview));
          } else {
            this.mounted && this.setState({loading: false}, () => this.props.history.push(Routes.welcome));
          }
        } else {
          this.mounted && this.setState({loading: false}, () => this.props.history.push(Routes.welcome));
        }
      });
    }
		
	}

	/**
	 * closes and opens window allowing user to reset their password
	 *
	 * @param openView
	 */
  togglePasswordResetView(openView) {
    this.setState({
      showPasswordResetView: openView,
      forgotPasswordEmail: "",
      passwordResetMessage: "",
      passwordResetError: false
    });
  }

	/**
	 *  sends a password reset email to the provided email address if it is valid
	 */
	sendPasswordResetEmail() {
    firebase.auth().sendPasswordResetEmail(this.state.forgotPasswordEmail).then(() => {
      this.setState({
        passwordResetMessage: "A password reset email has been sent.",
        passwordResetError: false

      });
    }).catch((error) => {
      this.setState({
        passwordResetMessage: error.message,
        passwordResetError: true
      })
    });
  }

	/**
	 * returns a div that contains the sign in form
	 * @returns {*}
	 */
  renderForm() {
		let buttonStyle = {
			marginBottom: "15px",
      textAlign: 'center',
      marginRight: '5%',
      marginTop: 10
		};
		let textFieldStyle = {
			marginBottom: "10px",
			// width: "12vw"
      width: "100%"
		};

		return (
				<div
						style={{textAlign: "center", paddingTop: "10vw", width: '100%'}} className="container">
          <Homepage>
            <div>
              <div style={{backgroundColor: 'white',
              border: "1px solid #4054B2",
              borderRadius: 10}}>
                <form style={{width: '100%'}}>
                  <div style={{width: '90%', margin: 'auto'}}>
                    <h1 style={{textAlign: 'left', marginTop: 30, fontSize: 25}}>Sign in to continue learning!</h1>
                    <TextField style={textFieldStyle}
                            onInput={(e) => this.setState({emailAddress: e.target.value})}
                            label={"Email Address"}
                            placeholder={"Enter your email address"}
                            type={"email"} />
                  
                  <TextField style={textFieldStyle}
                            onInput={(e) => this.setState({password: e.target.value})}
                            label={"Password"} placeholder={"Enter your password"}
                            type="password" />
                  </div>
                </form>
                <Grid>
                <Row>
                  <Col md={6} sm={6} xs={6}>
                    <div style={{width: '100%', marginLeft: '5%', textAlign: 'left'}}>
                      <Button style={buttonStyle}
                          variant={"outlined"}
                          color={"primary"}
                          onClick={() => this.togglePasswordResetView(true)}>Forgot password</Button>
                    </div>
                  </Col>
                  <Col md={6} sm={6} xs={6}>
                    <div style={{width: '100%', textAlign: 'right'}}>
                      <Button style={buttonStyle}
                          variant={"contained"}
                          color={"primary"}
                          onClick={() => this.signInUser()}>Sign In</Button>
                    </div>
                  </Col>
                </Row>
                </Grid>
              </div>
              <p style={{textAlign: 'left', marginLeft: '2%', marginTop: '2%'}}>Don't have an account? <Link to={Routes.signup}>
                <span>
                  Create Account
                </span>
              </Link></p>
              {this.state.errorMessage &&
              <p style={{textAlign: "left", marginBottom: "0"}}
                className={"alert alert-danger"}>{this.state.errorMessage}</p>
              }
            </div>
          </Homepage>
					
					{/** Sign in dialog boxes */}
          <Dialog open={this.state.showPasswordResetView}
									title={"Reset Password"}
									primary={true}
									aria-labelledby="form-dialog-title">
						<DialogTitle id="form-dialog-title">Reset Password</DialogTitle>
						<DialogContent>
							<label style={{marginTop: '2%'}}>Email Address</label>
							<br />
							<TextField hintText="Enter your email address"
												 style={{ width: '100%', marginBottom: "10px" }}
												 onInput={e => this.setState({ forgotPasswordEmail: e.target.value })}
												 type={"email"}/>
							{this.state.passwordResetError ?
									<p className={"alert alert-danger"}>{this.state.passwordResetMessage}</p> :
									<p>{this.state.passwordResetMessage}</p>
							}
						</DialogContent>
						<DialogActions>
							<Button onClick={() => this.sendPasswordResetEmail()}>Submit</Button>,
							<Button onClick={() => this.togglePasswordResetView(false)}>Cancel</Button>
						</DialogActions>
					</Dialog>
				</div>

		);
	}

  render() {
    return (
				<div>
					{this.state.loading ? <LoadingView/> : this.renderForm()}
				</div>
		);
  }
}

export default withRouter(SignIn);