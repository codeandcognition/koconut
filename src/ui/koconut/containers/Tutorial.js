import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import 'firebase/auth';
import 'firebase/database';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import Routes from '../../../Routes';
import _ from 'lodash';
import LoadingView from './../components/LoadingView';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import './Tutorial.css';
import {CONDITIONS} from './../../../utils/Conditions';

type Props = {
  firebase: any,
  userCondition: string
}

class Tutorial extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tutorialVideo: ''
    }
  }

  componentDidMount() {
    this.authUser = this.props.firebase ? this.props.firebase.auth().onAuthStateChanged(user => {
      this.setState({loading: true}, () => {
        if (!user) {
          this.props.history.push(Routes.signin);
        }
        if(this.props.userCondition) {
          this.updateVideoState(this.props.userCondition);
        } else {
          this.updateVideoState(CONDITIONS.E1); // backwards compatibility: older accounts don't have conditions
        }
      });
    }) : null;

    if(!this.state.tutorialVideo.length===0 && this.props.userCondition) {
      this.updateVideoState(this.props.userCondition);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
     // get links to all videos
     if(this.props.userCondition !== prevProps.userCondition && this.props.userCondition) {
      this.updateVideoState(this.props.userCondition);
    }
  }

  updateVideoState(condition) {
    this.props.firebase.database().ref(`/static/tutorialLink`).on('value', (snap) => {
      if(_.includes(Object.keys(snap.val()), condition)){
        this.setState({tutorialVideo: snap.val()[condition]}); 
      }
    });
  }

  render() {
    return (
      <div style={{marginTop:'10%'}}>
        <Paper className='container'>
          <Typography variant="h5" component="h1">
            How to learn with Codeitz
          </Typography>
          <br />

          {(typeof(this.state.tutorialVideo) === 'string' && this.state.tutorialVideo.length>0)
            ? <CardMedia
              component="iframe"
              alt="Codeitz tutorial"
              style={{minHeight:'480px', height:'680px'}}
              src={this.state.tutorialVideo}
              title="Codeitz tutorial"
            />
            : <LoadingView/>
          }
          <br/>
          
          {/* <Typography component="p">
            Still have a question about using Codeitz?
            Please contact Benjamin Xie (Univ of Washington) at <a href='mailto:bxie@uw.edu'>bxie@uw.edu</a>.
          </Typography> */}

          {/* <Link to={Routes.worldview} onClick={() => this.props.switchToWorldView()}>
					  <Button variant="contained">Go to world view</Button>
          </Link> */}
        </Paper>
      </div>

      // TODO: add button to return to world view
    )
  }
}

export default withRouter(Tutorial);