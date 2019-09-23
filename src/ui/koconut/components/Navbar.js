// @flow
import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import { Link, withRouter} from "react-router-dom";
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import Popover from '@material-ui/core/Popover';
import firebase from 'firebase/app';
import 'firebase/auth';
import Menu from '@material-ui/core/Menu/Menu';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import BackButton from '@material-ui/icons/ChevronLeft';
import Routes from './../../../Routes';
import {CONDITIONS} from '../../../utils/Conditions';
import MLink from '@material-ui/core/Link';
import './Navbar.css';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';


/**
 * Navbar adds a navigation bar to the app
 * @class
 */

class Navbar extends Component {
  handleMenuClose: Function;
  handleMenuClick: Function;

  constructor(props) {
    super(props);
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.btnSurvey = React.createRef(); // ref to anchor dialog    
    this.state = {
      menuAnchor: null, // opens hamburger menu
      dialogAnchor: null,
      showSurveyDialog: false, // opens dialog box for post-survey/diagnostic
      readyForSurvey: Boolean(this.props.surveyUrl), // true if user indicated they're ready for survey
      needsToConfirm: false // true if user indicated they're ready for survey but still needs to confirm
    };
  }

  componentDidMount() {
  	this.mounted = true;
		this.authUnsub = firebase.auth().onAuthStateChanged(user => {
			if (this.mounted) {
				this.setState({currentUser: user}, () => {
					if (user) {
            this.checkAuthorStatus();
            if (this.state.readyForSurvey) {
              this.setState({dialogAnchor: this.btnSurvey.current}); // not sure about dialog
            }
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
      menuAnchor: null,
      needsToConfirm: false
    });
  }

  // when survey checkbox selected, get link to post-survey
  handleSurveyCheck = () => {
    if(!this.props.surveyUrl) {
      this.props.getSurveyUrl();
    }
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
                  { true &&
                    <span>                  
                      {!this.state.readyForSurvey &&   
                        <Button variant="contained" onClick={() => this.setState({showSurveyDialog: true})}>
                        ️   Ready for the diagnostic?
                        </Button>
                      }
                      {this.state.readyForSurvey && 
                        <MLink href={this.props.surveyUrl}>
                          <Button ref={this.btnSurvey} variant="contained" color="secondary">
                            ️<i className="fas fa-external-link-alt" style={{fontSize: '1.5em'}}></i>
                            Go to diagnostic/ post-survey.
                          </Button>
                        </MLink>
                        // <Button ref={this.btnSurvey} variant="contained" onClick={() => this.setState({showSurveyDialog: true})}>
                        // ️   Take the diagnostic!
                        // </Button>
                      }
                      <Popover
                        open={Boolean(this.state.dialogAnchor)}
                        onClose={() => this.setState({dialogAnchor: null})}
                        anchorEl={this.state.dialogAnchor}
                        anchorOrigin={{
                          vertical: 'center',
                          horizontal: 'left',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                      >
                        <Typography>Click here to continue to the diagnostic and post-survey!</Typography>
                      </Popover>

                      <Dialog onClose={() => this.setState({showSurveyDialog: false, needsToConfirm: false})} open={this.state.showSurveyDialog}>
                        <DialogTitle>️
                          {this.state.readyForSurvey ? `Take the diagnostic/ post-survey!` : `Ready for the diagnostic?`}
                        </DialogTitle>
                        <DialogContent>
                          
                          {this.state.readyForSurvey 
                          ? <DialogContentText>It's time for you take the diagnostic & post-survey!</DialogContentText> 
                          : <>
                              <DialogContentText>If you've spent at least 2-4 hours learning with Codeitz and understood at least 1 exercise in most concepts<sup>**</sup>, 
                              then you're ready for the diagnostic!</DialogContentText>
                              <br/>
                              <DialogContentText>Click below when you're ready to take the diagnostic/ post-survey.</DialogContentText>
                            </>
                          }

                          {!this.props.surveyUrl &&
                            <div style={{display:'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '10px'}}>                     
                              <Button variant="contained" color="primary" disabled={this.state.needsToConfirm} onClick={() => this.setState({needsToConfirm: true})}>
                                  I'm ready for the diagnostic!
                              </Button>
                            </div>
                          }

                          {(!this.state.readyForSurvey && !this.state.needsToConfirm )&&
                            <DialogContentText>
                              <small>
                                **to get compensated, you must have used Codeitz for &#8805 2 hrs & 
                                gotten at least 1 exercise correct in 80% (8) of the concepts with exercises <i>prior</i> to the post-survey/diagnostic
                              </small>
                            </DialogContentText>
                          }

                            {(!this.state.readyForSurvey && this.state.needsToConfirm) &&
                              <div>
                                <i>Are you sure?</i> After starting the diagnostic, you won't be able to use Codeitz
                                <br/>
                                <span style={{display:'flex', justifyContent: 'center'}}>
                                  <Button variant="contained" color="primary" onClick={() => this.handleSurveyCheck()} style={{marginLeft:'4px', marginRight:'4px'}}>
                                      Yes (ready for diagnostic)
                                  </Button>
                                  <Button variant="outlined" onClick={() => this.setState({needsToConfirm: false, showSurveyDialog: false})} style={{marginLeft:'4px', marginRight:'4px'}}>
                                      No (keep learning with Codeitz)
                                  </Button>
                                </span>
                              </div>  
                            }
                          {!this.props.surveysAvailable && 
                            <p className="alert alert-warning"
                                              style={{marginTop: '3%', marginBottom: '0%'}}>Sorry, the diagnostic/post-survey is not available right now. To continue, please contact the study coordiantor (see "help" section for contact info)
                            </p>
                          }
                        </DialogContent>
                      </Dialog>
                    </span>
                  }
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