import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import firebase from 'firebase';



class SignIn extends React.Component {

  constructor(props) {
    super(props);
    // noinspection JSAnnotator
    this.state = {
      errorMessage: ""
    }
  }

  signInUser(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .catch((error) => {
          this.setState({errorMessage: error.message});
        });
    }


  render() {

    var buttonStyle = {
      margin: "2px",
      marginTop: "7px"
    }

    return <div style={{textAlign: "center", padding: "10vw"}} className="container">
      <h1>Koconut</h1>
      <img style={{width: "10vh" }} src={"https://i.pinimg.com/originals/bd/87/87/bd8787a601af7682d857f6c365d4421b.png"} alt={"cocount"} />
      <h3>a tutor to help you learn</h3>
      <TextField ref="email" label={"Email Address"} placeholder={"Enter your email address"} type={"email"} />
      <br />
      <TextField ref="password" label={"Password"} placeholder={"Enter your password"} type="password" />
      <br />
      <Button style={buttonStyle} variant={"outlined"}>Sign In</Button>
      <Button style={buttonStyle} variant={"outlined"}>Create Account</Button>
      <br />
      <a href={""}>Forgot Password</a>
    </div>

  }
}

export default SignIn;