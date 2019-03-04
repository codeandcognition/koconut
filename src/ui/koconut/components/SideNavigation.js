import React, {Component} from 'react';
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
};

class SideNavigation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: props.title,
			conceptCode: props.conceptCode,
			readInstructions: [],
			writeInstructions: []
		}

		this.generator = new ExerciseGenerator(this.props.getOrderedConcepts);
	}

	componentWillReceiveProps(props) {
		this.setState({
			title: props.title,
			conceptCode: props.conceptCode,
			readInstructions: [],
			writeInstructions: []
		}, this.getInstructionTitles());
	}

	getInstructionTitles() {
		let databaseRef = firebase.database().ref("Instructions/" + this.props.conceptCode);
		let componentRef = this;
		databaseRef.on("value", function (snapshot) {
			let results = snapshot.val();
			if (results != null) {
				let readResults = results["READ"];
				let writeResults = results["WRITE"];
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
				<NavItem name={item} read={read} suggestionText={"placeholder for now"}></NavItem>
			)
		});
		let exerciseIds = this.filterExercisesByConcept(this.props.conceptCode, type).exerciseIds;
		this.filterExercisesByConcept(this.props.conceptCode, type).exercises.map((ex, index) => {
			buttonsList.push(
				<NavItem suggestionText={"placeholder for now"} name={ex.shortPrompt}></NavItem>
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
							<i className="far fa-times-circle sidebar-close" onClick={() => ref.props.closeMenu()}></i>
						</div>
						<NavSection
							title={"Overview"}
							body={<ConceptOverview conceptCode={this.state.conceptCode} />}>
						</NavSection>
						<NavSection
							title={"Reading"}
							body={readingSection}>
						</NavSection>
						<NavSection
							title={"Writing"}
							body={writingSection}>
						</NavSection>
					</CardContent>
				</div>
		);
	}
}

export default SideNavigation;