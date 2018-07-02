/*

`7MMF'     A     `7MF' db      `7MM"""Mq.  `7MN.   `7MF'`7MMF'`7MN.   `7MF' .g8"""bgd  OO
  `MA     ,MA     ,V  ;MM:       MM   `MM.   MMN.    M    MM    MMN.    M .dP'     `M  88
   VM:   ,VVM:   ,V  ,V^MM.      MM   ,M9    M YMb   M    MM    M YMb   M dM'       `  ||
    MM.  M' MM.  M' ,M  `MM      MMmmdM9     M  `MN. M    MM    M  `MN. M MM           ||
    `MM A'  `MM A'  AbmmmqMA     MM  YM.     M   `MM.M    MM    M   `MM.M MM.    `7MMF'`'
     :MM;    :MM;  A'     VML    MM   `Mb.   M     YMM    MM    M     YMM `Mb.     MM  ,,
      VF      VF .AMA.   .AMMA..JMML. .JMM..JML.    YM  .JMML..JML.    YM   `"bmmmdPY  db


                 === The following code is super-not documented!!! ===
*/

import React, {Component} from 'react';
import conceptInventory from './ConceptMap';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import Button from '@material-ui/core/Button/Button';
import {ConceptKnowledge, MasteryModel} from '../../data/MasteryModel';


class ExerciseTool extends Component {
	constructor(props) {
		super(props);
		this.state = {
			exercises: [],
			currentExercise: {
				prompt: '',
				code: '',
				difficulty: 0,
				choices: [],
				type: '',
				concepts: []
			},
			currentAnswer: '',
			currentChoice: '',
			currentConcept: '',
			conceptList: []
		};
	}

	ExerciseTypes = {
		survey: 'survey',
		writeCode: 'writeCode',
		fillBlank: 'fillBlank',
		highlightCode: 'highlightCode',
		multipleChoice: 'multipleChoice',
		shortResponse: 'shortResponse',
		memoryTable: 'memoryTable'
	};

	componentDidMount() {
		var list = this.getConcepts();
		this.setState({
			conceptList: list
		})
	}

	updateExercise(field, value) {
		console.log(`updating ${field} with ${value}`);
		let disgustingDeepCopy = JSON.parse(JSON.stringify(this.state.currentExercise));
		disgustingDeepCopy[field] = value;
		this.setState({currentExercise: disgustingDeepCopy});
	}

	handleChange(field) {
		return (e) => {
			this.updateExercise(field, e.target.value);
		}
	}

	/**
	 * renders choices and answer
	 */
	renderAnswer() {
		if (this.state.currentExercise.choices.length < 1) {
			return(
					<div>
						<TextField fullWidth={true}
											 style={{display: 'block'}}
											 onChange={(evt) => this.setState({currentAnswer: evt.target.value})}
											 value={this.state.currentAnswer}
						/>
						<br/>
					</div>
			);
		} else {
			return (
					<FormControl style={{display: 'block'}}
											 fullWidth={true}>
						<label className={"text-primary"}>
							Answer
						</label>
						<br/>
						<NativeSelect name={"Answer"}
													onChange={(evt) => this.setState({currentAnswer: evt.target.value})}>
							<option value="">Select answer</option>
							{
								this.state.currentExercise.choices.map((key, index) => {
									return <option value={key} key={index}>{key}</option>
								})
							}
						</NativeSelect>
					</FormControl>
			)
		}
	}

	renderPrompt() {
		return (<textarea
				className="prompt"
				onChange={this.handleChange('prompt')}
				value={this.state.currentExercise.prompt}
		>
              </textarea>)
	}

  getConcepts(): ConceptKnowledge[] {
    return MasteryModel.model.filter((concept) => concept.teach && !concept.container);
  }

