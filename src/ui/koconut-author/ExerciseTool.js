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
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import Button from '@material-ui/core/Button/Button';
import {ConceptKnowledge, MasteryModel} from '../../data/MasteryModel';
import Question from './Question';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
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
			currentTable: {
				colNames: [],
				rows: 0,
				data: {}
			},
			columnNames: [],
			tabValue: 0,
			exercises: {},
			tabValue: 0,
      allExercises: {},
			editMode: false,
			editID: "",
			editedExercise: "",
			editError: "",
			selectedConcept: ""
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
		});

		this.getAllExercises();
	}

	getAllExercises() {
    var componentRef = this;
    var exerciseRef = firebase.database().ref("Exercises");
    exerciseRef.on("value", function(snapshot) {
      componentRef.setState({
        allExercises: snapshot.val() ? snapshot.val() : {}
      });
    });
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

	/**
	 * TODO: Determine if this is being used anywhere
	 *
	 * @param field
	 * @param value
	 */
	handleTableChange(field, value) {
		let temp = this.state.currentTable;
		temp[field] = value;
		this.setState({currentTable: temp});
	}

	/**
	 * Renders the list of all concepts in the dropdown menu
	 *
	 * @returns {T[]}
	 */
  getConcepts(): ConceptKnowledge[] {
    return MasteryModel.model.filter((concept) => concept.teach && !concept.container);
  }

	/**
	 * Adds current exercises to the database in Exercises branch and
	 * ConceptExerciseMap branch ordered by difficulty
	 */
  addExercise() {
		var pushKey = firebase.database().ref().child("Exercises").push().key;
		var exerciseRef = firebase.database().ref("Exercises/" + pushKey);
		exerciseRef.set(this.state.currentExercise);

		var componentRef = this;
		var difficulty = this.getAverageDifficulty(this.state.currentExercise, 0, 0, 0);
		this.state.currentExercise.concepts.forEach((concept) => {
			var conceptRef = firebase.database().ref("ConceptExerciseMap/" + concept);
		  conceptRef.once("value", function(snapshot) {
		    if (snapshot.val()) { // Concepts array exists
		      var exerciseKeys = snapshot.val();
		      var didInsertKey = false;
		      var index = 0;
		      while (didInsertKey == false) {
		        var otherDifficulty = componentRef.getAverageDifficulty(componentRef.state.allExercises[exerciseKeys[index]], 0, 0, 0);
		        if (otherDifficulty >= difficulty) {
		          exerciseKeys.splice(index, 0, pushKey);
		          didInsertKey = true;
            } else if (index == exerciseKeys.length) {
		          exerciseKeys.push(pushKey);
		          didInsertKey = true;
            }
            index = index + 1;
          }
          conceptRef.set(exerciseKeys);
        } else { // Concepts array does not exist
		      conceptRef.set([pushKey]);
        }
      });
    });
		window.alert('Exercise has been added to Firebase!');
		this.resetExerciseUI();
	}

	/**
	 * Helper function: returns the average difficulty of given exercise based
	 * on the difficulties of each of its questions
	 *
	 * @param exercise
	 * @param questionIndex
	 * @param total
	 * @param count
	 * @returns {*}
	 */
  getAverageDifficulty(exercise, questionIndex, total, count) {
    if (!exercise) {
      return 0;
    } else if (exercise.questions[questionIndex]) {
      var difficulty = Number(exercise.questions[questionIndex].difficulty);
      var newTotal = total + difficulty;
      return this.getAverageDifficulty(exercise, questionIndex + 1, newTotal, count + 1);
    } else {
      return total / count;
    }
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
		this.setState({
			currentExercise: exercise
		});
	}

	/**
	 * Retrieves all exercises from the database that are associated with the given concept
	 * and sets state "exercises" to that list
	 *
	 * @param concept
	 */
	getExercisesForConcept(concept) {
		var componentRef = this;
		var conceptRef = firebase.database().ref("ConceptExerciseMap/" + concept);
    this.setState({
			exercises: {},
      selectedConcept: concept
    });
		conceptRef.on("value", function(snapshot) {
			var exerciseKeys = snapshot.val() ? snapshot.val() : [];
			var exerciseList = {};
			exerciseKeys.forEach((id) => {
        exerciseList[id] = componentRef.state.allExercises[id];
			});
			componentRef.setState({
				exercises: exerciseList
			})
		});
	}

	/**
	 * Toggles between Build Exercise and View Exercises Tab
	 *
	 * @param value
	 */
	handleTabChange(value) {
    this.setState({
      tabValue: value
    })
  }

	/**
	 * Renders a single question card
	 *
	 * @returns {*}
	 */
	renderQuestionCard() {
		return <Question addQuestion={this.addQuestion} isFollowup={this.state.isFollowup} insideTable={false} data={undefined}/>
	}

	/**
	 * Renders the follow up prompt
	 *
	 * @param fieldReqs
	 * @returns {*}
	 */
	renderFollowupPrompt() {
		let style = {
			margin: '5px'
		};

		return (
				<div>
					<Button style={style}
									variant={'outlined'}
									color={'secondary'}
									onClick={() => this.setState({isFollowup: true})}>Follow-up Question</Button>
					<Button style={style}
									variant={'outlined'}
									color={"primary"}
									onClick={() => this.setState({isFollowup: false})}>New Question</Button>
				</div>
		);
	}

	/**
	 * Renders the current exercise preview
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
					<p style={{color: '#3F51B5'}}>Preview</p>
					<div style={code}>
						{
							JSON.stringify(this.state.currentExercise, null, 2)
						}
					</div>
				</div>
		);
	}

	handleDeleteExercise(exerciseID) {
		this.state.allExercises[exerciseID].concepts.forEach((concept) => {
		  var conceptRef = firebase.database().ref("ConceptExerciseMap/" + concept);
		  conceptRef.once("value", function(snapshot) {
		    if (snapshot.val()) {
		      var exerciseKeys = snapshot.val();
		      var index = exerciseKeys.indexOf(exerciseID);
		      if (index > -1) {
		        exerciseKeys.splice(index, 1);
          }
          conceptRef.set(exerciseKeys);
        }
      });
    });
		var exerciseRef = firebase.database().ref("Exercises/" + exerciseID);
		exerciseRef.set(null);
	}

	// TODO: Update ordering of exercises in ConceptExerciseMap branch of
	// database if user changes the difficulties of exercise questions
	saveEditedExercise() {
		try {
			var updatedExercise = JSON.parse(this.state.editedExercise);
			var exerciseRef = firebase.database().ref("Exercises/" + this.state.editID);
			exerciseRef.set(updatedExercise);
			this.setState({
				editMode: false,
				editID: "",
				editedExercise: ""
			});
		} catch (e) {
			this.setState({
				editError: "Invalid JSON string. Error message: " + e.message
			});
		}
	}

	renderBuildExercise() {
    let code = {
      border: '1px solid darkgray',
      fontFamily: 'monospace',
      whiteSpace: 'pre-wrap',
      textAlign: 'left',
      width: '100%',
			height: '10em',
			display: 'block'
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

    let formSectionStyle = {
    	marginBottom: "30px"
		}

		let sectionHeading = {
    	color: '#3F51B5'
		}

		return (
				<div style={{marginTop: "50px"}}>
          <div style={formSectionStyle}>
            <p>Exercise: {" " + this.state.currentExercise.prompt} </p>
            <p style={sectionHeading}>Overarching Prompt <span style={fieldReqs.optional}>optional</span></p>
            <TextField style={{display: 'block'}} fullWidth={true}
                       value={this.state.currentExercise.prompt}
                       onChange={this.handleExerciseChange('prompt')}/>
          </div>

          <div style={formSectionStyle}>
            <p style={sectionHeading}>Overarching Code <span style={fieldReqs.optional}>optional</span></p>
            <textarea style={code}
                      onChange={this.handleExerciseChange('code')} />
          </div>

					<div style={formSectionStyle}>
						<p style={sectionHeading}>Tag concepts for this exercise <span style={fieldReqs.required}>required</span></p>
						<FormControl style={{display: "flex", flexDirection: "row", justifyContent: "center", marginBottom: "30px"}}>
							<NativeSelect onChange={(evt) => {
											evt.preventDefault();
											this.setState({currentConcept: evt.target.value});
											}}
														style={{width: "30%", marginRight: "15px"}}>
								<option>Select concept</option>
								{
									this.state.conceptList.map((concept, index) => {
										return <option key={index} value={concept.name}>{concept.name}</option>
									})
								}
							</NativeSelect>
							<Button variant={'outlined'}
											style={{width: "30%", marginLeft: "15px"}}
											color={"secondary"}
											onClick={(evt) => {
												evt.preventDefault();
												if (this.state.currentConcept === '') return;
												let conceptsCopy = [...this.state.currentExercise.concepts];
												conceptsCopy.push(this.state.currentConcept);
												this.updateExercise("concepts", conceptsCopy);
												this.setState({currentConcept: ''});
											}}>Add concept</Button>
						</FormControl>
            <div style={{display: 'inline'}}>
              {
                this.state.currentExercise.concepts.map((concept, key) => {
                  return <Button
                      key={key}
                      style={{backgroundColor: '#ffecb3', margin: '3px'}}
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
					</div>

          <p>An exercise can have multiple parts, use the following form to add one question at a time!</p>
					{this.renderQuestionCard()}
					<br/>
					{this.renderExercisePreview()}
					{this.renderFollowupPrompt()}
					<br/>
					<Button variant={"contained"} color={"primary"} onClick={() => this.addExercise()}>Add Exercise</Button>
				</div>
		);
	}

	/**
	 * Clear the UI once the exercise has been added
	 */
	resetExerciseUI() {
		// resets the state
		this.setState({
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
			currentTable: {
				colNames: [],
				rows: 0,
				data: {}
			},
			columnNames: [],
			tabValue: 0,
			exercises: {},
			tabValue: 0,
			allExercises: {},
			editMode: false,
			editID: "",
			editedExercise: "",
			editError: "",
			selectedConcept: ""
		});
	}

	renderViewExercises() {

		var editorStyles = {
			width: "80%",
			height: "200px",
			marginTop: "60px"
		}

		var buttonContainerStyles = {
      marginTop: "30px",
			width: "50%",
    }

		return (
			<div style={{marginTop: "6%"}}>
        <NativeSelect onChange={(evt) => {
        	this.getExercisesForConcept(evt.target.value);
        }} style={{marginBottom: "50px"}}>
          <option>Select concept</option>
          {this.state.conceptList.map((concept, index) => {
              return <option key={index} value={concept.name}>{concept.name}</option>
					})}
        </NativeSelect>

				{Object.keys(this.state.exercises).map((id, index) => {
					var exerciseCardStyle = {
						whiteSpace: "pre-wrap",
						padding: "30px"
					}
					if (id == this.state.editID) {
						exerciseCardStyle["borderColor"] = "#f1c232";
						exerciseCardStyle["color"] = "#f1c232";
					}
					return (
						<Card style={exerciseCardStyle} key={id}>
							<CardContent>
								<p style={{float: "right", fontWeight: "bold"}}>{index + 1}</p>
								<p>{JSON.stringify(this.state.allExercises[id], null, 4)}</p>
							</CardContent>
							{!this.state.editMode &&
								<CardActions>
									<Button color={"primary"} onClick={() => this.setState({editMode: true, editID: id})}>Edit</Button>
									<Button color={"secondary"} onClick={() => this.handleDeleteExercise(id)}>Delete</Button>
								</CardActions>
							}
						</Card>
					);
				})}

				{this.state.editMode &&
					<div>
						<textarea style={editorStyles} onChange={(e) => this.setState({editedExercise: e.target.value})} defaultValue={JSON.stringify(this.state.allExercises[this.state.editID], null, 2)}></textarea>
						<div style={buttonContainerStyles}>
							<Button style={{marginRight: "10px"}} variant={"contained"} color={"secondary"} onClick={() => this.setState({editMode: false, editID: "", editError: ""})}>Cancel</Button>
							<Button variant={"contained"} color={"primary"} onClick={() => this.saveEditedExercise()}>Save</Button>
						</div>
						<br />
            {this.state.editError &&
            	<p className={"alert alert-danger"}>{this.state.editError}</p>
            }
					</div>
				}
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
          <Tabs fullWidth centered
								indicatorColor={"primary"}
								value={this.state.tabValue}
								onChange={(e, value) => this.handleTabChange(value)}>
            <Tab label={"Build Exercise"} />
            <Tab label={"View Exercises"} />
          </Tabs>
					{this.state.tabValue == 0 ?
						this.renderBuildExercise() : this.renderViewExercises()
					}
				</Paper>
		);
	}
}

export default ExerciseTool;
