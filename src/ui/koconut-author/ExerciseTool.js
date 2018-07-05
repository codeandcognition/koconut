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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Question from './Question';
import firebase from "firebase";


class ExerciseTool extends Component {
	constructor(props) {
		super(props);
		this.state = {
      currentExercise: {
        prompt: "",
        code: "",
        labels: {},
        questions: [],
        concepts: []
      },
			conceptList: [],
			currentQuestionFormat: 'standAlone',
			isFollowup: false
    }

    // Bind the functions so they can be used in Question.js
		this.addQuestion = this.addQuestion.bind(this);
	}

	QuestionTypes = {
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

	/**
	 *
	 * @param field
	 * @param value
	 */
	updateExercise(field, value) {
		let temp = this.state.currentExercise;
		temp[field] = value;
		this.setState({currentExercise: temp});
	}

	/**
	 * Handles a change in the exercise
	 *
	 * @param field
	 * @returns {Function}
	 */
	handleExerciseChange(field) {
		return (e) => {
			this.updateExercise(field, e.target.value);
		}
	}

	formatAsTable(fieldReqs) {
		return (
				<div>
					<p>Enter the column names <span style={fieldReqs.required}>required</span></p>
					{this.addColumnNameForm()}
					<p>Number of rows<span style={fieldReqs.required}>required</span></p>
					<TextField fullWidth={true} onChange={(evt) => this.handleTableChange('rows', parseInt(evt.target.value))}/>
					<Question addQuestion={this.addQuestion}/>
				</div>
		);

	}

	/**
	 * Updates the current table in the state
	 * @param field
	 * @param value
	 */
	handleTableChange(field, value) {
		let temp = this.state.currentTable;
		temp[field] = value;
		console.log(temp);
		this.setState({currenTable: temp});
	}

	addColumnNameForm() {
		return(
				<div>
					<TextField fullWidth={true}/>
					<Button variant={'outlined'}
									color={'secondary'}>Add column name</Button>
				</div>
		);
	}

  getConcepts(): ConceptKnowledge[] {
    return MasteryModel.model.filter((concept) => concept.teach && !concept.container);
  }

  // Adds current exercises to the database
  addExercise() {
		this.setState({
			exercises: [...this.state.exercises, this.state.currentExercise]
		}, () => {
			var exerciseRef = firebase.database().ref("Exercises");
			exerciseRef.once("value", function(snapshot) {
				var currentExercises = snapshot.val() ? snapshot.val() : [];
				currentExercises.concat(this.state.exercises);
				exerciseRef.set(currentExercises);
			});
		});
	}

	/**
	 * Adds a question to the exercise. `followup` is a boolean indicating whether
	 * this question has a followup
	 *
	 * @param followup
	 */
	addQuestion(question) {
		let exercise = this.state.currentExercise;
		exercise.questions.push(question);
		console.log(exercise);
		this.setState({
			currentExercise: exercise
		});
		window.alert("Preview has been updated");
	}

	// Retrieves all exercises from the database that are associated with the given concept
	// and sets state "exercises" to that list
	getExercisesForConcept(concept) {
		var databaseRef = firebase.database().ref("ConceptExerciseMap/" + concept);
		databaseRef.on("value", function(snapshot) {
			var exerciseList = snapshot.val() ? snapshot.val() : [];
			this.setState({
				exercises: exerciseList
			});
		});
	}

	/**
	 *
	 * @returns {*}
	 */
	renderQuestionCard() {
		let question = <Question addQuestion={this.addQuestion} isFollowup={this.state.isFollowup}/>
		return question;
		// return <Question addQuestion={this.addQuestion} isFollowup={this.state.isFollowup}/>
	}

	/**
	 * Renders the follow up prompt
	 *
	 * @param fieldReqs
	 * @returns {*}
	 */
	renderFollowupPrompt() {
		return (
				<div>
					<Button color={'secondary'}
									onClick={() => this.setState({isFollowup: true})}>Follow-up Question</Button>
					<Button color={"primary"}
									onClick={() => this.setState({isFollowup: false})}>New Question</Button>
				</div>
		);
	}

	renderExercisePreview() {
		let code = {
			border: '1px solid darkgray',
			fontFamily: 'monospace',
			whiteSpace: 'pre-wrap',
			textAlign: 'left',
			width: '100%',
			margin: '10px auto'
		};
		return (
				<div>
					<p>Preview</p>
					<div style={code}>
						{
							JSON.stringify(this.state.currentExercise, null, 2)
						}
					</div>
				</div>
		);
	}

	render() {
		let fieldReqs = {
			required: {
				float: 'right',
				color: '#EF5350'
			},
			optional: {
				float: 'right',
				color: '#4DD0E1'
			}
		}

		return (
				<Paper className={"container"}>
					<div style={{margin: '5%', paddingTop: '5%'}}>
						<p>Exercise {" " + this.state.currentExercise.prompt} </p>
						<div>
							<p className={"text-primary"}>Overarching Prompt <span style={fieldReqs.optional}>optional</span></p>
							<TextField style={{display: 'block'}} fullWidth={true}
												 value={this.state.currentExercise.prompt}
												 onChange={this.handleExerciseChange('prompt')}/>
						</div>

						<div>
							<p className={"text-primary"}>Overarching Code <span style={fieldReqs.optional}>optional</span></p>
							<textarea style={{display: 'block', width: '100%', height: '10em'}}
												onChange={this.handleExerciseChange()} />
						</div>

						<p>Tag concepts for this exercise <span style={fieldReqs.required}>required</span></p>
						<FormControl>
							<NativeSelect onChange={(evt) => this.setState({currentConcept: evt.target.value})}>
								<option>Select concept</option>
								{
									this.state.conceptList.map((concept, index) => {
										return <option key={index} value={concept.name}>{concept.name}</option>
									})
								}
							</NativeSelect>
							<Button variant={'outlined'}
											color={"secondary"}
											onClick={(evt) => {
												if (this.state.currentConcept === '') return;
												let conceptsCopy = [...this.state.currentExercise.concepts];
												conceptsCopy.push(this.state.currentConcept);
												this.updateExercise("concepts", conceptsCopy);
												this.setState({currentConcept: ''});
											}}>Add concept</Button>
						</FormControl>

						<div style={{display: 'block', width: '100%', height: '10em', borderStyle: 'solid', borderColor: '#BBDEFB'}}>
							{
								this.state.currentExercise.concepts.map((concept, key) => {
									return <Button
														key={key}
														style={{backgroundColor: '#ffecb3'}}
														onClick={() => {
																let index = this.state.currentExercise.concepts.indexOf(concept);
																let conceptsCopy = [...this.state.currentExercise.concepts];
																conceptsCopy.splice(index, 1);
																this.updateExercise('concepts', conceptsCopy);
															}
														}>{concept}</Button>
								})
							}
						</div>

						{this.renderExercisePreview()}

						<p>An exercise can have multiple parts, use the following form to add one question at a time!</p>
						{this.renderQuestionCard()}

						{this.state.currentExercise.questions.length > 0 && this.renderFollowupPrompt()}

						<Button variant={"contained"}
										color={"primary"}
										onClick={() => this.addExercise()}>Add Exercise</Button>
						</div>
				</Paper>
		);
	}
}

export default ExerciseTool;
