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
			selectedTypeKey: 0
		}
	}


	componentDidMount() {
		this.setState({
			conceptList: conceptInventory.map((concept) => concept.name)
		})
	}

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
			var databaseRef = firebase.database().ref('Instructions/' + this.state.concept + "/" + this.state.type);
			databaseRef.set(this.state.instructions);
		});
	}


	getCurrentInstructions() {
		var databaseRef = firebase.database().ref('Instructions/' + this.state.concept + "/" + this.state.type);
		databaseRef.on("value", (snapshot) => {
			if (snapshot.val() !== null) {
        this.setState({instructions: snapshot.val()});
			}
		});
	}



	render() {
		var containerStyle = {
			width: "80vw",
			margin: "auto",
			padding: "80px"
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
										onChange={(e) => this.handleChange(e)}>
							<MenuItem value={"READ"}>READ</MenuItem>
							<MenuItem value={"WRITE"}>WRITE</MenuItem>
						</Select>
					</div>
					<br />
					<textarea value={this.state.content} name="content" onChange={(e) => this.handleChange(e)} rows="10" style={{width: "50%", marginTop: "50px"}} placeholder={"Instruction Content"}></textarea>
					<br />
					<Button style={{marginTop: "50px"}} variant={"contained"} color={"primary"} onClick={() => this.addInstruction()}>Add Instruction</Button>
					<br />
					<h4 style={{marginTop: "80px"}}>Instruction Steps</h4>
					<div id={"instruction-steps"}>
						{this.state.instructions && this.state.instructions.map((item, index) => {
							return(
                  <Card key={index}>
                    <CardContent>
                      <Typography variant={"headline"} component={"h3"}>{item.title}</Typography>
                      <Typography color={"textSecondary"}>{item.content}</Typography>
                    </CardContent>
										<CardActions>
											<Button color={"primary"} size={"small"}>Edit</Button>
											<Button color={"secondary"} size={"small"}>Delete</Button>
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
