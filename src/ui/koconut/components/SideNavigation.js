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
import ConceptInventory from './../../../data/ConceptMap';
import { formatCamelCasedString } from './../../../utils/formatCamelCasedString';
import CONDITIONS from './../../../utils/Conditions';
import Button from '@material-ui/core/Button';
import Routes from './../../../Routes';


const Categories = {
	READ: "READ",
	WRITE: "WRITE"
}

const progressField = "pKnown";
const DEFAULT_REC = "based on what you've done, you should try this";
const DEFAULT_PROGRESS = 1.0;

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
			defaultOpen: props.defaultOpen
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
			instructionsMap: props.instructionsMap
		}, this.getInstructionTitles());
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if(!this.state.recExerciseId || !this.props.exerciseRecommendations || (this.state.recExerciseId && this.props.exerciseRecommendations &&
			Object.keys(this.props.exerciseRecommendations)[0] !== this.state.recExerciseId)) {
				console.log(`side nav: updating rec exercise`);
				this.setRecommendedExerciseState(Object.keys(this.props.exerciseRecommendations)[0]);
			}
	}

	getInstructionTitles() {
		if (this.props.instructionsMap) {
			let instructions = this.state.instructionsMap[this.state.conceptCode];
			let readResults = instructions["READ"];
			let writeResults = instructions["WRITE"];
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

	getInstructionRoute(conceptCode, readOrWrite, index){
		return `/instruction/${conceptCode}/learn-to-${readOrWrite.toLowerCase()}-code/page=${index}`;
	}

	getExerciseRoute(conceptCode, readOrWrite){
		return `/practice/${conceptCode}/practice-${readOrWrite.toLowerCase()}-code`;
	}

	// go to recommended exercise & update state in sidebar (for C2)
	goToRecommendedExercise(){
		if(this.state.recExerciseType !== null && this.state.recEx !== null && 
			this.state.recExerciseId !== null && this.state.recIndex !== null && this.state.recNumEx !== null) {
			this.setState({
				conceptCode: this.props.exerciseConceptMap[this.state.recExerciseId]
			}, () => {
				console.log("updated state in side nav");
			})
			return this.props.goToExercise(this.props.exerciseConceptMap[this.state.recExerciseId], this.state.recExerciseType, 
				this.state.recEx, this.state.recExerciseId, this.state.recIndex, this.state.recNumEx);
		} else console.log("from side nav, can't go to recommended exercise");
	}

	constructButtonList(instructions, readOrWrite) {
		let buttonsList = [];

		// add instructions
		instructions.map((item, index) => {
			let read = this.props.instructionsRead && this.props.instructionsRead[this.state.conceptCode] && this.props.instructionsRead[this.state.conceptCode][readOrWrite] 
				? this.props.instructionsRead[this.state.conceptCode][readOrWrite].includes(index) : false;

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
					<NavItem name={item} read={read} selectedIndex={this.props.selectedIndex} index={`${readOrWrite}${index}`} isExercise={false}></NavItem>
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
									selectedIndex={this.props.selectedIndex} 
									index={`${readOrWrite}e${index}`}>
									</NavItem>
									</Link>
				);
			}
		});
		return <List style={{ width: '100%' }}>{buttonsList}</List>;
	}

	render() {
		let readingSection = this.constructButtonList(this.state.readInstructions, Categories.READ);
		let writingSection = this.constructButtonList(this.state.writeInstructions, Categories.WRITE);
		let ref = this;

		let conceptHasExercises = Object.keys(this.props.userBKTParams).includes(this.state.conceptCode);
		let readProgress = conceptHasExercises ? this.props.userBKTParams[this.state.conceptCode][Categories.READ][progressField] : null; 
		let writeProgress = conceptHasExercises ? this.props.userBKTParams[this.state.conceptCode][Categories.WRITE][progressField]: null;
		
		let conceptName = formatCamelCasedString(this.state.title);

		let style = {
			marginTop: '10px',
			width: '100%',
			// borderLeft: "8px solid #4054B2" // for recommendation
		}

		let readPercent = conceptHasExercises ? readProgress : DEFAULT_PROGRESS;
		let writePercent = conceptHasExercises ? writeProgress : DEFAULT_PROGRESS;
		
		return (
			<div id={"sidenav"} className={"sidebar"}>
				<CardContent>
					<div className={"sidebar-header"}>
						<h2>{ConceptInventory[this.state.title] ? ConceptInventory[this.state.title].explanations.name : conceptName}</h2>
						{!this.props.persist && <i className="far fa-times-circle sidebar-close" onClick={() => ref.props.closeMenu()}></i>}
					</div>
					<NavSection
						getInstructionTitles={null}
						title={"Overview"}
						progress={null}
						defaultExpanded={this.state.defaultOpen.includes("OVERVIEW") && this.determineIfAnythingDone()}
						body={<ConceptOverview conceptCode={this.state.conceptCode} />}>
					</NavSection>
					<NavSection
						getInstructionTitles={this.getInstructionTitles}
						title={"Reading"}
						defaultExpanded={this.state.defaultOpen.includes("READ")}
						progress={this.props.userCondition !== CONDITIONS.C2 ? <Progress percent={readPercent} /> : null}
						body={readingSection}>
					</NavSection>
					<NavSection
						getInstructionTitles={this.getInstructionTitles}
						title={"Writing"}
						defaultExpanded={this.state.defaultOpen.includes("WRITE")}
						progress={this.props.userCondition !== CONDITIONS.C2 ? <Progress percent={writePercent} /> : null}
						body={writingSection}>
					</NavSection>
					{this.props.userCondition !== CONDITIONS.C2 ?
							<div>
								<Link to={Routes.worldview} onClick={() => this.props.switchToWorldView()}>
									<Button style={style} variant="contained"><i className="fa fa-chevron-left" aria-hidden="true"></i> back to world view</Button>
								</Link>
							</div>
						:
							<div>
								<Link to={(this.state.recExerciseId && this.state.recExerciseType) ? this.getExerciseRoute(this.props.exerciseConceptMap[this.state.recExerciseId], this.state.recExerciseType) : ''}
									onClick={() => this.goToRecommendedExercise()}>
										<Button style={style} variant="contained">next <i className="fa fa-chevron-right" aria-hidden="true"></i></Button>
								</Link>
							</div>
					}
				</CardContent>
			</div>
		);
	}
}

export default SideNavigation;