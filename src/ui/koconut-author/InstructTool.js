import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import conceptInventory from './ConceptMap';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import firebase from 'firebase';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';

class InstructTool extends Component {

	constructor(props) {
		super(props);
		this.state = {
			instructions: [],
			//Math.round(Math.random() * 999999999)
			title: "",
			concept: "",
			type: "",
			content: "",
			conceptList: [],
			selectedConceptKey: 0,
			selectedTypeKey: 0,
			editMode: false,
			editIndex: null
		}
	}


	componentDidMount() {
		this.setState({
			conceptList: conceptInventory.map((concept) => concept.name)
		})
	}

	// Handles a change in any of the input fields
	handleChange = (event) => {
		let value = event.target.value;
		let field = event.target.name;
		let changes = {};
		changes[field] = value;
		this.setState(changes, () => {
      if (this.state.concept !== "" && this.state.type !== "") {
        this.getCurrentInstructions()
      }
		});
	}

	// Takes user-inputted data and turns it into an instruction. Pushes new
	// instruction to firebase, clears fields, and updates instruction steps view
	addInstruction = () => {
		let instruction = {
			title: this.state.title,
			content: this.state.content
		};
		this.setState({
			instructions: [...this.state.instructions, instruction],
			title: "",
			content: ""
		}, () => {
			var databaseRef = firebase.database().ref("Instructions/" + this.state.concept + "/" + this.state.type);
			databaseRef.set(this.state.instructions);
		});
	}

	// Populates the instruction steps section with existing instruction data pulled from firebase
	// when the user sets concept and type
	getCurrentInstructions() {
		var databaseRef = firebase.database().ref("Instructions/" + this.state.concept + "/" + this.state.type);
		databaseRef.on("value", (snapshot) => {
			if (snapshot.val() !== null) {
        this.setState({instructions: snapshot.val()});
			} else {
				this.setState({instructions: []});
			}
		});
	}

	// Takes user out of edit mode when they click on cancel
	handleEditCancel() {
		this.setState({
			editIndex: null,
			editMode: false,
			title: "",
			content: ""
    });
	}

	// Enters user into edit mode and populates fields with values to edit
	handleEditClick(index) {
		var data = this.state.instructions[index];
		this.setState({
			content: data.content,
			title: data.title,
			editIndex: index,
			editMode: true
		});
	}

	// Saves users edits to firebase database
	handleSaveEdits() {
    var newInstruction = {
      title: this.state.title,
      content: this.state.content
    }
    var databaseRef = firebase.database().ref("Instructions/" + this.state.concept + "/" + this.state.type + "/" + this.state.editIndex);
    databaseRef.set(newInstruction);
    this.setState({
			title: "",
			content: "",
			editMode: false,
			editIndex: null
		});
	}

	handleDeleteInstruction(index) {
		var result = this.state.instructions;
		result.splice(index, 1);
		var databaseRef = firebase.database().ref("Instructions/" + this.state.concept + "/" + this.state.type);
		databaseRef.set(result);
	}

	render() {
		var containerStyle = {
			width: "80vw",
			margin: "auto",
			padding: "80px",
		};

    if (this.state.editMode) {
			containerStyle["border"] = "1px solid yellow";
		}

		return (
				<Paper style={containerStyle} elevation={4}>
            <TextField fullWidth={true} label={"Instruction Name"} value={this.state.title} style={{width: "30%"}} name="title" onChange={(e) => this.handleChange(e)}/>
					<br />
					<div className="concept-select" style={{marginTop: "50px"}}>
						<InputLabel htmlFor={"concept-selector"}>Choose Concept</InputLabel>
						<Select id={"concept-selector"}
										autoWidth={true}
										value={this.state.concept}
										style={{marginLeft: "80px"}}
										name={"concept"}
										disabled={this.state.editMode}
										onChange={(e) => this.handleChange(e)}>
							{this.state.conceptList.map((item, index) => {
								return (
										<MenuItem value={item} key={index}>{item}</MenuItem>
								);
							})}
						</Select>
					</div>
					<br />
					<div className="type-select" style={{marginTop: "50px"}}>
						<InputLabel htmlFor={"type-selector"}>Choose Instruction Type</InputLabel>
						<Select id={"type-selector"}
										autoWidth={true}
										name={"type"}
										value={this.state.type}
										style={{marginLeft: "80px"}}
										disabled={this.state.editMode}
										onChange={(e) => this.handleChange(e)}>
							<MenuItem value={"READ"}>READ</MenuItem>
							<MenuItem value={"WRITE"}>WRITE</MenuItem>
						</Select>
					</div>
					<br />
					<textarea value={this.state.content} name="content" onChange={(e) => this.handleChange(e)} rows="10" style={{width: "50%", marginTop: "50px"}} placeholder={"Instruction Content"}></textarea>
					<br />
					{this.state.editMode ? (
							<div>
									<Button style={{marginTop: "50px"}} variant={"contained"} color={"primary"} onClick={() => this.handleSaveEdits()}>Save</Button>
									<Button style={{marginTop: "50px", marginLeft:"30px"}} variant={"contained"} color={"secondary"} onClick={() => this.handleEditCancel()}>Cancel</Button>
							</div>
					) :
              <Button style={{marginTop: "50px"}} variant={"contained"} color={"primary"} onClick={() => this.addInstruction()}>Add Instruction</Button>
					}
					<br />
					<h4 style={{marginTop: "80px"}}>Instruction Steps</h4>
					<div id={"instruction-steps"}>
						{this.state.instructions && this.state.instructions.map((item, index) => {
							return (
                  <Card key={index}>
                    <CardContent>
                      <Typography variant={"headline"} component={"h3"}>{item.title}
												{(this.state.editMode && this.state.editIndex == index) &&
													<span style={{color: "yellow", fontSize: "14px"}}> (editing)</span>
												}
                      </Typography>
                      <Typography color={"textSecondary"}>{item.content}</Typography>
                    </CardContent>
										<CardActions>
											{!this.state.editMode &&
												<div>
													<Button color={"primary"} size={"small"} onClick={() => this.handleEditClick(index)}>Edit</Button>
													<Button color={"secondary"} size={"small"} onClick={() => this.handleDeleteInstruction(index)}>Delete</Button>
												</div>
											}
										</CardActions>
                  </Card>
							);
						})}
					</div>
				</Paper>
		);
	}
}

export default InstructTool;
