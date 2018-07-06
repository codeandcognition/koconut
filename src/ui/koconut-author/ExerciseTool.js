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
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
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
			isFollowup: false,
			currentChoice: '',
			tabValue: 0
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

  // Adds current exercises to the database in Exercises branch and ConceptExerciseMap branch
	// ordered by difficulty
  addExercise() {  // NOT TESTED
		var exerciseRef = firebase.database().ref("Exercises");
		exerciseRef.once("value", function(snapshot) {
			var currentExercises = snapshot.val() ? snapshot.val() : [];
			currentExercises.push(this.state.currentExercise);
			exerciseRef.set(currentExercises);
		});

		this.state.currentExercise.concepts.forEach((item) => {
			var conceptRef = firebase.database().ref("ConceptExerciseMap/" + item);
			conceptRef.once("value", function(snapshot) {
				var currentExercises = snapshot.val() ? snapshot.val() : [];

				var currentDifficulty = this.getAverageDifficulty(this.state.currentExercise, 0, 0, 0);
				for (var i = 0; i < currentExercises.length; i++) {
					var avgDifficulty = this.getAverageDifficulty(currentExercises[i], 0, 0, 0);
					if (avgDifficulty > currentDifficulty) {
						currentExercises.splice(i, 0, this.state.currentExercise);
					}
				}
				conceptRef.set(currentExercises);
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

	// Helper function: returns the average difficulty of given exercise based on
	// the difficulties of each of its questions
	getAverageDifficulty(exercise, questionIndex, total, count) { // NOT TESTED
		if (!exercise) {
			return 0;
		} else if (exercise.questions[questionIndex]) {
			var difficulty = exercise.questions[questionIndex].difficulty;
			var newTotal = total + difficulty;
			return this.getAverageDifficulty(exercise, questionIndex + 1, newTotal, count + 1);
		} else {
			return total / count;
		}
	}

	// Adds current table data stored in state to the current exercise stored in state
	addTableData() {
	  var exercise = this.state.currentExercise;
	  exercise.tables.push(this.state.currentTableData);
	  this.setState({
      currentExercise: exercise
    });
  }

	// Retrieves all exercises from the database that are associated with the given concept
	// and sets state "exercises" to that list
	getExercisesForConcept(concept) {
		var componentRef = this;
		var databaseRef = firebase.database().ref("ConceptExerciseMap/" + concept);
		databaseRef.on("value", function(snapshot) {
			var exerciseList = snapshot.val() ? snapshot.val() : [];
			componentRef.setState({
				exercises: exerciseList
			});
		});
	}

	renderQuestionCard() {
		return <Question addQuestion={this.addQuestion} isFollowup={this.state.isFollowup}/>
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

	/**
	 *
	 * @returns {*}
	 */
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

	renderBuildExercise() {
    let code = {
      border: '1px solid darkgray',
      fontFamily: 'monospace',
      whiteSpace: 'pre-wrap',
      textAlign: 'left',
      width: '100%',
      margin: '10px auto'
    };

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
				<div>
          <div>
            <p>Exercise {" " + this.state.currentExercise.prompt} </p>
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

          <p>An exercise can have multiple parts, use the following form to add one question at a time!</p>
					{this.renderQuestionCard()}
					<Button variant={"contained"} color={"primary"} onClick={() => this.addExercise()}>Add Exercise</Button>
				</div>
		);
	}

	renderViewExercise() {
		return (
			<div style={{marginTop: "6%"}}>
        <NativeSelect onChange={(evt) => {
        	this.getExercisesForConcept(evt.target.value);
        }}>
          <option>Select concept</option>
          {this.state.conceptList.map((concept, index) => {
              return <option key={index} value={concept.name}>{concept.name}</option>
					})}
					{this.state.exercises.map((exercise, index) => {
						return (
							<Card>
								<CardContent>
									<Typography>{exercise.prompt}</Typography>
								</CardContent>
							</Card>
						);
					})}
        </NativeSelect>
			</div>
		);
	}

	handleTabChange(value) {
		this.setState({
			tabValue: value
		})
	}

	render() {
		return (
				<Paper style={{padding: "60px"}} className={"container"}>
          <Tabs indicatorColor={"primary"} value={this.state.tabValue} onChange={(e, value) => this.handleTabChange(value)}>
            <Tab label={"Build Exercise"} />
            <Tab label={"View Exercises"} />
          </Tabs>
					{this.state.tabValue == 0 ?
						this.renderBuildExercise() : this.renderViewExercise()
					}
				</Paper>
		);
	}
}

export default ExerciseTool;
