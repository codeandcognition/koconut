// @flow
import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import firebase from 'firebase/app';
import 'firebase/auth';
import typeof FirebaseUser from 'firebase';

/**
 * Navbar adds a navigation bar to the app
 * @class
 */
class Navbar extends Component {
  props: {
    firebaseUser: ?FirebaseUser
  };

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
                    onClick={() => firebase.auth().signOut()}>Logout</Button>
              }
            </Toolbar>
          </AppBar>
        </div>
    );
  }
}

export default Navbar;
