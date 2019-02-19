import React, {Component} from 'react';
import List from '@material-ui/core/List';
import NavItem from './NavItem';
import './SideNavigation.css';
import ConceptOverview from './ConceptOverview';
import Collapse from '@material-ui/core/Collapse';
import NavSection from './NavSection';
import { Link } from "react-router-dom";

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
};

class SideNavigation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: props.title,
			conceptCode: props.conceptCode
		}
	}

	constructReadingSecion() {

	}

	constructWritingSection() {

	}

	render() {
		let readingSection = this.constructReadingSecion();
		let writingSection = this.constructWritingSection();

		return (
				<div id={"sidenav"} className={"sidebar"}>
					<Typography className={classes.heading}>{this.state.title}</Typography>
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
				</div>
		);
	}
}

export default SideNavigation;