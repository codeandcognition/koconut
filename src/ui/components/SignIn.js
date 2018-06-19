import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import firebase from 'firebase';



class SignIn extends React.Component {

  constructor(props) {
    super(props);
    // noinspection JSAnnotator
    this.state = {
      errorMessage: "",
      emailAddress: "",
      password: ""
    }
  }

  signInUser() {
    firebase.auth().signInWithEmailAndPassword(this.state.emailAddress, this.state.password)
        .catch((error) => {
          this.setState({errorMessage: error.message});
        });
    }


  render() {

    var buttonStyle = {
      margin: "2px",
      marginTop: "12px",
      marginBottom: "12px"
    }

    var textFieldStyle = {
      marginBottom: "10px"
    }

    var errorStyle ={
      backgroundColor: "#ffcccc",
      color: "#ff3333",
      borderRadius: "8px",
      border: "2px solid #ff8080",
      width: "25vh",
      padding: "5px",
      margin: "auto",
      marginTop: "10px",
      fontWeight: "bold",
      textAlign: "left"
    }

    return <div style={{textAlign: "center", padding: "10vw"}} className="container">
      <h1>Koconut</h1>
      <img style={{width: "10vh" }} src={"https://i.pinimg.com/originals/bd/87/87/bd8787a601af7682d857f6c365d4421b.png"} alt={"cocount"} />
      <h3>a tutor to help you learn</h3>
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
      <br />
      <Button style={buttonStyle} variant={"outlined"} onClick={() => this.signInUser()}>Sign In</Button>
      <Button style={buttonStyle} variant={"outlined"} onClick={() => this.props.toSignup()}>Create Account</Button>
      <br />
      <a href={""}>Forgot Password</a>
      {this.state.errorMessage &&
        <p style={errorStyle}>{this.state.errorMessage}</p>
      }
    </div>

  }
}

export default SignIn;