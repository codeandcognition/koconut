// @flow
import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import firebase from 'firebase/app';
import 'firebase/auth';
import typeof FirebaseUser from 'firebase';
import Menu from '@material-ui/core/Menu/Menu';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';

/**
 * Navbar adds a navigation bar to the app
 * @class
 */

type Props = {
  firebaseUser: ?FirebaseUser,
  display: string,
  switchToWorldView: Function
}

class Navbar extends Component {
  handleMenuClose: Function;
  handleMenuClick: Function;

  constructor(props: Props) {
    super(props);
    this.state = {
      menuAnchor: null
    }
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  // Opens the hamburger menu when it is clicked
  handleMenuClick(e: Event) {
    this.setState({
      menuAnchor: e.currentTarget
    });
  }

  // Closes hamburger menu
  handleMenuClose() {
    this.setState({
      menuAnchor: null
    });
  }

  render() {
    return (
        <div>
          <AppBar>
            <Toolbar>
              {this.props.display === "EXERCISE" ?
              <div style={{marginRight: 5}}><Button onClick={this.props.switchToWorldView}
                           aria-owns='menu'
                           aria-haspopup="true"
                           id="menu-button"
                           color={"secondary"}>
                Back to World View
              </Button></div> : <div></div>
              }
              <Typography style={{flexGrow: 1}} variant={"title"} color={"secondary"}>
                  Koconut
              </Typography>

              {this.props.firebaseUser &&
              (<div>
                  <Button
                          onClick={(e) => this.handleMenuClick(e)}
                          aria-owns={this.menuAnchor ? 'menu' : null}
                          aria-haspopup="true"
                          id="menu-button">
                    <img alt={"hamburger menu"}
                    style={{width: "2vw", filter: "invert(100%)"}}
                    id={"menu-img"}
                    src={"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hamburger_icon.svg/220px-Hamburger_icon.svg.png"}/>
                  </Button>
                  <Menu id={'menu'}
                        anchorEl={this.state.menuAnchor}
                        open={Boolean(this.state.menuAnchor)}
                        onClose={this.handleMenuClose}
                        anchorOrigin={{
                          vertical: 45, // TODO RENAME THIS CONSTANT
                          horizontal: 'left',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                        getContentAnchorEl={null}
                      >
                    <MenuItem onClick={this.handleMenuClose}>Profile</MenuItem>
                    <MenuItem onClick={this.handleMenuClose}>Settings</MenuItem>
                    <MenuItem onClick={() => firebase.auth().signOut()}>Logout</MenuItem>
                  </Menu>
                </div>)
              }
            </Toolbar>
          </AppBar>
        </div>
    );
  }
}

export default Navbar;
