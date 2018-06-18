import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Card, CardActions, CardHeader, CardText } from '@material-ui/core/Card';

class SignIn extends React.Component {
  render() {
    return <div className="containter">
      <Card>
        <CardHeader><h1>Sign In</h1></CardHeader>
        <CardText>
          <label>Email Address</label>
          <TextField hintText={"Enter your email address"} />
        </CardText>
        <CardText>
          <label>Password</label>
          <TextField hintText={"Enter your password"} type={"password"}/>
        </CardText>
        <CardActions>
          <Button primary={true} label={"Sign In"} />
        </CardActions>
      </Card>
    </div>

  }
}

export default SignIn;