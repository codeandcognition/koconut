import React, {Component} from 'react';
import { withRouter} from "react-router-dom";
import Routes from '../../../Routes';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { Select } from '@material-ui/core';
import LoadingView from '../components/LoadingView';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

class ResponseViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allUsers: {},
      studyUids: [], //array of user uids for target users
      marks: [{value: 0, label:'0'}, {value: 50, label:'50'}, {value: 100, label:'100'}], // TODO: replace w/ normalized datalog timestamp (minus start time, converted to sec)
      targetUser: null,
    }

    this.valueLabelFormat = this.valueLabelFormat.bind(this);
    this.getMarksAndValues = this.getMarksAndValues.bind(this);
    this.updateTargetUser = this.updateTargetUser.bind(this);
    this.studyIds = ['b03', 'b05', 'b02'];
  }

  componentDidMount() {
    this.mounted = true;
    this.authUnsub = this.props.firebase ? this.props.firebase.auth().onAuthStateChanged(user => {
  		if (this.mounted) {
				this.setState({loading: true}, () => {
					if (!user) {
						this.props.history.push(Routes.signin);
          }
          
          this.checkAdminStatus(user);
          
          let userRef = this.props.firebase.database().ref('UsersNcme2019'); // heavy call
          userRef.on('value', (snap) => {
            this.setState({allUsers: snap.val()}, () => {
              console.log(snap.val());
              let uids = Object.keys(this.state.allUsers);
              this.setState({studyUids: uids.filter(id => this.studyIds.includes(this.state.allUsers[id].exerciseAssignmentId))});
            }); // TODO remove console log
          });
				});
			}
		}) : null;
  }

  /**
   * 
   * @param {String} user Firebase user uid
   */
  checkAdminStatus(user) {
    let databaseRef = this.props.firebase.database().ref("UsersNcme2019/" + user.uid + "/isAdmin");
		databaseRef.once("value", (snapshot) => {
			if (snapshot == null || !snapshot.val()) {
				this.props.history.push(Routes.welcome);
			} else {
				if (this.mounted) {
					this.setState({loading: false});
				}
			}
		})
  }

  /**
   * Get values and labels
   * values start at 0 (start time) and go to (end time - start time). In seconds.
   * marks are same as values
   * @param {Object} datalog data log of write questions w/ parameter
   */
  getMarksAndValues(datalog) {
    // TODO
  }

  valueLabelFormat(value) {
    return this.state.marks ? this.state.marks.findIndex(mark => mark.value === value) : -1;
  }

  updateTargetUser(updatedUser) {
    this.setState({targetUser: updatedUser});
  }

  // identify study participants (have exerciseAssignmentIds in this.realIds)
  populateUserOptions() {

  }

  render() {
    return (
      <div style={{margin:'70px'}}>

        <FormControl>
          <InputLabel>User Id</InputLabel>
          <Select
            value={this.state.targetUser}
            onChange={(event) => this.updateTargetUser(event.target.value)}
            input={<Input name="email" id="email-helper" />}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {this.state.studyUids.map(uid => 
              <MenuItem key={uid} value={uid}>{uid}</MenuItem>
              )}
          </Select>
          <FormHelperText>Select a participant</FormHelperText>
        </FormControl>

        <Typography id="discrete-slider-restrict" gutterBottom>
          Restricted values
        </Typography>
        <Slider
          defaultValue={0}
          valueLabelFormat={this.valueLabelFormat}
          // getAriaValueText={valuetext}
          aria-labelledby="discrete-slider-restrict"
          step={null}
          valueLabelDisplay="auto"
          marks={this.state.marks}
        />
      </div>
    )
  }
}

export default withRouter(ResponseViewer);