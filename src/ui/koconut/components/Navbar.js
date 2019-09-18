// @flow
import React, {Component} from 'react';
import { Link, withRouter} from "react-router-dom";
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import firebase from 'firebase/app';
import 'firebase/auth';
import Menu from '@material-ui/core/Menu/Menu';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import BackButton from '@material-ui/icons/ChevronLeft';
import Routes from './../../../Routes';
import {CONDITIONS} from '../../../utils/Conditions';
import './Navbar.css';

/**
 * Navbar adds a navigation bar to the app
 * @class
 */

class Navbar extends Component {
  handleMenuClose: Function;
  handleMenuClick: Function;

  constructor(props) {
    super(props);
    this.state = {
      menuAnchor: null
    };
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  componentDidMount() {
  	this.mounted = true;
		this.authUnsub = firebase.auth().onAuthStateChanged(user => {
			if (this.mounted) {
				this.setState({currentUser: user}, () => {
					if (user) {
						this.checkAuthorStatus();
					} else {
						this.props.history.push(Routes.signin);
					}
				});
			}
		});
  }

  /**
	 * function to check if current firebase user is an author to determine
	 * whether or not they should see the link in the nav bar
	 */
  checkAuthorStatus() {
		let databaseRef = firebase.database()
		.ref("Users/" + this.state.currentUser.uid);
		databaseRef.once("value", snapshot => {
			if (snapshot && snapshot.val()) {
				let snap = snapshot.val();
				if (this.mounted) {
					this.setState({isAuthor: snap.permission === "author"});
				}
			}
		});
  }

  componentWillUnmount() {
  	this.mounted = false
    this.authUnsub();
  }

  /**
	 * opens the hamburger menu when it is clicked
	 */
  handleMenuClick(e: Event) {
    this.setState({
      menuAnchor: e.currentTarget
    });
  }

	/**
	 * closes hamburger menu
	 */
  handleMenuClose() {
    this.setState({
      menuAnchor: null
    });
  }

  openTutorial() {

  }

	/**
	 * handle logging out of koconut
	 */
  handleLogout() {
		let user = firebase.auth().currentUser;
		let uid = user?user.uid:null;
		if(uid) {
			firebase.database().ref(`/Users/${uid}/Data/SessionEvents`).push({
				type: "end",
				timestamp: firebase.database.ServerValue.TIMESTAMP
			});
		}
		firebase.auth().signOut();
		this.handleMenuClose();
		firebase.auth().signOut().then(this.props.history.push(Routes.signin));
  }

  render() {
    return (
        <div>
          <AppBar>
            <Toolbar>
              {/* can always access back button from these routes */}
              {(this.props.history.location.pathname === Routes.author ||
                  this.props.history.location.pathname === Routes.tutorial ||
                  this.props.history.location.pathname === Routes.profile) 
                  ||
                (this.props.userCondition !== CONDITIONS.C2 && // for C2, can't go back in instruction or practice
                (this.props.history.location.pathname.includes("instruction") || this.props.history.location.pathname.includes("practice")))  
                ?
									<div style={{marginRight: 5}}>
										<Link to={Routes.worldview} onClick={() => this.props.switchToWorldView()}>
											<BackButton
													aria-owns='menu'
													aria-haspopup="true"
													id="menu-button"
													style={{color: '#fff', cursor: 'pointer'}}>
												Back to World View
											</BackButton>
										</Link>
									</div> : <div></div>
							}
							{/* color imported from Material UI */}
							<Typography style={{flexGrow: 1, color: "#FAFAFA"}} variant={"inherit"}>
								Codeitz
							</Typography>
              {this.state.currentUser &&
              (<div>
                  <Button
                          onClick={(e) => this.handleMenuClick(e)}
                          aria-owns={this.menuAnchor ? 'menu' : null}
                          aria-haspopup="true"
                          id="menu-button">
										<i className="fas fa-bars" style={{color: '#fff', fontSize: '1.5em'}}></i>
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
                        style={{paddingRight: 0}}
                      >
                    {this.state.isAuthor ? <Link className='subtle' to={Routes.author}><MenuItem>Author</MenuItem></Link> : null}
                    <Link className='subtle' to={Routes.profile}><MenuItem>Profile</MenuItem></Link>
                    <Link className='subtle' to={Routes.tutorial}><MenuItem>Help</MenuItem></Link>
                    {/* <MenuItem onClick={this.handleMenuClose} disabled={true}>Settings</MenuItem> */}
                    <MenuItem onClick={() => this.handleLogout()}>Logout</MenuItem>
                  </Menu>
                </div>)
              }
            </Toolbar>
          </AppBar>
        </div>
    );
  }
}

export default withRouter(Navbar);