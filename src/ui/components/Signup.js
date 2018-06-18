import React, {Component} from 'react';

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
        <div>
          <h1>Welcome to Koconut!</h1>
          <h2>Sign up</h2>
          <form>
            <label
                htmlFor="email">Email</label>
            <input
                type="email"/>
            <label
                htmlFor="password">Password</label>
            <input
                type="password" />
            <label
                htmlFor="password" >Confirm Password</label>
            <input
                type="password" />
            <button type="submit" ></button>
          </form>
        </div>
    );
  }
}

export default Signup;