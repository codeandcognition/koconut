import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import firebase from 'firebase';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

class SignIn extends React.Component {

  constructor(props) {
    super(props);
    // noinspection JSAnnotator
    this.state = {
      errorMessage: "",
      emailAddress: "",
      password: "",
      showPasswordResetView: false,
      forgotPasswordEmail: "",
      passwordResetMessage: "",
      passwordResetError: false
    }
  }

  // Signs user into their account via Firebase authentication
  signInUser() {
    firebase.auth().signInWithEmailAndPassword(this.state.emailAddress, this.state.password)
        .catch((error) => {
          this.setState({errorMessage: error.message});
        });
    }

  // Closes and opens window allowing user to reset their password
  togglePasswordResetView(openView) {
    this.setState({
      showPasswordResetView: openView,
      forgotPasswordEmail: "",
      passwordResetMessage: "",
      passwordResetError: false
    });
  }

  // Sends a password reset email to the provided email address if it is valid
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


  render() {

    var buttonStyle = {
      margin: "2px",
      marginBottom: "15px"
    }

    var textFieldStyle = {
      marginBottom: "10px",
      width: "12vw"
    }

    return <div style={{textAlign: "center", padding: "10vw"}} className="container">
      <h1>Koconut</h1>
      <img style={{width: "10vh" }} src={"https://i.pinimg.com/originals/bd/87/87/bd8787a601af7682d857f6c365d4421b.png"} alt={"cocount"} />
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
        <p style={{textAlign: "left", marginBottom: "0"}} className={"alert alert-danger"}>{this.state.errorMessage}</p>
      }
      <br />
      <Button style={buttonStyle} variant={"outlined"} onClick={() => this.signInUser()}>Sign In</Button>
      <br />
      <p onClick={() => this.props.toSignup()}
         style={{fontSize: '14px', color: '#e91363', cursor: 'pointer'}}>Create Account</p>
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

  }
}

export default SignIn;