import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import 'firebase/auth';
import 'firebase/database';
import Routes from './../../../Routes';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ReactMarkdown from 'react-markdown';

type Props = {
  firebase: any,
  userCondition: string
}

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.userCondition,
      name: null,
      email: null,
      createdAt: null,
      loading: false,
      aboutStudyContent: null
    }
  }

  componentDidMount() {
    if(this.props.firebase) {
      // get data from auth
      this.props.firebase.auth().onAuthStateChanged(user => {
        if (!user) {
          this.props.history.push(Routes.signin);
        }
        this.setState({
          name: user.displayName,
          email: user.email,
        });

        // createdAt lives in DB b/c can't get from auth
        let userCreatedAt = this.props.firebase.database().ref(`/Users/${user.uid}/createdAt`);
        userCreatedAt.on("value", (snap) => {
          if (snap.val()) {
            let createdAt = new Date(snap.val());
            this.setState({
              createdAt: createdAt.toString()
            });
          }
        });
        
        // get static content for "about study"
        let aboutStudy = this.props.firebase.database().ref(`/static/aboutStudy`);
        aboutStudy.on("value", (snap) => {
          if (snap.val()) {
            this.setState({
              aboutStudyContent: snap.val()
            });
          }
        });		
      });
    }
  }

  render() {
    return (
      <div style={{marginTop:'100px'}}>
        <Paper className='container'>
          <Typography variant="h5" component="h1">
            {this.state.name && `${this.state.name}'s `}Profile
          </Typography>

          <Typography component="p">
            Name: {this.state.name ? this.state.name : '(none provided)'}
            <br/>
            Email: {this.state.email}
            <br />
            <br />
            Account created: {this.state.createdAt ? this.state.createdAt : '(unknown)'}
          </Typography>
        </Paper>

        <Paper className='container' style={{marginTop:'10px'}}>
          <ReactMarkdown source={this.state.aboutStudyContent}></ReactMarkdown>
        </Paper>

        <Paper className='container' style={{marginTop:'10px'}}>
          <Typography variant="h5" component="h1">
            Study contact information
          </Typography>

          <Typography component="p">
            To learn more about the study and/or opt out, 
            please contact Benjamin Xie (Univ of Washington) at <a href='mailto:bxie@uw.edu'>bxie@uw.edu</a>.
          </Typography>
        </Paper>
      </div>
    )
  }
}

export default withRouter(Profile);