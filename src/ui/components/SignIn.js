import React from 'react';
import Button from '@material-ui/core/Button';
import './SignIn.scss';

class SignIn extends React.Component {
  render() {
    return <div className="container">
      <h1>Koconut</h1>
      <h3>a tutor to help you learn</h3>
      <input type={"text"} placeholder={"email"} />
      <input type={"text"} placeholder={"password"} />
      <Button>Sign In</Button>
      <a href={""}>Forgot Password</a>
    </div>

  }
}

export default SignIn;