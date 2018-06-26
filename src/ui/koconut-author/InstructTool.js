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
import ReactMarkdown from 'react-markdown';
import CodeBlock from'../koconut/components/CodeBlock';
import './InstructTool.css';

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
			editIndex: null,
			reorder: "",
			reorderError: ""
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

	// Deletes instruction from database
	handleDeleteInstruction(index) {
		var result = this.state.instructions;
		result.splice(index, 1);
		var databaseRef = firebase.database().ref("Instructions/" + this.state.concept + "/" + this.state.type);
		databaseRef.set(result);
	}

	// Reorders the instruction pages based on the given reorder sequence stored in state -> reorder
	reorderInstructions() {
		var orderString = this.state.reorder;
		var pattern = /^([0-9]+,)+[0-9]+$/g;
		var orderArr = orderString.split(",");
		var oldInstruct = this.state.instructions;
		var error = "";
		if (!pattern.test(orderString)) {
			error = "Incorrectly formatted input. Please enter reorder as a comma-separated list of numbers.";
		} else if (orderArr.length !== oldInstruct.length) {
			error = "Numbers provided do not equal the amount of pages for reordering.";
		} else {
			var result = [];
			for (var i = 0; i < orderArr.length; i++) {
        var index = Number(orderArr[i]) - 1;
				if (result[i] || index >= orderArr.length) {
          error = "Invalid order provided. Reordering failed.";
				} else {
          result[i] = oldInstruct[index];
				}
			}
			if (error === "") {
        var databaseRef = firebase.database().ref("Instructions/" + this.state.concept + "/" + this.state.type);
        databaseRef.set(result);
			}
    }
		this.setState({
			reorderError: error
		});
	}

	render() {
		var containerStyle = {
			margin: "auto",
			padding: "80px",
		};

    if (this.state.editMode) {
			containerStyle["border"] = "1px solid yellow";
		}

		var missingFields = true;
		if (this.state.title && this.state.content && this.state.concept && this.state.type) {
    	missingFields = false;
		}


		return (
				<Paper style={containerStyle} elevation={4}>
          <h3 style={{textAlign: "center"}}>Instruction Form</h3>
					<TextField fullWidth={true} label={"Instruction Name"} value={this.state.title} style={{width: "60%"}} name="title" onChange={(e) => this.handleChange(e)}/>
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
					<textarea value={this.state.content} name="content" onChange={(e) => this.handleChange(e)} rows="10" style={{width: "60%", marginTop: "50px", whiteSpace: "pre-line"}} placeholder={"Instruction Content (Markdown)"}></textarea>
					<br />
					{this.state.editMode ? (
							<div>
									<Button style={{marginTop: "50px"}} variant={"contained"} color={"primary"} onClick={() => this.handleSaveEdits()}>Save</Button>
									<Button style={{marginTop: "50px", marginLeft:"30px"}} variant={"contained"} color={"secondary"} onClick={() => this.handleEditCancel()}>Cancel</Button>
							</div>
					) :
              <Button style={{marginTop: "50px"}} variant={"contained"} color={"primary"} onClick={() => this.addInstruction()} disabled={missingFields}>Add Instruction</Button>
					}
					<h3 style={{textAlign: "center", marginTop: "60px", marginBottom: "20px"}}>Instruction Steps</h3>
					<div id={"instruction-steps"}>
						{this.state.instructions && this.state.instructions.map((item, index) => {
							return (
                  <Card key={index}>
                    <CardContent>
                      <Typography style={{float: "right", color: "gray", fontSize: "11px"}}>
                        Page: {index + 1}
                      </Typography>
                      <Typography variant={"headline"} component={"h4"} style={{marginBottom: "1S0px"}}>{item.title}
												{(this.state.editMode && this.state.editIndex === index) &&
													<span style={{color: "yellow", fontSize: "14px"}}> (editing)</span>
												}
                      </Typography>
											<ReactMarkdown className={"flex-grow-1"}
																			source={item.content}
																			renderers={{CodeBlock: CodeBlock}}/>
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
					{this.state.instructions.length > 1 &&
						<div style={{marginTop: "30px"}}>
              <TextField name="reorder" style={{width: "70%"}} id={"order-input"} label={"Re-Order Instruction Steps"} onChange={(e) => this.handleChange(e)}/>
							<Button style={{marginLeft: "20px"}} color={"secondary"} variant={"contained"} onClick={() => this.reorderInstructions()}>Re-order</Button>
              <p style={{marginTop: "10px", color: "gray", fontSize: "10px"}}>Type new order of steps as a comma separated list. (i.e. "1,3,2,4,5" will swap steps 3 and 2).</p>
							{this.state.reorderError &&
							<p className={"alert alert-danger"}>{this.state.reorderError}</p>
							}
						</div>
					}

				</Paper>
		);

	}
}

export default InstructTool;
