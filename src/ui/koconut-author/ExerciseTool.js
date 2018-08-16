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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import Button from '@material-ui/core/Button/Button';
import {ConceptKnowledge, MasteryModel} from './MasteryModel';
import Question from './Question';
import Table from './Table';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import firebase from "firebase";
import "./ExerciseTool.css";


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
			tabValue: 0,
			exercises: {},
      allExercises: {},
			editMode: false,
			editID: "",
			editedExercise: "",
			editError: "",
			selectedConcept: "",
			currentQuestionIndex: 0,
			currentFIndex: 0,

			isFollowup: false, 														// passed as a prop into the Question component
			currentQuestion: this.Schemas["standAlone"], 				// this will be updated throughout an authoring session
			currentQuestionFormat: "standAlone",					// keeps track of the format of the current question
			currentCellIndex: -1,													// needed for dealing with Firebase concurrency issues
			followupTo: -1,

			currentCell: {
      	currentCellIndex: -1,
				format: 'prompt',
				instructionType: 'prompt'
			}
    };

    // Bind the functions so they can be used in Question.js
		this.addQuestion = this.addQuestion.bind(this);
		this.updateCurrentQuestion = this.updateCurrentQuestion.bind(this);
	}

	Schemas = {
		standAlone: {
			prompt: "",
			code: "",
			difficulty: -1,
			choices: [],
			type: "",
			answer: "",
			hint: "",
			feedback: {},
			followupPrompt: "",
			followupQuestions: []
		},
		table: {
			prompt: "",
			code: "",
			type: 'table',
			colNames: [],
			data: [],
			followupPrompt: "",
			followupQuestions: []
		}
	}

	fieldReqs = {
		required: {
			float: 'right',
			color: '#EF5350'
		},
		optional: {
			float: 'right',
			color: '#4DD0E1'
		}
	};

	componentDidMount() {
		// obtain the list of all concepts
		let list = this.getConcepts();
		this.setState({
			conceptList: list
		});
		this.getAllExercises();

	}

	/**
	 * Renders the list of all concepts in the dropdown menu
	 * Note: the list is stored locally. It should be moved to Firebase later
	 *
	 * @returns {T[]}
	 */
	getConcepts(): ConceptKnowledge[] {
		return MasteryModel.model.filter((concept) => concept.teach && concept.container);
	}


	/// FIREBASE FUNCTIONS

	/**
	 * Get all exercises from Firebase so as to have a local copy of exercises
	 */
	getAllExercises() {
    let componentRef = this;
    let exerciseRef = firebase.database().ref("Exercises");
    exerciseRef.on("value", function(snapshot) {
      componentRef.setState({
        allExercises: snapshot.val() ? snapshot.val() : {}
      });
    });
	}

	/**
	 * Retrieves all exercises from the database that are associated with the given concept
	 * and sets state "exercises" to that list
	 *
	 * @param concept
	 */
	getExercisesForConcept(concept) {
		let componentRef = this;
		let conceptRef = firebase.database().ref("ConceptExerciseMap/" + concept);
		this.setState({
			exercises: {},
			selectedConcept: concept
		});
		conceptRef.on("value", function(snapshot) {
			let exerciseKeys = snapshot.val() ? snapshot.val() : [];
			let exerciseList = {};
			exerciseKeys.forEach((id) => {
				exerciseList[id] = componentRef.state.allExercises[id];
			});
			componentRef.setState({
				exercises: exerciseList
			})
		});
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
			let difficulty = Number(exercise.questions[questionIndex].difficulty);
			let newTotal = total + difficulty;
			return this.getAverageDifficulty(exercise, questionIndex + 1, newTotal, count + 1);
		} else {
			return total / count;
		}
	}

	/**
	 * Adds current exercises to the database in Exercises branch and
	 * ConceptExerciseMap branch ordered by difficulty
	 */
  addExercise() {
  	if (this.state.currentExercise.concepts.length > 0) {
			let pushKey = firebase.database().ref().child("Exercises").push().key;
			let exerciseRef = firebase.database().ref("Exercises/" + pushKey);
			exerciseRef.set(this.state.currentExercise);

			let componentRef = this;
			let difficulty = this.getAverageDifficulty(this.state.currentExercise, 0, 0, 0);
			this.state.currentExercise.concepts.forEach((concept) => {
				let conceptRef = firebase.database().ref("ConceptExerciseMap/" + concept);
				conceptRef.once("value", function(snapshot) {
					if (snapshot.val()) { // Concepts array exists
						let exerciseKeys = snapshot.val();
						let didInsertKey = false;
						let index = 0;
						while (didInsertKey === false) {
							let otherDifficulty = componentRef.getAverageDifficulty(componentRef.state.allExercises[exerciseKeys[index]], 0, 0, 0);
							if (otherDifficulty >= difficulty) {
								exerciseKeys.splice(index, 0, pushKey);
								didInsertKey = true;
							} else if (index === exerciseKeys.length) {
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
		} else {
			window.alert('At least one required field is missing!');
		}
	}

	/**
	 * Deletes exercise from Firebase. Takes in an exercise id -- a Firebase push key
	 *
	 * @param exerciseID
	 */
	handleDeleteExercise(exerciseID) {
		this.state.allExercises[exerciseID].concepts.forEach((concept) => {
			let conceptRef = firebase.database().ref("ConceptExerciseMap/" + concept);
			conceptRef.once("value", function(snapshot) {
				if (snapshot.val()) {
					let exerciseKeys = snapshot.val();
					let index = exerciseKeys.indexOf(exerciseID);
					if (index > -1) {
						exerciseKeys.splice(index, 1);
					}
					conceptRef.set(exerciseKeys);
				}
			});
		});
		let exerciseRef = firebase.database().ref("Exercises/" + exerciseID);
		exerciseRef.set(null);
	}

	// TODO: Update ordering of exercises in ConceptExerciseMap branch of
	// database if user changes the difficulties of exercise questions
	saveEditedExercise() {
		try {
			let updatedExercise = JSON.parse(this.state.editedExercise);
			let exerciseRef = firebase.database().ref("Exercises/" + this.state.editID);
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

	/// EXERCISE SPECIFIC FUNCTIONS

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
	 *
	 * @param field
	 * @param value
	 */
	updateExercise(field, value) {
		// deep copy instead of shallow copy
		let temp = Object.assign({}, this.state.currentExercise);
		temp[field] = value;
		this.setState({currentExercise: temp});
	}

	/**
	 * Adds a question to the exercise. `followup` is a boolean indicating whether
	 * this question has a followup
	 *
	 * @param
	 */
	addQuestion(question) {
		let exercise = Object.assign({}, this.state.currentExercise);
		if (this.state.isFollowup) {
			let parent = Object.assign({}, exercise.questions[this.state.followupTo]);
			let followupQuestions = Object.assign([], parent.followupQuestions);
			followupQuestions.push(question);
			parent.followupQuestions = followupQuestions;
			exercise.questions[this.state.followupTo] = parent;
		} else {
			exercise.questions.push(question);
		}
		this.setState({
			currentExercise: exercise,
			isFollowup: false,
			currentQuestion: this.Schemas.standAlone,
			currentQuestionFormat: "standAlone"
		}, () => {
			window.alert("Exercise preview has been updated. \n\nClick on 'Add Exercise' to save to Firebase\n\nOr continue adding questions to the exercise.")
		});
	}

	/**
	 * Updates the `currentQuestion` field through out the authoring session
	 */
	updateCurrentQuestion(question, currentCell) {
		this.setState({
			currentQuestion: question,
			currentCell: currentCell
		});
	}

	/// UI/LAYOUT RELATED FUNCTIONS

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
			tabValue: 0,
			exercises: {},
			allExercises: {},
			editMode: false,
			editID: "",
			editedExercise: "",
			editError: "",
			selectedConcept: "",

			isFollowup: false,
			currentQuestion: this.QuestionSchema,
			currentQuestionFormat: "",
			followupTo: -1
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
		var currentIndex = this.state.currentQuestionIndex;
		var currentFIndex = this.state.isFollowup ? 0 : this.state.currentFIndex;
		var totalQuestions = this.state.currentExercise.questions.length;
		var totalFQuestions = this.state.isFollowup ? this.state.currentExercise.questions[this.state.currentQuestionIndex].followupQuestions.length : 0;
		return (
			<div>
				<p className={"question-tracker"}>Question {totalQuestions == 0 ? currentIndex : currentIndex + 1} of {totalQuestions}</p>
				{this.state.isFollowup && <p className={"question-tracker"}>Follow-up {totalFQuestions == 0 ? currentFIndex : currentFIndex + 1} of {totalFQuestions}</p>}
				<div className={"question-container"}>
					<button className={"question-nav-arrow"} onClick={() => this.navigateToQuestion(this.state.isFollowup ? currentFIndex - 1 : currentIndex - 1, this.state.isFollowup ? totalFQuestions - 1 : totalQuestions - 1, "LEFT")}>
						<i className="fa fa-chevron-left" aria-hidden="true"></i>
					</button>
					<Question addQuestion={this.addQuestion}
										isFollowup={this.state.isFollowup}
										insideTable={false}
										data={Object.assign({}, this.state.currentQuestion)}
										updateCurrentQuestion={this.updateCurrentQuestion}
										currentCell={this.state.currentCell} />
					<button className={"question-nav-arrow"} onClick={() => this.navigateToQuestion(this.state.isFollowup ? currentFIndex + 1 : currentIndex + 1, this.state.isFollowup ? totalFQuestions - 1 : totalQuestions - 1, "RIGHT")}>
						<i className="fa fa-chevron-right" aria-hidden="true"></i>
					</button>
				</div>
			</div>
		);
	}

  /**
	 * This function navigates through the questions of an exercise on the
	 * exercise builder
   * @param index
   * @param maxIndex
   * @param direction
   */
	navigateToQuestion(index: number, maxIndex: number, direction: string) {
		if (index >= 0 || this.state.isFollowup) {
    	if (this.state.isFollowup) {
				if (index > maxIndex || index < 0) { // Follow-up to Question
					let increase = direction === "LEFT" ? 0 : 1;
					if (this.state.currentQuestionIndex + increase < this.state.currentExercise.questions.length) {
            this.setState({
              isFollowup: false,
              currentQuestionIndex: this.state.currentQuestionIndex + increase,
              currentQuestion: this.state.currentExercise.questions[this.state.currentQuestionIndex + increase]
            });
					}
				} else {
					this.setState({ // Follow-up to Follow-up
						currentFIndex: index,
						currentQuestion: this.state.currentExercise.questions[this.state.currentQuestionIndex].followupQuestions[index]
					})
				}
			} else {
    		if (direction === "RIGHT" && this.state.currentQuestion.followupQuestions) { // Question to Follow-up
					this.setState({
						isFollowup: true,
						currentFIndex: 0,
						currentQuestion: this.state.currentQuestion.followupQuestions[0]
					});
				} else { // Question to Question
    			this.setState({
						currentQuestionIndex: index,
						currentQuestion: this.state.currentExercise.questions[index]
					});
				}
			}
		}


		/*if (index >= 0 || this.state.isFollowup) {
			if (this.state.isFollowup) {
				if (index >= maxIndex || index < 0) { // Follow-up to Question
					var increase = direction === "LEFT" ? -1 : 1;
					this.setState({
						isFollowup: false,
						currentQuestionIndex: this.state.currentQuestionIndex + increase,
						currentQuestion: this.state.currentExercise.questions[this.state.currentQuestionIndex + increase]
					});
				} else {
					this.setState({ // Follow-up to Follow-up
						currentFIndex: index,
						currentQuestion: this.state.currentExercise.questions[this.state.currentQuestionIndex].followupQuestions[index]
					});
				}
			} else {
				var prevQuestion = this.state.currentExercise.questions[index] ? this.state.currentExercise.questions[index].followupQuestions : null;
				if (direction === "RIGHT" && this.state.currentQuestion.followupQuestions && this.state.currentQuestion.followupQuestions.length > 0) { // Question to Follow-up
          this.setState({
            isFollowup: true,
            currentFIndex: 0,
            currentQuestion: this.state.currentQuestion.followupQuestions[0]
          });
        } else if (direction === "LEFT" && prevQuestion && prevQuestion.length > 0) {
						this.setState({
							isFollowup: true,
							currentFIndex: prevQuestion.length - 1,
							currentQuestion: prevQuestion[prevQuestion.length - 1]
						});
				} else {
					this.setState({ // Question to Question
						currentQuestionIndex: index > maxIndex ? index - 1 : index,
						currentQuestion: this.state.currentExercise.questions[index > maxIndex ? index - 1 : index]
					});
				}
			}*/
		}

	/**
	 * Renders a single table question
	 * @returns {*}
	 */
	renderTableQuestion() {
		return <Table addQuestion={this.addQuestion}
									updateCurrentQuestion={this.updateCurrentQuestion}
									data={Object.assign({}, this.state.currentQuestion)}
									currentlyOpen={this.state.currentCellIndex}
									cellFormat={this.state.currentCell.format}
									cellInstructionType={this.state.currentCell.instructionType}/>
	}

	/**
	 * Renders the UI to indicate question type
	 */
	renderQuestionTypePrompt() {
		return(
				<div>
					<p style={{color: '#3F51B5'}}>How do you want to format the question? <span style={this.fieldReqs.required}>required</span></p>
					<FormControl>
						<RadioGroup value={this.state.currentQuestionFormat}
												onChange={(evt) => {
													this.setState({
																currentQuestionFormat: evt.target.value,
																currentQuestion: this.Schemas[evt.target.value]
													});
												}}>
							<FormControlLabel value={"standAlone"} control={<Radio color={"primary"}/>} label={"Stand alone question"}/>
							<FormControlLabel value={"table"} control={<Radio color={"primary"}/>} label={"Format as a table"}/>
						</RadioGroup>
					</FormControl>
				</div>
		);

	}

	/**
	 * Renders the follow up prompt
	 *
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
									onClick={() =>
											this.setState({
												isFollowup: true,
												followupTo: this.state.currentExercise.questions.length - 1,
												currentQuestion: this.Schemas.standAlone,
												currentQuestionFormat: "standAlone"
											})}>
						Follow-up Question
					</Button>
					<Button style={style}
									variant={'outlined'}
									color={"primary"}
									onClick={() =>
											this.setState({
												isFollowup: false,
												followupTo: -1,
												currentQuestion: this.Schemas.standAlone,
												currentQuestionFormat: "standAlone"})}>
						New Question
					</Button>
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

  /**
   * This function brings the user to the build exercise view and populates
   * it with exercise information to be edited.
   *
   */
  enterEditMode(id: string) {
    var editExercise = this.state.exercises[id];
    var currentExercise = this.state.currentExercise;
    currentExercise["prompt"] = editExercise.prompt;
    currentExercise["code"] = editExercise.code;
    currentExercise["labels"] = editExercise.labels;
    currentExercise["concepts"] = editExercise.concepts;
    currentExercise["questions"] = editExercise.questions;
    this.setState({
      editMode: true,
      editID: id,
      tabValue: 0,
      currentExercise: currentExercise,
      currentQuestion: editExercise.questions[0]
    }, () => window.scrollTo(0, 0));
  }

  saveEdits() {
  	let databaseRef = firebase.database().ref("Exercises/" + this.state.editID);
  	databaseRef.set(this.state.currentExercise);
	}

	/**
	 * Lays out the Build Exercise view in the authoring tool
	 * @returns {*}
	 */
	renderBuildExercise() {
    let textareaStyle = {
      border: '1px solid darkgray',
      fontFamily: 'monospace',
      whiteSpace: 'pre-wrap',
      textAlign: 'left',
      width: '100%',
			height: '10em',
			display: 'block'
    };

    let formSectionStyle = {
    	marginBottom: "30px"
		};

		let sectionHeading = {
    	color: '#3F51B5'
		};

		return (
				<div style={{marginTop: "50px"}}>
          <div style={formSectionStyle}>
            <p>Exercise: {" " + this.state.currentExercise.prompt} </p>
            <p style={sectionHeading}>Overarching Prompt <span style={this.fieldReqs.optional}>optional</span></p>
            <textarea style={textareaStyle}
                       value={this.state.currentExercise.prompt}
											onChange={this.handleExerciseChange('prompt')}/>
          </div>

          <div style={formSectionStyle}>
            <p style={sectionHeading}>Overarching Code <span style={this.fieldReqs.optional}>optional</span></p>
            <textarea style={textareaStyle}
                      onChange={this.handleExerciseChange('code')} />
          </div>

					<div style={formSectionStyle}>
						<p style={sectionHeading}>Tag concepts for this exercise <span style={this.fieldReqs.required}>required</span></p>
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

					{this.renderQuestionTypePrompt()}
					{this.state.currentQuestionFormat === "standAlone" ? this.renderQuestionCard() : this.renderTableQuestion()}
					<br/>
					{this.renderExercisePreview()}
					{this.renderFollowupPrompt()}
					<br/>
					{this.state.editMode ?
							<div>
								<Button style={{marginRight: "30px"}}variant={"contained"} color={"primary"}>Save Changes</Button>
								<Button variant={"contained"} color={"secondary"}>Cancel</Button>
							</div> :
              <Button variant={"contained"} color={"primary"} onClick={() => this.addExercise()}>Add Exercise</Button>

					}
				</div>
		);
	}

	/**
	 * Lays out the View Exercises tab in the authoring tool
	 * @returns {*}
	 */
	renderViewExercises() {
		let editorStyles = {
			width: "80%",
			height: "200px",
			marginTop: "60px"
		};

		let buttonContainerStyles = {
      marginTop: "30px",
			width: "50%",
    };

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
					let exerciseCardStyle = {
						whiteSpace: "pre-wrap",
						padding: "30px"
					};
					if (id === this.state.editID) {
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
									<Button color={"primary"} onClick={() => this.enterEditMode(id)}>Edit</Button>
									<Button color={"secondary"} onClick={() => this.handleDeleteExercise(id)}>Delete</Button>
								</CardActions>
							}
						</Card>
					);
				})}

				{/*this.state.editMode &&
					<div>
						<textarea style={editorStyles}
											onChange={(e) => this.setState({editedExercise: e.target.value})}
											defaultValue={JSON.stringify(this.state.allExercises[this.state.editID], null, 2)}/>
						<div style={buttonContainerStyles}>
							<Button style={{marginRight: "10px"}}
											variant={"contained"}
											color={"secondary"}
											onClick={() => this.setState({editMode: false, editID: "", editError: ""})}>Cancel
							</Button>
							<Button variant={"contained"} color={"primary"} onClick={() => this.saveEditedExercise()}>Save</Button>
						</div>
						<br />
            {this.state.editError &&
            	<p className={"alert alert-danger"}>{this.state.editError}</p>
            }
					</div>
				*/}
			</div>
		);
	}

	render() {
		var containerStyle = {
			padding: "60px"
		}

		if (this.state.editMode) {
			containerStyle["border"] = "4px solid #f1c232";
		}

		return (
				<Paper style={containerStyle} className={"container"}>
          <Tabs fullWidth centered
								indicatorColor={"primary"}
								value={this.state.tabValue}
								onChange={(e, value) => this.handleTabChange(value)}>
            <Tab label={"Build Exercise"} />
            <Tab label={"View Exercises"} />
          </Tabs>
					{this.state.tabValue === 0 ?
						this.renderBuildExercise() : this.renderViewExercises()
					}
				</Paper>
		);
	}
}

export default ExerciseTool;
