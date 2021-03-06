// PRETTY SURE THIS IS DEPRECATED & REPLACED BY SideNavigation.js

import React, {Component} from 'react';
import { Link} from "react-router-dom";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import './ConceptDialog.css';
import ConceptInventory from './../../../data/ConceptMap';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';
import firebase from 'firebase/app';
import ConceptDialogButton from './ConceptDialogButton';
import ExerciseButton from './ExerciseButton';
import ExerciseGenerator from '../../../backend/ExerciseGenerator';
import Progress from './Progress';

const LEARN = "Learn";
const PRACTICE = "Practice";
const READ = "READ";
const WRITE = "WRITE";

type Props = {
	title: string,
	conceptCode: string,
	open: boolean,
	generateExercise: Function,
	getInstruction: Function,
	exercisesList: any,
	conceptMapGetter: any,
	getOrderedConcepts: Function,
	goToExercise: Function,
};

class ConceptDialog extends Component {
	constructor(props: Props) {
		super(props);
		this.state = {
			open: true,
			readInstructions: [],
			writeInstructions: [],
			showRecommendations: false
		};
		this.handleClose = this.handleClose.bind(this);
		this.generator = new ExerciseGenerator(this.props.getOrderedConcepts);
	}

	componentWillReceiveProps(props: Props) {
		this.props = props;
		this.setState({
			open: props.open
		}, () => {
      this.getInstructionTitles();
		});
	}

	componentWillMount() {
		this.getInstructionTitles();
	}


	handleClose() {
		this.setState({
			open: false,
			readInstructions: [],
			writeInstructions: []
		});
	}

  renderMarkdown(codeString: string, index: number) {
    let code = "```python\n" + codeString + "\n```";
    return <ReactMarkdown className={"flex-grow-1"}
													key={index}
                          source={code}
                          renderers={{code: CodeBlock}}
                          escapeHtml={true}
    />
  }

	getInstructionTitles() {
		let databaseRef = firebase.database().ref("Instructions/" + this.props.conceptCode);
		let componentRef = this;
		databaseRef.on("value", function(snapshot) {
			let results = snapshot.val();
			if (results != null) {
				let readResults = results[READ];
				let writeResults = results[WRITE];
				let readTitles = [];
				let writeTitles = [];
				if (readResults) {
          readResults.forEach((item) => {
            readTitles.push(item.title);
          });
				}
				if (writeResults) {
          writeResults.forEach((item) => {
            writeTitles.push(item.title);
          });
				}
        componentRef.setState({
          readInstructions: readTitles,
          writeInstructions: writeTitles
        });
			}
		});
	}

	handleChange(evt, type) {
		this.setState({[type]: evt.target.checked});
	}

	filterExercisesByConcept(concept, exerciseType) {
		let exercises = this.generator.getExercisesByTypeAndConcept(exerciseType, concept, this.props.exercisesList, this.props.conceptMapGetter).results;
		let exerciseIds = this.generator.getExercisesByTypeAndConcept(exerciseType, concept, this.props.exercisesList, this.props.conceptMapGetter).exerciseIds;
		return {exercises, exerciseIds};
	}

	displayReadingRelatedSection() {
		return (
				<div>
					<Progress title={this.props.title} percent={1}/>
					<div className={"overview-container"}>
						<div className={"column"}>
							<p>{LEARN}</p>
							{this.state.readInstructions.map((item, index) => {
								let read = this.props.instructionsRead &&
								this.props.instructionsRead[this.props.conceptCode] &&
								this.props.instructionsRead[this.props.conceptCode][READ] ?
										this.props.instructionsRead[this.props.conceptCode][READ][index] : "unread";
								return (
										<Link key={'r' + index}
													onClick={() => this.props.getInstruction(this.props.conceptCode, READ, index)}
													to={`/instruction/${this.props.conceptCode}/learn-to-read-code/page=${index}`}>
											<ConceptDialogButton name={item} read={read} suggestionText={"asdf"}
																					 showInitially={true} maximized={this.state.showRecommendations}
																					 color={"#35b"} />
										</Link>
								);
							})}
						</div>
						<div className={"column"}>
							<p>{PRACTICE}</p>
							{this.getExercisePreviews(this.props.conceptCode, READ)}
							{/* Placeholder button */}
						</div>
					</div>
				</div>
		);
	}

	displayWritingRelatedSection() {
		return (
				<div>
					<Progress title={this.props.title} percent={70.5}/>
					<div className={"overview-container"}>
						<div className={"column"}>
							<p>{LEARN}</p>

							{this.state.writeInstructions.map((item, index) => {
								let read = this.props.instructionsRead &&
								this.props.instructionsRead[this.props.conceptCode] &&
								this.props.instructionsRead[this.props.conceptCode][WRITE] ?
										this.props.instructionsRead[this.props.conceptCode][WRITE][index] : "unread";
								return (
										<Link key={'w' + index} to={`/instruction/${this.props.conceptCode}/learn-to-write-code/page=${index}`}
													onClick={() => this.props.getInstruction(this.props.conceptCode, WRITE, index)}>
											<ConceptDialogButton name={item} read={read} suggestionText={"asdf"}
																					 showInitially={true} maximized={this.state.showRecommendations}
																					 color={"#35b"} />
										</Link>
								);
							})}
						</div>
						<div className={"column"}>
							<p>{PRACTICE}</p>
							{this.getExercisePreviews(this.props.conceptCode, WRITE)}
						</div>
					</div>
				</div>
		);
	}

	getExercisePreviews(concept, exerciseType) {
		let exercises = [];
		let exerciseIds = this.filterExercisesByConcept(concept, exerciseType).exerciseIds;
		this.filterExercisesByConcept(concept, exerciseType).exercises.forEach((e, i) => {
			let id = exerciseIds[i];
			exercises.push(
					<Link to={`/practice/${this.props.conceptCode}/practice-writing-code`}
              onClick={() => this.props.goToExercise(concept, exerciseType,
              e, id, i, exerciseIds.length)}
            >
            <ConceptDialogButton name={e.shortPrompt} read={false}
              suggestionText={"asdf"} 
              showInitially={true}
              maximized={this.state.showRecommendations}
              color={"#35b"}/>
					</Link>
				);
		});
		return exercises;
	}

	render() {
		let conceptInfo = ConceptInventory[this.props.conceptCode].explanations;

		return (
				<Dialog open={this.state.open} onClose={this.handleClose}>
					<DialogContent>
						<div className={'dialogHeader'}>
							<h2>{this.props.title}</h2>
							<i className="far fa-times-circle icon" onClick={() => this.handleClose()}/>
						</div>
						<div className={'options'}>
							<Button variant="contained" className={'resume'}>Resume</Button>
							<div>
								{/* TODO: Placeholders for now */}
								<p className={'switch-text'}>
									<i>
										{this.state.showRecommendations ?
												'hide recommendations' : 'show recommendations'}
									</i>
								</p>
								<Switch checked={this.state.showRecommendations}
												className={'switch'}
												color={'primary'} onChange={evt => this.handleChange(evt, 'showRecommendations')}/>
							</div>
						</div>
						<p><span className={"bold-text"}>Examples</span></p>
						{conceptInfo.examples.map((item, index) => {
              return this.renderMarkdown(item, index);
            })}

						{/* Display Reading related sections*/}
						{this.displayReadingRelatedSection()}

						{/* Display Writing related sections*/}
						{this.displayWritingRelatedSection()}
					</DialogContent>
				</Dialog>
		);
	}
}

export default ConceptDialog;

