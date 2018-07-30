import React, {Component} from 'react';
import ConceptNetwork from './ConceptNetwork';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CardContent from '@material-ui/core/CardContent';
import NativeSelect from '@material-ui/core/NativeSelect';
import Button from '@material-ui/core/Button/Button';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import ConceptInventory from './ConceptMap';

class ConceptEditorView extends Component {
	constructor(props) {
		super(props);
		let concept = {
			container: false,
			dependencies: [],
			explanations: {
				definition: "",
				examples: [],
				future: [],
				name: ""
			},
			parents: [],
			should_teach: false,
			type: ''
		};

		this.state = {
			inventory: Object.assign({}, ConceptInventory),
			currentDependency: '',
			currentParent: '',
			concept: concept,
			conceptDescriptor: '',
			activeOutput: false,
			output: {},
			g: {}
		};
	}

	fieldReqs = {
		required: {
			float: 'right',
			color: '#EF5350',
			fontWeight: 'normal',
		},
		optional: {
			float: 'right',
			color: '#4DD0E1',
			fontWeight: 'normal',
		},
		title: {
			color: '#3F51B5',
			fontWeight: 'bold'
		}
	};

	Types = {
		semantic: "semantic",
		template: "template",
		onboarding: "onboarding"
	};

	g = {
		howCodeRuns: "howCodeRuns",
		dataTypes: "dataTypes",
		printStatements: "printStatements",
		variables: "variables",
		arithmeticOperators: "arithmeticOperators",
		relationalOperators: "relationalOperators",
		variableSwap: "variableSwap",
		digitProcessing: "digitProcessing",
		floatEquality: "floatEquality",
		conditionals: "conditionals",
		findMaxMin: "findMaxMin"
	};

	/**
	 * Renders ui fields for building a concept card
	 */
	newConceptCard() {
		let buttonStyle = {
			margin: '15px 0 15px 0'
		};

		return (
				<Card>
					<CardContent>
						{this.selectDependencies()}
						<br/>
						{this.selectParents()}
						<br/>
						{this.addExplanations()}
						<br/>

						{/* */}
						<p style={this.fieldReqs.title}>Concept Descriptor <span style={this.fieldReqs.required}>required</span></p>
						<TextField fullWidth
											 value={this.state.conceptDescriptor}
											 onChange={evt => this.setState({conceptDescriptor: evt.target.value})}/>

						<br/><br/>
						{this.shouldBeTaught()}
						<br/>
						{this.isAContainer()}
						<br/>
						{this.conceptType()}
						<br/>
						{this.preview()}
						<Button style={buttonStyle} variant={'contained'} onClick={() => this.verifyCompletion()}>Generate JSON</Button>
					</CardContent>
				</Card>
		);
	}

	/**
	 * Form to add parents of a current concept
	 */
	selectParents() {
		// TODO: Delete later
		let concepts = [];
		Object.keys(ConceptInventory).forEach((key, index) => {
			concepts.push( <option key={index}>{key}</option>);
		});
		return(
				<div>
					<p>Add all parents <span style={this.fieldReqs.required}>required</span></p>
					<div style={{display: 'flex', justifyContent: 'center'}}>
						<FormControl>
							<NativeSelect value={this.state.currentParent}
														onChange={this.handleChange('parents')}>
								<option>Add one at a time</option>
								{concepts}
							</NativeSelect>
						</FormControl>
						<Button variant={'contained'}
										color={'secondary'}
										style={{margin: '0 15px 0 15px'}}
										onClick={() => {
											this.addRelatedConcepts('parent', this.state.currentParent);
										}}>
							Add parent
						</Button>
					</div>
					<div>TODO: display current parents</div>
				</div>
		);
	}

