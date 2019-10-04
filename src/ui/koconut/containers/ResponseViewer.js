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
import _ from 'lodash';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './../components/CodeBlock';


const STYLE_FORM = {margin: '10px'};

class ResponseViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allUsers: {},
      exerciseIdsForUser: [], // list of exercise IDs for targetUser
      exerciseData: [], // JSON object of data for all exercises for user. could be very heavy
      studyUids: [], //array of user uids for target users
      marks: [{value: 0, label:'0'}, {value: 50, label:'50'}, {value: 100, label:'100'}], // TODO: replace w/ normalized datalog timestamp (minus start time, converted to sec)
      value: 0, // value in slider
      sliderMax: 100, // max value for slider
      targetUser: null,
      targetExerciseId: null, // selected exercise ID
      targetExerciseData: ''
    }

    this.valueLabelFormat = this.valueLabelFormat.bind(this);
    this.updateMarks = this.updateMarks.bind(this);
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

  valueLabelFormat(value) {
    return value;
    // return this.state.marks ? this.state.marks.findIndex(mark => mark.value === value) : -1;
  }

  updateTargetUser(updatedUser) {
    this.setState({targetUser: updatedUser});
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    }, () => {
      
      // when user updated, update state on exercises for target user
      if(event.target.name == 'targetUser') {
        let exRef = this.props.firebase.database().ref(`UsersNcme2019/${this.state.targetUser}/Data/LogData`);
        exRef.on('value', (snap) => {
          this.setState({
            exerciseIdsForUser: snap.val() ? Object.keys(snap.val()) : [],
            exerciseData: snap.val(),
          }); 
        });
      }

      // when exercise id changed, update state data on exercise
      if(event.target.name == 'targetExerciseId') {
        this.updateMarks();
      }
    });
  };

  handleSliderChange = (event, newValue) => {
    this.setState({
      value: newValue
    }, () => this.updateTargetExerciseData());
  }

  handleInputChange = event => {
    this.setState({
      value: event.target.value === '' ? '' : Number(event.target.value)
    }, () => this.updateTargetExerciseData())
  }

  updateTargetExerciseData() {
    console.log('updateTargetExerciseData');
    console.log(this.state); // TODO remove
    if(_.has(this.state.exerciseData, this.state.targetExerciseId)) {
      console.log(`exerciseData and targetExerciseId found`);
      let index = (this.state.value && this.state.marks) ? this.state.marks.findIndex(mark => mark.value === this.state.value) : -1;
      console.log(`index found: ${index}`);
      if(index > 0 && this.state.exerciseData[this.state.targetExerciseId]['DataLog'][index]) {
        this.setState({
          targetExerciseData: this.state.exerciseData[this.state.targetExerciseId]['DataLog'][index]['textContent']
        })
      }
    }
  }

  // update marks
  updateMarks() {
    console.log('updateMarks');
    if(_.has(this.state.exerciseData, this.state.targetExerciseId)) {
      console.log('id in exercise data');
      let eventLog = this.state.exerciseData[this.state.targetExerciseId]["DataLog"];
      let startTime = parseInt(eventLog[0]["timestamp"]);
      this.setState({
        marks: eventLog.map(event => {
          return {
          value: (parseInt(event.timestamp)-startTime)/1000, 
          label: (parseInt(event.timestamp)-startTime)/1000 // b/c timestamp is in milliseconds
          }
        })
      }, () => {
        this.setState({ // TODO: SLIDER MAX NOT CORRECT
          sliderMax: this.state.marks[this.state.marks.length-1].value // assuming last one is max 
        })// update slider values
      });
    } else { // TODO: remove all of else condition
      console.log('oops');
      console.log(this.state);
    }

    // getValueAndLabel = (event, startTime) => {
    //   return {
    //     value: parseInt(event.timestamp)-startTime, 
    //     label: (parseInt(event.timestamp)-startTime)/1000 // b/c timestamp is in milliseconds
    //   };
    // }
  }

  render() {
    return (
      <div style={{margin:'70px'}}>

        <FormControl style={STYLE_FORM}>
          <InputLabel>User Id</InputLabel>
          <Select
            value={this.state.targetUser}
            onChange={this.handleChange}
            input={<Input name="targetUser" />}
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

        <FormControl style={STYLE_FORM}>
          <InputLabel>Exercise ID</InputLabel>
          <Select
            value={this.state.targetExerciseId}
            onChange={this.handleChange}
            input={<Input name="targetExerciseId" />}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {this.state.exerciseIdsForUser.map(eid => 
              <MenuItem key={eid} value={eid}>{
                _.has(this.state.exerciseData[eid], 'ExerciseId') && 
                  `${this.state.exerciseData[eid]['ExerciseId']} (${this.state.exerciseData[eid]['ExerciseType']})`
              }</MenuItem>
              // <MenuItem key={eid} value={eid}>{eid}</MenuItem>
              )}
          </Select>
          <FormHelperText>Select an exercise from that participant</FormHelperText>
        </FormControl>

        <Typography id="discrete-slider-restrict" gutterBottom>
          Time step
        </Typography>
        <Slider
          defaultValue={0}
          valueLabelFormat={this.valueLabelFormat}
          // getAriaValueText={valuetext}
          aria-labelledby="discrete-slider-restrict"
          step={null}
          valueLabelDisplay="auto"
          marks={this.state.marks}
          max = {this.state.sliderMax}
          value = {typeof this.state.value === 'number' ? this.state.value : 0}
          onChange = {this.handleSliderChange}
        />
        <br/>
        <Input
            value={this.state.value}
            margin="dense"
            onChange={this.handleInputChange}
            inputProps={{
              step: 10,
              min: 0,
              max: this.state.sliderMax,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          /> <p>(seconds)</p>
          <ReactMarkdown source={this.state.targetExerciseData} renderers={{CodeBlock: CodeBlock}}/>
      </div>
    )
  }
}

export default withRouter(ResponseViewer);