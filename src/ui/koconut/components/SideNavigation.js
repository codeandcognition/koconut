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
	open: boolean,
	generateExercise: Function,
	getInstruction: Function,
	exercisesList: any,
	conceptMapGetter: any,
	getOrderedConcepts: Function,
	goToExercise: Function,
	closeMenu: Function,
	persist: boolean,
	updateUserState: Function
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

	filterExercisesByConcept(concept, exerciseType) {
		let exercises = this.generator.getExercisesByTypeAndConcept(exerciseType, concept, this.props.exercisesList, this.props.conceptMapGetter).results;
		let exerciseIds = this.generator.getExercisesByTypeAndConcept(exerciseType, concept, this.props.exercisesList, this.props.conceptMapGetter).exerciseIds;
		return { exercises, exerciseIds };
	}

	constructButtonList(instructions, type) {
		let buttonsList = [];
		instructions.map((item, index) => {
			let read = this.props.instructionsRead &&
				this.props.instructionsRead[this.props.conceptCode] &&
				this.props.instructionsRead[this.props.conceptCode]["READ"] ?
				this.props.instructionsRead[this.props.conceptCode]["READ"][index] : null;
			let text = "";
			if (this.props.instructionRecommendations[this.props.conceptCode] &&
				this.props.instructionRecommendations[this.props.conceptCode][type] &&
				this.props.instructionRecommendations[this.props.conceptCode][type][index]) {
				let conceptReccomendations = this.props.instructionRecommendations[this.props.conceptCode];
				let recommendationsForType = conceptReccomendations[type];
				let instructionReccomendation = recommendationsForType[index];
				if (instructionReccomendation) {
					text = instructionReccomendation.text;
				} else {
					text = "this can help you";
				}
			}
			buttonsList.push(
				<Link key={index}
					onClick={() => this.props.getInstruction(this.props.conceptCode, type, index)}
					to={`/instruction/${this.props.conceptCode}/learn-to-write-code/page=${index}`}
				><NavItem name={item} read={read} suggestionText={"placeholder for now"}></NavItem></Link>
			)
		});
		let { exercises, exerciseIds } = this.filterExercisesByConcept(this.props.conceptCode, type);
		exercises.map((ex, index) => {
			let exerciseId = exerciseIds[index];
			let text = "";
			if (this.props.exerciseRecommendations[exerciseId]) {
				let recommendation = this.props.exerciseRecommendations[exerciseId];
				text = recommendation.text;
				if (!text) {
					// if recommendation text isn't set
					text = "this can help you";
				}
			}
			buttonsList.push(
				<Link key={"ex" + index}
					to={`/practice/${this.props.conceptCode}/practice-writing-code`}
					onClick={() => this.props.goToExercise(this.props.conceptCode, type,
						ex, exerciseIds[index], index, exerciseIds.length)}><NavItem suggestionText={text} name={ex.shortPrompt}></NavItem></Link>
			);
		});
		return <List style={{ width: '100%' }}>{buttonsList}</List>;
	}

	render() {
		let readingSection = this.constructButtonList(this.state.readInstructions, "READ");
		let writingSection = this.constructButtonList(this.state.writeInstructions, "WRITE");
		let ref = this;

		let readProgress = this.props.userBKTParams[this.props.conceptCode][Categories.READ][progressField]; 
		let writeProgress = this.props.userBKTParams[this.props.conceptCode][Categories.WRITE][progressField];

		return (
			<div id={"sidenav"} className={"sidebar"}>
				<CardContent>
					<div className={"sidebar-header"}>
						<h2>{this.state.title}</h2>
						{!this.props.persist && <i className="far fa-times-circle sidebar-close" onClick={() => ref.props.closeMenu()}></i>}
					</div>
					<NavSection
						getInstructionTitles={null}
						title={"Overview"}
						progress={null}
						body={<ConceptOverview conceptCode={this.props.conceptCode} />}>
					</NavSection>
					<NavSection
						getInstructionTitles={this.getInstructionTitles}
						title={"Reading"}
						progress={<Progress percent={readProgress} />}
						body={readingSection}>
					</NavSection>
					<NavSection
						getInstructionTitles={this.getInstructionTitles}
						title={"Writing"}
						progress={<Progress percent={writeProgress} />}
						body={writingSection}>
					</NavSection>
				</CardContent>
			</div>
		);
	}
}

export default SideNavigation;