import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import conceptInventory from './ConceptMap';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';

class InstructTool extends Component {

	constructor(props) {
		super(props);
		this.state = {
			instructions: [],
			//Math.round(Math.random() * 999999999)
			name: "",
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
		this.setState(changes);
	}

	addInstruction = () => {
		let instruction = {
			id: Math.round(Math.random() * 999999999),
			name: this.state.name,
			concept: this.state.concept,
			type: this.state.type,
			content: this.state.content
		};
		this.setState({
			instructions: [...this.state.instructions, instruction],
			name: "",
			concept: "",
			type: "",
			content: ""
		});
	}

	getPreview = () => {
		return JSON.stringify({
			id: "___ (generated on add) ___",
			name: this.state.name,
			concept: this.state.concept,
			type: this.state.type,
			content: this.state.content
		}, null, 2)
	}

	getCodeOutput = () => {
		"let variable" + Math.round(Math.random() * 9999999).toString() + " = "
		+ JSON.stringify(this.state.instructions) + ";"
	}



	render() {
		var containerStyle = {
			width: "80vw",
			margin: "auto",
			padding: "80px",
			textAlign: "center"
		}

		return (
				<Paper style={containerStyle} elevation={4}>
					<TextField label={"Instruction Name"} style={{width: "30%"}} value={this.state.name} name="name" onChange={(e) => this.handleChange(e)}/>
					<br />
					<div className="concept-select" style={{marginTop: "50px"}}>
						<InputLabel htmlFor={"concept-selector"}>Choose Concept</InputLabel>
						<Select id={"concept-selector"}
										autoWidth={true}
										value={this.state.concept}
										style={{marginLeft: "100px"}}
										onChange={(e) => this.setState({concept: e.target.value})}>
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
										value={this.state.type}
										style={{marginLeft: "100px"}}
										onChange={(e) => this.setState({type: e.target.value})}>
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
					<textarea rows={"10"} style={{width: "50%"}} value={JSON.stringify(this.state.instructions, null, 2)}></textarea>
				</Paper>
		);
	}
}

export default InstructTool;
