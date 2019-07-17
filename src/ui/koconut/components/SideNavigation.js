import React, { Component } from 'react';
import { Link } from "react-router-dom";
import firebase from 'firebase';
import List from '@material-ui/core/List';
import ConceptOverview from './ConceptOverview';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import ExerciseGenerator from '../../../backend/ExerciseGenerator';
import NavSection from './NavSection';
import NavItem from './NavItem';
import './SideNavigation.css';
import Progress from './Progress';
import ConceptInventory from './../../../data/ConceptMap';
import { formatCamelCasedString } from './../../../utils/formatCamelCasedString';

const LEARN = "Learn";
const PRACTICE = "Practice";

const Categories = {
	READ: "READ",
	WRITE: "WRITE"
}

const progressField = "pKnown";

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

class SideNavigation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: props.title,
			conceptCode: props.conceptCode,
			readInstructions: [],
			writeInstructions: [],
			instructionsMap: props.instructionsMap
		}
		this.generator = new ExerciseGenerator(this.props.getOrderedConcepts);
		this.getInstructionTitles = this.getInstructionTitles.bind(this);
	}

	componentDidMount() {
		this.getInstructionTitles();
	}

	componentWillReceiveProps(props) {
		this.setState({
			title: props.title,
			conceptCode: props.conceptCode,
			conceptMapGetter: props.conceptMapGetter,
			instructionsMap: props.instructionsMap
		}, this.getInstructionTitles());
	}

	getInstructionTitles() {
		if (this.props.instructionsMap) {
			let instructions = this.props.instructionsMap[this.props.conceptCode];
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

	filterExercisesByConcept(concept, exerciseType) {
		let exercises = this.generator.getExercisesByTypeAndConcept(exerciseType, concept, this.props.exercisesList, this.props.conceptMapGetter).results;
		let exerciseIds = this.generator.getExercisesByTypeAndConcept(exerciseType, concept, this.props.exercisesList, this.props.conceptMapGetter).exerciseIds;
		return { exercises, exerciseIds };
	}

	constructButtonList(instructions, readOrWrite) {
		let buttonsList = [];
		instructions.map((item, index) => {
			let read = this.props.instructionsRead && this.props.instructionsRead[this.props.conceptCode] && this.props.instructionsRead[this.props.conceptCode][readOrWrite] 
				? this.props.instructionsRead[this.props.conceptCode][readOrWrite].includes(index) : false;

			let text = "";
			if (this.props.instructionRecommendations[this.props.conceptCode] &&
				this.props.instructionRecommendations[this.props.conceptCode][readOrWrite] &&
				this.props.instructionRecommendations[this.props.conceptCode][readOrWrite][index]) {
				let conceptReccomendations = this.props.instructionRecommendations[this.props.conceptCode];
				let recommendationsForType = conceptReccomendations[readOrWrite];
				let instructionReccomendation = recommendationsForType[index];
				if (instructionReccomendation) {
					text = instructionReccomendation.text;
				} else {
					text = "this can help you";
				}
			}
			buttonsList.push(
				<Link key={index}
					onClick={() => this.props.getInstruction(this.props.conceptCode, readOrWrite, index)}
					to={`/instruction/${this.props.conceptCode}/learn-to-${readOrWrite.toLowerCase()}-code/page=${index}`}
				>
					<NavItem name={item} read={read} selectedIndex={this.props.selectedIndex} index={`${readOrWrite}${index}`}></NavItem>
				</Link>
			)
		});
		let { exercises, exerciseIds } = this.filterExercisesByConcept(this.props.conceptCode, readOrWrite);
		exercises.map((ex, index) => {
			let exerciseId = exerciseIds[index];
			let text = "";
			let icon = null;
			let read = this.props.exercisesCompleted && this.props.exercisesCompleted[this.props.conceptCode] ? this.props.exercisesCompleted[this.props.conceptCode].includes(exerciseId) : false;
			if (this.props.exerciseRecommendations[exerciseId]) {
				let recommendation = this.props.exerciseRecommendations[exerciseId];
				text = recommendation.text;
				icon = recommendation.icon;
				if (!text) {
					// if recommendation text isn't set
					text = "recommended for you";
				}
			}
			buttonsList.push(
				<Link key={"ex" + index}
					to={`/practice/${this.props.conceptCode}/practice-${readOrWrite.toLowerCase()}-code`} // TODO: URL endpoint probably should not be hard-coded
					onClick={() => this.props.goToExercise(this.props.conceptCode, readOrWrite,
						ex, exerciseIds[index], index, exerciseIds.length)}>
							<NavItem read={read} suggestionText={text} name={ex.shortPrompt} icon={icon}
								selectedIndex={this.props.selectedIndex} 
								index={`${readOrWrite}e${index}`}>
								</NavItem>
								</Link>
			);
		});
		return <List style={{ width: '100%' }}>{buttonsList}</List>;
	}

	render() {
		let readingSection = this.constructButtonList(this.state.readInstructions, Categories.READ);
		let writingSection = this.constructButtonList(this.state.writeInstructions, Categories.WRITE);
		let ref = this;

		let readProgress = this.props.userBKTParams[this.props.conceptCode][Categories.READ][progressField]; 
		let writeProgress = this.props.userBKTParams[this.props.conceptCode][Categories.WRITE][progressField];
		
		let conceptName = formatCamelCasedString(this.state.title);
		
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
						defaultExpanded={this.props.defaultOpen.includes("OVERVIEW")}
						body={<ConceptOverview conceptCode={this.props.conceptCode} />}>
					</NavSection>
					<NavSection
						getInstructionTitles={this.getInstructionTitles}
						title={"Reading"}
						defaultExpanded={this.props.defaultOpen.includes("READ")}
						progress={<Progress percent={readProgress} />}
						body={readingSection}>
					</NavSection>
					<NavSection
						getInstructionTitles={this.getInstructionTitles}
						title={"Writing"}
						defaultExpanded={this.props.defaultOpen.includes("WRITE")}
						progress={<Progress percent={writeProgress} />}
						body={writingSection}>
					</NavSection>
				</CardContent>
			</div>
		);
	}
}

export default SideNavigation;