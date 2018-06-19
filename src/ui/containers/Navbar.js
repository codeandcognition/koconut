// @flow
import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import firebase from 'firebase/app';
import 'firebase/auth';

/**
 * Navbar adds a navigation bar to the app
 * @class
 */
class Navbar extends Component {
  props: {
    firebaseUser: ?mixed
  };

  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    firebase.auth().signOut();
  }

  render() {
    return (
        <div>
          <AppBar>
            <Toolbar>
              <Typography style={{flexGrow: 1}} variant={"title"} color={"primary"}>
                  Kokonut
              </Typography>
              {this.props.firebaseUser &&
                  <Button
                    type="submit"
                    variant="flat"
                    color="secondary"
                    onClick={() => this.handleLogout()}>Logout</Button>
              }
            </Toolbar>
          </AppBar>
        </div>
    );
  }
}

export default Navbar;
