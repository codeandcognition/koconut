import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import 'firebase/auth';
import 'firebase/database';
import Routes from './../../../Routes';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

type Props = {
  firebase: any,
  userCondition: string
}

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: null,
      email: null,
      id: this.props.userCondition,
      loading: false
    }
  }

  componentDidMount() {
    this.authUser = this.props.firebase ? this.props.firebase.auth().onAuthStateChanged(user => {
      this.setState({loading: true}, () => {
        if (!user) {
          this.props.history.push(Routes.signin);
        }
        this.setState({
          name: user.displayName,
          email: user.email
        });
      });
    }) : null;
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
          </Typography>
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