	/**
	 * Form to add children of a current concept
	 */
	selectDependencies() {
		let concepts = [];
		Object.keys(ConceptInventory).forEach((key, index) => {
			concepts.push( <option key={index}>{key}</option>);
		});

		return (
				<div>
					<p style={this.fieldReqs.title}>Add all dependencies <span style={this.fieldReqs.required}>required</span></p>
					<div style={{display: 'flex', justifyContent: 'center'}}>
						<FormControl>
							<NativeSelect value={this.state.currentDependency}
														onChange={this.handleChange('dependencies')}>
								<option>Add one at a time</option>
								{concepts}
							</NativeSelect>
						</FormControl>
						<Button
								variant={'contained'}
								color={'secondary'}
								style={{margin: '0 15px 0 15px'}}
								onClick={() => {
									this.addRelatedConcepts('dependency', this.state.currentDependency);
								}}>
							Add dependency
						</Button>
					</div>
					<div>TODO: display current dependencies</div>
				</div>
		);
	}

	/**
	 * UI fields to add concept meta data: name, description, examples, future
	 */
	addExplanations() {
		return (
				<div>
					<p style={this.fieldReqs.title}>Concept Explanation</p>
					<p>Name <span style={this.fieldReqs.required}>required</span></p>
					<TextField fullWidth
										 value={this.state.concept.explanations.name}
										 onChange={this.handleChange('name')}/>

					<p>Definition <span style={this.fieldReqs.required}>required</span></p>
					<textarea value={this.state.concept.explanations.definition}
										onChange={this.handleChange('definition')} style={{width: '100%', height: '5em'}}/>
					{
						/* TODO
								Extend this to add examples and future fields.
								Examples and Future fields of all current concepts are empty
						*/
					}
				</div>
		);
	}

	/**
	 * Renders UI fields for concept props
	 * @returns {*}
	 */
	shouldBeTaught() {
		return (
				<div>
					<p>Is the concept going to be taught on Koconut? <span style={this.fieldReqs.required}>required</span></p>
					<RadioGroup value={this.state.concept.should_teach ? 'yes' : 'no'} onChange={this.handleChange('should_teach')}>
						<FormControlLabel value={'yes'} control={<Radio color={"primary"}/>} label={"Yes"}/>
						<FormControlLabel value={'no'} control={<Radio color={"primary"}/>} label={"No"}/>
					</RadioGroup>
				</div>
		);
	}

	/**
	 * Renders UI fields for concept props
	 * @returns {*}
	 */
	isAContainer() {
		return (
				<div>
					<p>Is this a container? <span style={this.fieldReqs.required}>required</span></p>
					<RadioGroup value={this.state.concept.container ? 'yes' : 'no'} onChange={this.handleChange('container')}>
						<FormControlLabel value={'yes'} control={<Radio color={"primary"}/>} label={"Yes"}/>
						<FormControlLabel value={'no'} control={<Radio color={"primary"}/>} label={"No"}/>
					</RadioGroup>
				</div>
		);
	}

	/**
	 * Renders UI fields for concept props
	 * @returns {*}
	 */
	conceptType() {
		let types = [];
		Object.keys(this.Types).forEach((item, index) => {
			types.push(<option key={index}>{item}</option>);
		});

		return (
				<div>
					<p style={this.fieldReqs.title}>Type of concept <span style={this.fieldReqs.required}>required</span></p>
					<FormControl>
						<NativeSelect value={this.state.concept.type} onChange={this.handleChange('type')}>
							<option>Select a type</option>
							{types}
						</NativeSelect>
					</FormControl>
				</div>
		);
	}

	/**
	 * Displays a JSON preview of the current concept
	 * @returns {*}
	 */
	preview() {
		let code = {
			fontFamily: 'Monospace',
			width: '100%',
			height: '20em'
		};

		return (
				<div>
					<p>Preview</p>
					<textarea style={code} value={JSON.stringify(this.state.concept, null, 2)} disabled={true} />
				</div>
		);
	}

	/**
	 * handles a change to the current concept
	 *
	 * @param field
	 * @returns {Function}
	 */
	handleChange(field) {
		return (e) => {
			if (field === 'parents') {
				this.setState({
					currentParent: e.target.value,
				});
			} else if (field === 'dependencies') {
				this.setState({
					currentDependency: e.target.value,
				});
			} else if (field === 'name' || field === 'definition') {
				this.updateExplanation(field, e.target.value);
			} else {
				this.updateConcept(field, e.target.value);
			}
		}
	}

