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
// import './ExerciseTool.css';
import conceptInventory from './ConceptMap';

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
			currentConcept: ''
		};
	}

	ExerciseTypes = {
		survey: 'survey',
		writeCode: 'writeCode',
		fillBlank: 'fillBlank',
		highlightCode: 'highlightCode',
		multipleChoice: 'multipleChoice',
		shortResponse: 'shortResponse'
	};

	Concepts = conceptInventory.map((concept) => concept.name);

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

	renderAnswer() {
		if(this.state.currentExercise.choices.length < 1) {
			return <textarea
					className="answer"
					onChange={(e) => this.setState({
						currentAnswer: e.target.value
					})}
					value={this.state.currentAnswer}
			/>
		} else {
			return (
					<select
							name="answer"
							onChange={(e) => this.setState({currentAnswer: e.target.value})}
					>
						<option value=""></option>
						{this.state.currentExercise.choices.map((key) => {
							return <option value={key}>{key}</option>
						})}
					</select>
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

	render() {
		return (
				<div className="tool">
					<div className="row">
						<div className="container">
							<h2>Prompt</h2>
							{this.renderPrompt()}
						</div>

						<div className="container big">
							<h2>Code</h2>
							<textarea
									className="big-code"
									onChange={this.handleChange('code')}
									value={this.state.currentExercise.code}
							>
              </textarea>
						</div>

						<div className="container">
							<h2>Type</h2>
							<select
									name="type"
									className="type"
									onChange={this.handleChange('type')}
							>
								<option value=""></option>
								{Object.keys(this.ExerciseTypes).map((key) => {
									return <option value={key}>{key}</option>
								})}
							</select>
						</div>
					</div>

					<div className="row">
						<div className="container">
							<h2>Choices</h2>
							<textarea
									onChange={(e) => this.setState({currentChoice: e.target.value})}
									value={this.state.currentChoice}
							>
              </textarea>
							<div
									className="button"
									onClick={(e) => {
										if(this.state.currentChoice === '') return;
										let choicesCopy = [...this.state.currentExercise.choices];
										choicesCopy.push(this.state.currentChoice);
										this.updateExercise('choices', choicesCopy);
										this.setState({currentChoice: ''});
									}}
							>
								Add choice
							</div>
						</div>

						<div className="container border big">
							{this.state.currentExercise.choices.map((choice) => {return (
									<div
											onClick={(e) => {
												let index = this.state.currentExercise.choices.indexOf(e.target.innerText);
												let choicesCopy = [...this.state.currentExercise.choices];
												choicesCopy.splice(index, 1);
												this.updateExercise('choices', choicesCopy);
											}}
											className="choice"
									>
										{choice}
									</div>
							)})}
						</div>

						<div className="container">
							<h2>Answer</h2>
							{this.renderAnswer()}
						</div>
					</div>

					<div className="row">
						<div className="container">
							<h2>Concepts</h2>
							<select
									name="concept"
									onChange={(e) => this.setState({currentConcept: e.target.value})}
							>
								<option value=""></option>
								{this.Concepts.map((concept) => {
									return <option value={concept}>{concept}</option>
								})}
							</select>
							<div
									className="button"
									onClick={(e) => {
										if(this.state.currentConcept === '') return;
										let conceptsCopy = [...this.state.currentExercise.concepts];
										conceptsCopy.push(this.state.currentConcept);
										this.updateExercise('concepts', conceptsCopy);
										this.setState({currentConcept: ''});
									}}
							>
								Add concept
							</div>
						</div>

						<div className="container border big">
							{this.state.currentExercise.concepts.map((concept) => {return (
									<div
											onClick={(e) => {
												let index = this.state.currentExercise.concepts.indexOf(concept);
												let conceptsCopy = [...this.state.currentExercise.concepts];
												conceptsCopy.splice(index, 1);
												this.updateExercise('concepts', conceptsCopy);
											}}
											className="choice"
									>
										{concept}
									</div>
							)})}
						</div>
					</div>

					<div className="row">
						<div className="container">
							<h2>Preview</h2>
							<div className="code output">
								{JSON.stringify({
									exercise: this.state.currentExercise,
									answer: this.state.currentAnswer
								}, null, 2)}
							</div>
						</div>
					</div>

					<div
							onClick={(e) => {
								if(this.state.currentExercise.prompt !== ''
										&& this.state.currentAnswer !== ''
										&& this.state.currentExercise.type !== '')
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
									});}}
							className="button"
					>
						Add exercise!!
					</div>

					<div className="row">
						<div className="container exercises border">
							<h2>Exercises</h2>
							{this.state.exercises.map((exercise) => {return (
									<div
											onClick={(e) => {
												let index = this.state.exercises.indexOf(exercise);
												let exercisesCopy = [...this.state.exercises];
												exercisesCopy.splice(index, 1);
												this.setState({exercises: exercisesCopy});
											}}
											className="choice"
									>
										{exercise.exercise.prompt}
									</div>
							)})}
						</div>
					</div>

					<div className="row">
						<div className="container">
							<h2>JSON Output</h2>
							<div className="code output">
								{JSON.stringify(this.state.exercises, null, 2)}
							</div>
							<div className="code output">
								{"let variable" + Math.round(Math.random() * 99999).toString() + " = "
								+ JSON.stringify(this.state.exercises) + ";"}
							</div>
						</div>
					</div>
				</div>
		);
	}
}

export default ExerciseTool;
