// @flow
import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import firebase from 'firebase/app';
import 'firebase/auth';
import typeof FirebaseUser from 'firebase';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

/**
 * Navbar adds a navigation bar to the app
 * @class
 */
class Navbar extends Component {
  props: {
    firebaseUser: ?FirebaseUser
  };

  constructor(props) {
    super(props);
    this.state = {
      menuAnchor: null
    }
  }

  handleMenuClick(e) {
    this.setState({
      menuAnchor: e.currentTarget
    });
  }

  handleMenuClose() {
    this.setState({
      menuAnchor: null
    });
  }

  componentDidMount() {
    document.addEventListener("click", (e) => {
      if (e.target.id !== 'menu-img') {
        this.handleMenuClose();
      }
    })
  }

  render() {
    return (
        <div>
          <AppBar>
            <Toolbar>
              <Typography style={{flexGrow: 1}} variant={"title"} color={"primary"}>
                  Koconut
              </Typography>
              {this.props.firebaseUser &&
              (<div>
                  <Button onClick={(e) => this.handleMenuClick(e)}
                          aria-owns='menu'
                          aria-haspopup="true"
                          id="menu-button">
                    <img alt={"hamburger menu"}
                    style={{width: "2vw", filter: "invert(100%)"}}
                    id={"menu-img"}
                    src={"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hamburger_icon.svg/220px-Hamburger_icon.svg.png"}/>
                  </Button>
                  <Menu id={'menu'}
                        anchorEl={this.state.menuAnchor}
                        open={this.state.menuAnchor != null}
                        ref={"menu"}>
                    <MenuItem onClick={() => this.handleMenuClose()}>Profile</MenuItem>
                    <MenuItem onClick={() => this.handleMenuClose()}>Settings</MenuItem>
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
