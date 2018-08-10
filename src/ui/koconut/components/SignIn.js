import React, {Component} from 'react';
import { Link, withRouter} from "react-router-dom";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import firebase from 'firebase';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Routes from './../../../Routes';
import LoadingView from '../components/LoadingView';

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
      passwordResetError: false
    }
  }

  componentDidMount() {
		this.authUnsub = firebase.auth().onAuthStateChanged(user => {
			this.setState({currentUser: user});
			if (user) {
				this.routeUser();
			} else {
				this.setState({loading: false}, () => {
					this.props.history.push(Routes.signin);
				})
			}
		});
	}

	componentWillUnmount() {
  	// stop the auth listener
  	this.authUnsub();
	}

	/**
	 * Signs user into their account via Firebase authentication
	 */
  signInUser() {
    firebase.auth().signInWithEmailAndPassword(this.state.emailAddress, this.state.password)
    	.then(() => {
    		if (this.state.currentUser !== null) {
    			this.setState({loading: false}, () => {
						this.routeUser();
					});
				}
			}).catch((error) => {
      	this.setState({errorMessage: error.message});
    	});
  }

	/**
	 * routes user to the world view or the welcome view depending on their waiver
	 * status
	 */
	routeUser() {
		let databaseRef = firebase.database().
				ref("Users/" + this.state.currentUser.uid);
		databaseRef.once("value", (snapshot) => {
			if (snapshot !== null && snapshot.val() !== null) {
				let snap = snapshot.val();
				let waiverStatus = snap.waiverStatus;
				if (waiverStatus) {
					this.setState({loading: false}, () => this.props.history.push(Routes.worldview));
				} else {
					this.setState({loading: false}, () => this.props.history.push(Routes.welcome));
				}
			} else {
				this.setState({loading: false}, () => this.props.history.push(Routes.welcome));
			}
		});
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
			margin: "2px",
			marginBottom: "15px"
		};
		let textFieldStyle = {
			marginBottom: "10px",
			width: "12vw"
		};

		return (
				<div
						style={{textAlign: "center", padding: "10vw"}} className="container">
					<h1>Koconut</h1>
					<img style={{width: "10vh" }}
							 src={"https://i.pinimg.com/originals/bd/87/87/bd8787a601af7682d857f6c365d4421b.png"}
							 alt={"cocount"} />
					<h3>a tutor to help you learn</h3>
					<form>
						<TextField style={textFieldStyle}
											 onInput={(e) => this.setState({emailAddress: e.target.value})}
											 label={"Email Address"}
											 placeholder={"Enter your email address"}
											 type={"email"} />
						<br />
						<TextField style={textFieldStyle}
											 onInput={(e) => this.setState({password: e.target.value})}
											 label={"Password"} placeholder={"Enter your password"}
											 type="password" />
					</form>
					<br />
					{this.state.errorMessage &&
					<p style={{textAlign: "left", marginBottom: "0"}}
						 className={"alert alert-danger"}>{this.state.errorMessage}</p>
					}
					<br />
					<Button style={buttonStyle}
									variant={"outlined"}
									onClick={() => this.signInUser()}>Sign In</Button>
					<br />
					<Link to={Routes.signup}>
						<p
								style={{fontSize: '14px', color: '#e91363', cursor: 'pointer'}}>
							Create Account
						</p>
					</Link>
					<p onClick={(e) => this.togglePasswordResetView(true)}
						 style={{marginBottom: "15px", fontSize: '14px', color: '#00BCD4', cursor: 'pointer'}}>Forgot Password</p>
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