	render() {
		let code = {
			border: '1px solid darkgray',
			fontFamily: 'monospace',
			whiteSpace: 'pre-wrap',
			textAlign: 'left',
			width: '100%',
			margin: '10px auto'
		};

		return (
				<Paper className={"container"}>
					<div style={{margin: '5%', paddingTop: '5%'}}>
						<p>Exercise: ...... </p>
						<div>
							<label className={"text-primary"}>Overarching Prompt (Optional)</label>
							<TextField style={{display: 'block'}} fullWidth={true}
												 value={this.state.currentExercise.prompt}
												 onChange={this.handleChange('prompt')}/>
						</div>
						<br/>

						<div>
							<label className={"text-primary"}>Overarching Code (Optional)</label>
							<textarea style={{display: 'block', width: '100%', height: '10em'}}
												onChange={this.handleChange()}></textarea>
						</div>
						<br />

						<div>
							<label className={"text-primary"}>Exercise Type</label>
							<FormControl style={{display: 'block'}}
													 fullWidth={true}>
								<NativeSelect name={"Exercise Type"}
															onChange={this.handleChange('type')}>
									<option>Select exercise type</option>
									{
										Object.keys(this.ExerciseTypes).map((key, index) => {
											return <option value={key} key={index}>{key}</option>
										})
									}
								</NativeSelect>
							</FormControl>
						</div>
						<br />

						<div>
							<label className={"text-primary"}>Choices</label>
							<TextField fullWidth={true}
												 style={{display: 'block'}}
												 onChange={(evt) => this.setState({currentChoice: evt.target.value})}
												 value={this.state.currentChoice}/>
							<br/>

							<Button variant={'outlined'}
											color={'secondary'}
											onClick={(evt) => {
												if (this.state.currentChoice === '') return;
												let choicesCopy = [...this.state.currentExercise.choices];
												choicesCopy.push(this.state.currentChoice);
												this.updateExercise('choices', choicesCopy);
												this.setState({currentChoice: ''});
											}}>
								Add choice
							</Button>
						</div>
						<br/>

						<div style={{width: '100%', height: '10em', borderStyle: 'solid', borderColor: '#BBDEFB'}}>
							{/* This is where the output appears */}
							{
								this.state.currentExercise.choices.map((choice, key) => {
									return(
											<Button onClick={(evt) => {
												let index = this.state.currentExercise.choices.indexOf(evt.target.innerText);
												let choicesCopy = [...this.state.currentExercise.choices];
												choicesCopy.splice(index, 1);
												this.updateExercise('choices', choicesCopy);
											}}
															key={key}
															variant={'flat'}
															className={"bg-warning"}
															style={{margin: '.25%'}}>
												{choice}
											</Button>
									);
								})
							}
						</div>
						<br/>

						<div>{this.renderAnswer()}</div>
						<br/>

						<div>
							<label className={"text-primary"}>Concepts</label>
							<FormControl style={{display: 'block'}}>
								<NativeSelect name={"Concept name"}
															onChange={(evt) => this.setState({currentConcept: evt.target.value})}>
									<option value={""}>Select concept</option>
									{
										this.state.conceptList.map((concept, index) => {
											return <option key={index} value={concept.name}>{concept.name}</option>
										})
									}
								</NativeSelect>
							</FormControl>
							<br />

							<Button variant={'outlined'}
											color={"secondary"}
											onClick={(evt) => {
												if (this.state.currentConcept === '') return;
												let conceptsCopy = [...this.state.currentExercise.concepts];
												conceptsCopy.push(this.state.currentConcept);
												this.updateExercise('concepts', conceptsCopy);
												this.setState({currentConcept: ''});
											}}>
								Add concept
							</Button>
						</div>
						<br/>

						<div style={{display: 'block', width: '100%', height: '10em', borderStyle: 'solid', borderColor: '#BBDEFB'}}>
							{/* concept list appears here */}
							{
								this.state.currentExercise.concepts.map((concept, key) => {
									return (
											<Button key={key}
															onClick={(evt) => {
																let index = this.state.currentExercise.concepts.indexOf(concept);
																let conceptsCopy = [...this.state.currentExercise.concepts];
																conceptsCopy.splice(index, 1);
																this.updateExercise('concepts', conceptsCopy);
															}}
															className={"bg-warning"}
															style={{margin: '0.25%'}}>
												{concept}
											</Button>
									);
								})
							}
						</div>
						<br/>


						<div>
							<p><b>Preview</b></p>
							<div style={code}>
								{
									/* code output */
									JSON.stringify({
										exercise: this.state.currentExercise,
										answer: this.state.currentAnswer,
									}, null, 2)
								}
							</div>
						</div>
						<Button variant={'outlined'}
										color={'secondary'}
										onClick={(evt) => {
											if (this.state.currentExercise.prompt !== ''
													&& this.state.currentAnswer !== ''
													&& this.state.currentExercise.type !== '') {
												this.setState({
													exercises: [...this.state.exercises, {
														exercise: this.state.currentExercise,
														answer: this.state.currentAnswer
													}],
													currentExercise: {
														prompt: '',
														code: '',
														difficulty: 0,
														choices: [],
														concepts: [],
														type: ''
													},
													currentAnswer: ''
												});
											}
										}}>
							Add exercise!
						</Button>
						<br /><br/>

						<label className={"text-primary"}>Exercies</label>
						<div style={{display: 'block', width: '100%', height: '10em', borderStyle: 'solid', borderColor: '#BBDEFB'}}>
							{
								this.state.exercises.map((exercise, key) => {
									return(
											<Button className={'bg-warning'}
															style={{margin: '0.25%'}}
															key={key}
															onClick={(evt) => {
																let index = this.state.exercises.indexOf(exercise);
																let exercisesCopy = [...this.state.exercises];
																exercisesCopy.splice(index, 1);
																this.setState({exercises: exercisesCopy});
															}}>
												{exercise.exercise.prompt}
											</Button>
									);
								})
							}
						</div>
						<br/>

						<p className={"text-primary"}>JSON Output</p>
						<div style={code}>
							{JSON.stringify(this.state.exercises, null, 2)}
						</div>
						<div style={code}>
							{"let variable" + Math.round(Math.random() * 99999).toString() + " = "
							+ JSON.stringify(this.state.exercises) + ";"}
						</div>
					</div>
				</Paper>
		);
	}
}

export default ExerciseTool;
