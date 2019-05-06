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
	persist: boolean
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
		readResults.forEach((item) => {
			readTitles.push(item.title);
		});
		writeResults.forEach((item) => {
			writeTitles.push(item.title);
		});
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
			buttonsList.push(
				<Link key={index}
					onClick={() => this.props.getInstruction(this.props.conceptCode, type, index)}
					to={`/instruction/${this.props.conceptCode}/learn-to-write-code/page=${index}`}
				><NavItem name={item} read={read} suggestionText={"placeholder for now"}></NavItem></Link>
			)
		});
		let { exercises, exerciseIds } = this.filterExercisesByConcept(this.props.conceptCode, type);
		exercises.map((ex, index) => {
			buttonsList.push(
				<Link key={"ex" + index}
					to={`/practice/${this.props.conceptCode}/practice-writing-code`}
					onClick={() => this.props.goToExercise(this.props.conceptCode, type,
						ex, exerciseIds[index], index, exerciseIds.length)}><NavItem suggestionText={"placeholder for now"} name={ex.shortPrompt}></NavItem></Link>
			);
		});
		return <List style={{ width: '100%' }}>{buttonsList}</List>;
	}

	render() {
		let readingSection = this.constructButtonList(this.state.readInstructions, "READ");
		let writingSection = this.constructButtonList(this.state.writeInstructions, "WRITE");
		let ref = this;
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
						progress={<Progress percent={0.25} />}
						body={<ConceptOverview conceptCode={this.props.conceptCode} />}>
					</NavSection>
					<NavSection
						getInstructionTitles={this.getInstructionTitles}
						title={"Reading"}
						progress={<Progress percent={0.55} />}
						body={readingSection}>
					</NavSection>
					<NavSection
						getInstructionTitles={this.getInstructionTitles}
						title={"Writing"}
						progress={<Progress percent={0.98} />}
						body={writingSection}>
					</NavSection>
				</CardContent>
			</div>
		);
	}
}

export default SideNavigation;