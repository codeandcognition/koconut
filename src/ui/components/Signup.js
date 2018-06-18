import React, {Component} from 'react';
import  FormGroup from '@material-ui/core/FormGroup';
import  FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class Signup extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return(
        <FormGroup>
        <TextField
    id="displayName"
    type="text"
    label="Display name"
    placeholder="Enter your display name"/>
        <TextField
    id="email"
    type="email"
    label="Email Address"
    placeholder="Enter your email address"/>
        <TextField
    id="password"
    type="password"
    label="Password"
    placeholder="Enter your password"/>
        <TextField
    id="confirmPassword"
    type="password"
    label="Confirm Password"
    placeholder="Re-enter your password"/>
        <Button
    type="submit"
    variant="flat"
        color="primary">Submit</Button>
        </FormGroup>
  );
  }
}

export default Signup;