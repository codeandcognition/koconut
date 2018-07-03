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
        concepts: [],
        tables: []
      },
			questions: [],
			conceptList: [],
      currentQuestion: {
        prompt: "",
        code: "",
				index: 0,
        difficulty: 0,
        choices: [],
        type: "",
        answer: "",
        hint: "",
        feedback: "",
        followupPrompt: "",
        followupQuestions: ""
      },
			currentQuestionFormat: 'standAlone',
			currentChoice: '',
			currentTable: {
				colNames: [],
				rows: 0,
				data: {}
			},
			columnNames: [],
			tabValue: 0,
			exercises: []
    }
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
	 * Updates the questions array in the current exercise
	 * @param field
	 * @param value
	 */
	updateQuestion(field, value) {
		let temp = this.state.currentQuestion;
		temp[field] = value;
		this.setState({currentQuestion: temp});
	}

	/**
	 * Handles a change in the current question object
	 *
	 * @param field
	 * @returns {Function}
	 */
	handleChange(field) {
		return (e) => {
			this.updateQuestion(field, e.target.value);
		}
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
				</div>
		);

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

	standAloneQuestion(fieldReqs) {
		return(
				<div>
					{this.renderQuestionTypeDropdown()}
					{this.renderChoicesInputForm()}
					{this.renderChoices()}
					{this.renderAnswer(fieldReqs)}
				</div>
		);
	}

	/**
	 * Function to render the question type drop down
	 *
	 * @returns {*} html div
	 */
	renderQuestionTypeDropdown() {
		return(
				<div>
					<label className={"text-primary"}>Question Type</label>
					<FormControl style={{display: 'block'}}
											 fullWidth={true}>
						<NativeSelect name={"Question Type"}
													onChange={this.handleChange('type')}>
							<option>Select question type</option>
							{
								Object.keys(this.QuestionTypes).map((qType, key) => {
									let type = this.QuestionTypes[qType];
									return <option key={key}>{type}</option>
								})
							}
						</NativeSelect>
					</FormControl>
				</div>
		);
	}

	/**
	 * Function to render the choices input form
	 *
	 * @returns {*} html div
	 */
	renderChoicesInputForm() {
		return(
				<div>
					<label className={"text-primary"}>Choices</label>
					<TextField fullWidth={true}
										 style={{display: 'block'}}
										 onChange={(evt) => this.setState({currentChoice: evt.target.value})}
										 value={this.state.currentChoice}/>
					<Button variant={'outlined'}
									color={'secondary'}
									onClick={(evt) => {
										if (this.state.currentChoice === '') return;
										let choicesCopy = [...this.state.currentQuestion.choices];
										choicesCopy.push(this.state.currentChoice);
										this.updateQuestion('choices', choicesCopy);
										this.setState({currentChoice: ''});
									}}>
						Add choice
					</Button>
				</div>
		);
	}

	/**
	 * Function to render the choices for a multiple choice question
	 * @returns {*}
	 */
	renderChoices() {
		return(
				<div style={{width: '100%', height: '10em', borderStyle: 'solid', borderColor: '#BBDEFB'}}>
					{
						this.state.currentQuestion.choices.map((choice, key) => {
							return <Button key={key}
														 variant={'flat'}
														 style={{backgroundColor: '#ffecb3'}}
														 onClick={(evt) => {
														 	let index = this.state.currentQuestion.choices.indexOf(evt.target.innerText);
														 	let choicesCopy = [...this.state.currentQuestion.choices];
														 	choicesCopy.splice(index, 1);
														 	this.updateQuestion('choices', choicesCopy);
														 }}>
								{choice}
								</Button>
						})
					}
				</div>
		);
	}

	/**
	 * renders choices and answer
	 */
	renderAnswer(reqs) {
		if (this.state.currentQuestion.type === this.QuestionTypes.multipleChoice) {
			return(
					<div>
						<p>Answer <span style={reqs.required}>required</span></p>
						<NativeSelect onChange={(evt) => this.setState({currentAnswer: evt.target.value})}>
							<option>Select the answer</option>
							{
								this.state.currentQuestion.choices.map((choice, key) => {
									return <option key={key}>{choice}</option>
								})
							}
						</NativeSelect>
					</div>
			);
		} else if (this.state.currentQuestion.type === this.QuestionTypes.memoryTable) {
				// TODO: Design the UI
		} else {
				// returns a text field for answer
				return (
						<div>
							<p>Answer <span style={reqs.required}>required</span></p>
							<TextField fullWidth={true}
												 value={this.state.currentAnswer}
												 onChange={(evt) => this.setState({currentAnswer: evt.target.value})} />
						</div>
				);
		}
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



	// Adds current question stored in state to the current exercise stored in state
	addQuestion() {
		var exercise = this.state.currentExercise;
		exercise.questions.push(this.state.currentQuestion);
		this.setState({
			currentExercise: exercise
		});
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

	handleTabChange(value) {
		this.setState({
			tabValue: value
		})
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
          <div style={{margin: '5%', paddingTop: '2%'}}>
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
          <div>
            <p>How do you want to format the question? <span style={fieldReqs.required}>required</span></p>
            <FormControl>
              <RadioGroup value={this.state.currentQuestionFormat} onChange={(evt) => this.setState({currentQuestionFormat: evt.target.value})}>
                <FormControlLabel value={"standAlone"} control={<Radio color={"primary"}/>} label={"Stand alone question"}/>
                <FormControlLabel value={"table"} control={<Radio color={"primary"}/>} label={"Format as a table"}/>
              </RadioGroup>
            </FormControl>
          </div>

          {
            this.state.currentQuestionFormat === 'standAlone' ?
                this.standAloneQuestion(fieldReqs) : this.formatAsTable(fieldReqs)
          }


          <div>
            <p><b>Preview</b></p>
            <div style={code}>
              {
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
              this.state.questions.map((exercise, key) => {
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
                      {/*exercise.exercise.prompt*/}
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
