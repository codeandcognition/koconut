import React, { Component } from 'react';
import { Link } from "react-router-dom";
import List from '@material-ui/core/List';
import ConceptOverview from './ConceptOverview';
import CardContent from '@material-ui/core/CardContent';
import ExerciseGenerator from '../../../backend/ExerciseGenerator';
import NavSection from './NavSection';
import NavItem from './NavItem';
import './SideNavigation.css';
import Progress from './Progress';
import { formatCamelCasedString } from './../../../utils/formatCamelCasedString';
import {CONDITIONS} from './../../../utils/Conditions';
import Button from '@material-ui/core/Button';
import Routes from './../../../Routes';
import _ from 'lodash';
import { Select } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';


const Categories = {
	READ: "READ",
	WRITE: "WRITE"
}

const progressField = "pKnown";
const DEFAULT_REC = "based on what you've done, you should try this";
const HOW_CODE_RUNS = 'howCodeRuns';

type Props = {
	title: string,
	conceptCode: string,
	generateExercise: Function,
	getInstruction: Function,
	exercisesList: any,
	conceptMapGetter: any,
	getOrderedConcepts: Function,
	goToExercise: Function,
	closeMenu: Function,
	persist: boolean,
	updateUserState: Function,
	defaultOpen: Array
};
// goToExercise(concept: string, exerciseType: string, exercise: any, exerciseId: string, index: number, numberOfExercises: number)
class SideNavigation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: props.title,
			conceptCode: props.conceptCode,
			readInstructions: [],
			writeInstructions: [],
			instructionsMap: props.instructionsMap,
			recExerciseType: null,
			recEx: null,
			recExerciseId: null,
			recIndex: null,
			recNumEx: null,
			defaultOpen: props.defaultOpen,
			selectedIndex: props.selectedIndex
		}
		this.generator = new ExerciseGenerator(this.props.getOrderedConcepts);
		this.getInstructionTitles = this.getInstructionTitles.bind(this);
	}

	componentDidMount() {
		this.getInstructionTitles();
		this.setRecommendedExerciseState(Object.keys(this.props.exerciseRecommendations)[0]); // get id for first recommended exercise
	}

	componentWillReceiveProps(props) {
		this.setState({
			title: props.title,
			conceptCode: props.conceptCode,
			conceptMapGetter: props.conceptMapGetter,
			instructionsMap: props.instructionsMap,
			selectedIndex: props.selectedIndex
		}, this.getInstructionTitles());
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if(!this.state.recExerciseId || !this.props.exerciseRecommendations || (this.state.recExerciseId && this.props.exerciseRecommendations &&
			Object.keys(this.props.exerciseRecommendations)[0] !== this.state.recExerciseId)) {
				this.setRecommendedExerciseState(Object.keys(this.props.exerciseRecommendations)[0]);
			}
	}

	getInstructionTitles() {
		if (this.state.instructionsMap) {
			let instructions = this.state.instructionsMap[this.state.conceptCode];
			
			let readTitles = [];
			let writeTitles = [];
			if (_.has(instructions, "READ")) {
				let readResults = instructions["READ"];
				readResults.forEach((item) => {
					readTitles.push(item.title);
				});
			}

			if (_.has(instructions, "WRITE")) {
				let writeResults = instructions["WRITE"];
				writeResults.forEach((item) => {
					writeTitles.push(item.title);
				});
			}

			this.setState({
				readInstructions: readTitles,
				writeInstructions: writeTitles
			});
		}
	}

	/**
	 * Given an exerciseId, set corresponding properties in state:
	 * {recExerciseType,
			recEx,
			recExerciseId,
			recIndex,
			recNumEx
	 }
	 * @param {string} exerciseId 
	 */
	setRecommendedExerciseState(exerciseId){
		let concept = this.props.exerciseConceptMap[exerciseId];
		let exercise = null;
		let exerciseType = null;
		let index = -1;
		let numExamples = null;


		for(let readOrWrite in Categories) {
			let {exercises, exerciseIds} = this.filterExercisesByConcept(concept, readOrWrite);
			let tempIndex = exerciseIds.indexOf(exerciseId);

			if(tempIndex >= 0) {
				exercise = exercises[tempIndex];
				exerciseType = readOrWrite;
				index = tempIndex;
				numExamples = exerciseIds.length;
			}
		}

		if(index >= 0) {
			this.setState({
				recExerciseType: exerciseType,
				recEx: exercise,
				recExerciseId: exerciseId,
				recIndex: index,
				recNumEx: numExamples
			})
		} else {console.log(`no exercise found for id ${exerciseId}`);}

	}

	filterExercisesByConcept(concept, exerciseType) {
		let response = this.generator.getExercisesByTypeAndConcept(exerciseType, concept, this.props.exercisesList, this.props.conceptMapGetter);
		let exercises = response.results;
		let exerciseIds = response.exerciseIds;
		return { exercises, exerciseIds };
	}

	/**
	 * returns true if users has viewed any instruction or gotten any exercise correct, false otherwise
	 */
	determineIfAnythingDone(){
		return !((this.props.instructionsRead && this.props.instructionsRead[this.state.conceptCode]) ||  // check for read instructions
			(this.props.exercisesCompleted && this.props.exercisesCompleted[this.state.conceptCode] && this.props.exercisesCompleted[this.state.conceptCode].length > 0)); // check for correct exercises
	}

	/**
	 * get list of concepts which are available 
	 * For C2 condition, only available if {instruction viewed, exercise done, recommended}
	 * For other conditions, all concepts available
	 * "howCodeRuns" always available
	 */
	getConceptsAvailable() {
		let possibleConcepts = Object.keys(this.props.instructionsMap);

		if(this.props.userCondition === CONDITIONS.C2) {
			possibleConcepts = possibleConcepts.filter(concept => {
				if(concept === HOW_CODE_RUNS) return true;
	
				return (_.has(this.props.instructionsRead, concept) || // instruction viewed
				(Array.isArray(this.props.exercisesCompleted[concept]) && this.props.exercisesCompleted[concept].length>0) || // exercise done
				this.props.exerciseConceptMap[this.state.recExerciseId] === concept); // recommended
			});
		}
		return possibleConcepts;
	}

	getInstructionRoute(conceptCode, readOrWrite, index){
		return `/instruction/${conceptCode}/learn-to-${readOrWrite.toLowerCase()}-code/page=${index}`;
	}

	getExerciseRoute(conceptCode, readOrWrite){
		return `/practice/${conceptCode}/practice-${readOrWrite.toLowerCase()}-code`;
	}

	// go to recommended exercise & update state in sidebar (for C2)
	goToRecommendedItem(firstUnreadInstruction){
		let hasUnreadInstruction = !_.isEmpty(firstUnreadInstruction);

		// check state is storing info for recommended exercise
		if(this.state.recExerciseType !== null && this.state.recEx !== null && 
			this.state.recExerciseId !== null && this.state.recIndex !== null && this.state.recNumEx !== null) {
			let selectedIndex = hasUnreadInstruction ? `${this.state.recExerciseType}${this.state.recIndex}` : `${this.state.recExerciseType}e${this.state.recIndex}`;
			this.setState({
				conceptCode: this.props.exerciseConceptMap[this.state.recExerciseId],
				selectedIndex: selectedIndex
			}, () => {
				if(hasUnreadInstruction){ // go to first unread instruction (if any instruction unread)
					return this.props.getInstruction(this.props.exerciseConceptMap[this.state.recExerciseId], firstUnreadInstruction.readOrWrite, firstUnreadInstruction.index);
				} else { // if all instruction read, go to exercise
					return this.props.goToExercise(this.props.exerciseConceptMap[this.state.recExerciseId], this.state.recExerciseType, 
						this.state.recEx, this.state.recExerciseId, this.state.recIndex, this.state.recNumEx);
				}
			});
		} else console.log("from side nav, can't go to recommended item");
	}

	constructButtonList(instructions, readOrWrite) {
		let buttonsList = [];

		// add instructions
		instructions.map((item, index) => {
			let read = this.isInstructionRead(this.state.conceptCode, readOrWrite, index);

			let text = "";
			if (this.props.instructionRecommendations[this.state.conceptCode] &&
			this.props.instructionRecommendations[this.state.conceptCode][readOrWrite] &&
			this.props.instructionRecommendations[this.state.conceptCode][readOrWrite][index]) {
				let conceptReccomendations = this.props.instructionRecommendations[this.state.conceptCode];
				let recommendationsForType = conceptReccomendations[readOrWrite];
				let instructionReccomendation = recommendationsForType[index];
				if (instructionReccomendation) {
					text = instructionReccomendation.text;
				} else {
					text = DEFAULT_REC;
				}
			}
			buttonsList.push(
				<Link key={index}
					onClick={() => this.props.getInstruction(this.state.conceptCode, readOrWrite, index)}
					to={this.getInstructionRoute(this.state.conceptCode, readOrWrite, index)}
				>
					<NavItem name={item} read={read} selectedIndex={this.props.conceptCode == this.state.conceptCode && this.state.selectedIndex} index={`${readOrWrite}${index}`} isExercise={false}></NavItem>
				</Link>
			)
		});

		// add exercises
		let { exercises, exerciseIds } = this.filterExercisesByConcept(this.state.conceptCode, readOrWrite);
		let showRecommendations = this.props.userCondition !== CONDITIONS.C1;
		
		exercises.map((ex, index) => {
			let exerciseId = exerciseIds[index];
			let text = "";
			let recIcon = null;
			let read = this.props.exercisesCompleted && this.props.exercisesCompleted[this.state.conceptCode] ? this.props.exercisesCompleted[this.state.conceptCode].includes(exerciseId) : false;
			if (showRecommendations &&  this.props.exerciseRecommendations[exerciseId]) {
				let recommendation = this.props.exerciseRecommendations[exerciseId];
				text = recommendation.text;
				recIcon = recommendation.icon;
				if (!text) {
					// if recommendation text isn't set
					text = DEFAULT_REC;
				}
			}

			// if C2 condition, only show exercises which are completed or recommended
			if(this.props.userCondition !== CONDITIONS.C2 || (this.props.userCondition===CONDITIONS.C2 && (read || this.props.exerciseRecommendations[exerciseId]))) {
				buttonsList.push(
					<Link key={"ex" + index}
						to={this.getExerciseRoute(this.state.conceptCode, readOrWrite)}
						onClick={() => this.props.goToExercise(this.state.conceptCode, readOrWrite,
							ex, exerciseIds[index], index, exerciseIds.length)}>
								<NavItem read={read} suggestionText={text} recIcon = {recIcon} name={ex.shortPrompt} isExercise={true}
									selectedIndex={this.state.selectedIndex} 
									index={`${readOrWrite}e${index}`}
									ref={`${readOrWrite}e${index}`} // TODO: use this to scroll to recommendation
									>
									</NavItem>
									</Link>
				);
			}
		});
		return <List style={{ width: '100%', paddingTop:'0px', paddingBottom:'0px' }}>{buttonsList}</List>;
	}

	/**
	 * given a concept code, return object with data on first instruction not read {'readOrWrite': readOrWrite, 'index': index}
	 * If all instruction has been read, return false
	 * @param {string} conceptCode 
	 */
	findFirstUnreadInstruction(conceptCode){
		let output = null;
		let instruction = _.has(this.state.instructionsMap, conceptCode) ? this.state.instructionsMap[conceptCode] : {};

		for(let readOrWrite in Categories) {
			instruction[readOrWrite].map((item, index) => {
				let read = this.isInstructionRead(conceptCode, readOrWrite, index);
				if(!output && !read) { // first instruction not read
					output = {'readOrWrite': readOrWrite, 'index': index};
				}
			});
		};
		return output;
	}

	/**
	 * returns true if instruction is read. returns false is instruction is not read
	 * Will also return false if props.instructionsRead is missing
	 * @param {string} conceptCode 
	 * @param {string} readOrWrite either "READ" or "WRITE" (case sensitive)
	 * @param {int} index >= 0
	 */
	isInstructionRead(conceptCode, readOrWrite, index){
		return this.props.instructionsRead && this.props.instructionsRead[conceptCode] && this.props.instructionsRead[conceptCode][readOrWrite] 
		? this.props.instructionsRead[conceptCode][readOrWrite].includes(index) : false;
	}

	render() {
		let readingSection = this.constructButtonList(this.state.readInstructions, Categories.READ);
		let writingSection = this.constructButtonList(this.state.writeInstructions, Categories.WRITE);
		let ref = this;

		let conceptHasExercises = Object.keys(this.props.userBKTParams).includes(this.state.conceptCode);
		let readProgress = conceptHasExercises ? this.props.userBKTParams[this.state.conceptCode][Categories.READ][progressField] : null; 
		let writeProgress = conceptHasExercises ? this.props.userBKTParams[this.state.conceptCode][Categories.WRITE][progressField]: null;

		let style = {
			marginTop: '10px',
			width: '100%',
			// borderLeft: "8px solid #4054B2" // for recommendation
		}

		let readPercent = conceptHasExercises ? readProgress : null;
		let writePercent = conceptHasExercises ? writeProgress : null;

		let recConcept = this.props.exerciseConceptMap[this.state.recExerciseId]
		let firstUnreadInstruction = this.state.recExerciseId ? this.findFirstUnreadInstruction(recConcept) : false;
		let recRoute = '';
		if (!_.isEmpty(firstUnreadInstruction)){ // if there's an unread instruction, get route to it
			recRoute = this.getInstructionRoute(recConcept, firstUnreadInstruction.readOrWrite, firstUnreadInstruction.index);
		} else {
			recRoute = (this.state.recExerciseId && this.state.recExerciseType) ? this.getExerciseRoute(this.props.exerciseConceptMap[this.state.recExerciseId], this.state.recExerciseType) : '';
		}

		return (
			<div id={"sidenav"} className={"sidebar"}>
				{((Array.isArray(this.state.readInstructions) && this.state.readInstructions.length>0) || 
				(Array.isArray(this.state.writeInstructions) && this.state.writeInstructions.length>0)) &&
					<CardContent>
						<div className={"sidebar-header"}>
							<FormControl>
								<h2>
									<Select
										value={this.state.conceptCode}
										onChange= {(event) => {
												this.setState({
													conceptCode: event.target.value,
													title: formatCamelCasedString(event.target.value)	
												}, () => {
													this.getInstructionTitles()
												})
											}
										}
										inputProps={{
											name: 'age',
											id: 'age-simple',
										}}
									>
										{this.getConceptsAvailable().map( conceptId => 
											<MenuItem key={conceptId} value={conceptId}>
												{this.props.conceptCode==conceptId ? <b>{formatCamelCasedString(conceptId)}</b> : formatCamelCasedString(conceptId)}
											</MenuItem>
										)};
									</Select>
								</h2>							
							</FormControl>
							{/* <h2>{ConceptInventory[this.state.title] ? ConceptInventory[this.state.title].explanations.name : conceptName}</h2> */}
							{(!this.props.persist || this.props.userCondition !== CONDITIONS.C2) && <i className="far fa-times-circle sidebar-close" onClick={() => ref.props.closeMenu()}></i>}
						</div>
						{/* <ConceptOverview conceptCode={this.state.conceptCode} /> */}
						<NavSection
							getInstructionTitles={null}
							title={"Overview"}
							progress={null}
							defaultExpanded={this.state.defaultOpen.includes("OVERVIEW") && this.determineIfAnythingDone()}
							body={<ConceptOverview conceptCode={this.state.conceptCode} />}>
						</NavSection>
						
						{/* <Card style={{marginTop:'3px'}}>
							<CardContent>
								<span style={{float:'left'}}>
								Reading
								</span>
								{this.props.userCondition !== CONDITIONS.C2 ? <Progress percent={readPercent} /> : null}
								{readingSection}
							</CardContent>
						</Card> */}
						<NavSection
							getInstructionTitles={this.getInstructionTitles}
							title={"Reading"}
							defaultExpanded={this.state.defaultOpen.includes(Categories.READ)}
							progress={this.props.userCondition !== CONDITIONS.C2 && readPercent ? <Progress percent={readPercent} /> : null}
							body={readingSection}>
						</NavSection>
						
						{/* <Card style={{marginTop:'3px'}}>
							<CardContent>
								<span style={{float:'left'}}>
								Writing
								</span>
								{this.props.userCondition !== CONDITIONS.C2 ? <Progress percent={writePercent} /> : null}
								{writingSection}
							</CardContent>
						</Card> */}
						<NavSection
							getInstructionTitles={this.getInstructionTitles}
							title={"Writing"}
							defaultExpanded={this.state.defaultOpen.includes(Categories.WRITE)}
							progress={this.props.userCondition !== CONDITIONS.C2 && writePercent ? <Progress percent={writePercent} /> : null}
							body={writingSection}>
						</NavSection>
						{(this.props.userCondition !== CONDITIONS.C2 && typeof(this.state.selectedIndex) === 'string' && this.state.selectedIndex.length > 0)&&
								<div>
									<Link to={Routes.worldview} onClick={() => this.props.switchToWorldView()}>
										<Button style={style} variant="contained"><i className="fa fa-chevron-left" aria-hidden="true"></i> back to world view</Button>
									</Link>
								</div>
						}
						{this.props.userCondition === CONDITIONS.C2 &&
								<div>
									<Link to={recRoute}
										onClick={() => this.goToRecommendedItem(firstUnreadInstruction)}>
											<Button style={style} variant="contained">next <i className="fa fa-chevron-right" aria-hidden="true"></i></Button>
									</Link>
								</div>
						}
					</CardContent>
				}					
			</div>
		);
	}
}

export default SideNavigation;