	/**
	 * 
	 * @param relation
	 * @param conceptName
	 */
	addRelatedConcepts(relation, conceptName) {
		if (relation === 'parent') {
			let parents = Object.assign([], this.state.concept.dependencies);
			parents.push(conceptName);
			this.updateConcept('parents', parents);
		} else if (relation === 'dependency') {
			let dependencies = Object.assign([],this.state.concept.dependencies);
			dependencies.push(conceptName);
			this.updateConcept('dependencies', dependencies);
		}
	}

	updateExplanation(prop, value) {
		let temp = Object.assign({}, this.state.concept.explanations);
		temp[prop] = value;
		this.updateConcept('explanations', temp);
	}

	/**
	 * Updates the current concept being created
	 *
	 * @param field
	 * @param value
	 */
	updateConcept(field, value) {
		let tempConcept = Object.assign({}, this.state.concept);
		tempConcept[field] = value;
		if (field === 'should_teach' || field === 'container') {
			tempConcept[field] = value === 'yes';
		}
		this.setState({
			concept: tempConcept
		});
	}

	verifyCompletion() {
		if (this.state.concept.type !== ''
				&& this.state.concept.explanations.name !== ''
				&& this.state.concept.explanations.definition !== '') {
			this.addConcept();
		} else {
			window.alert('At least one of the required fields is missing.')
		}
	}

	addConcept() {
		let conceptInventory = JSON.stringify(Object.assign({}, ConceptInventory));
		let concept = JSON.stringify(Object.assign({}, this.state.concept));

		// adjust the concept string so that it can be concatenated with concept inventory
		concept = "\"" + this.state.conceptDescriptor + "\":" + concept;

		conceptInventory = conceptInventory.substr(0, conceptInventory.length - 1);
		conceptInventory += ",";
		conceptInventory = conceptInventory + concept;
		conceptInventory += "}";

		// to update the concept network
		this.setState({inventory: JSON.parse(conceptInventory)});

		// replace concept names with constants
		let conceptConstants = Object.assign({}, this.g);
		conceptConstants[this.state.conceptDescriptor] = this.state.conceptDescriptor;
		this.setState({g: Object.assign({}, conceptConstants)});
		let reversedConstants = this.reverseConceptConstants(conceptConstants);
		Object.keys(reversedConstants).forEach(key => {
			let value = reversedConstants[key];
			let test = new RegExp("\"" + key + "\"", 'g');
			conceptInventory = conceptInventory.replace(test, value);
			conceptInventory = conceptInventory.replace("" + value + ":", "\"[" + value + "]\":");
		});

		// replace concept types
		let reversedConceptTypes = this.reverseConceptTypes();
		Object.keys(reversedConceptTypes).forEach(key => {
			let value = reversedConceptTypes[key];
			let test = new RegExp("\"" + key + "\"", 'g');
			conceptInventory = conceptInventory.replace(test, value);
		});

		this.setState({
			activeOutput: true,
			output: conceptInventory
		});
	}

	previewConceptInventory() {
		let output = {
			fontFamily: 'Monospace',
			width: '100%',
			height: '30em'
		};

		if (this.state.activeOutput) {
			return (
					<div>
						<p>Concept Inventory Preview</p>
						<p>Set this equal to conceptInventory in ConceptMap.js</p>
						<textarea style={output} value={this.state.output} disabled={true}/>
						<p>Set this equal to g in ConceptMap.js</p>
						<textarea style={output} value={JSON.stringify(this.state.g, null, 2)} disabled={true}/>
					</div>
			);
		}
	}

	reverseConceptConstants(conceptConstants) {
		let result = {};
		Object.keys(conceptConstants).forEach((key) => {
			result[key] = "g." + key;
		});
		return result;
	}

	reverseConceptTypes() {
		let result = {};
		Object.keys(this.Types).forEach(key => {
			result[key] = "t." + key;
		});
		return result;
	}

	render() {
		return(
				<Paper>
					<ConceptNetwork inventory={this.state.inventory}/>
					{this.newConceptCard()}
					{this.previewConceptInventory()}
				</Paper>
		);
	}
}

export default ConceptEditorView;