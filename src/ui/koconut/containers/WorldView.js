// @flow
import React, {Component} from 'react';
import { withRouter} from "react-router-dom";
import {ConceptKnowledge, MasteryModel} from '../../../data/MasteryModel';
import {conceptInventory} from '../../../data/ConceptMap.js';
import ConceptCard from './../components/ConceptCard';
import {t} from '../../../data/ConceptAbbreviations';
import Routes from './../../../Routes';
import LoadingView from './../components/LoadingView';

type Props = {
	setFirebaseUser: Function,
	generateExercise: Function,
	getInstruction: Function
};

/**
 * WorldView is the world view for the app, where the user can see all the
 * exercises they can do and are suggested to do
 * @class
 */
class WorldView extends Component {
	constructor(props: Props) {
		super(props);
		this.state = {
			loading: true
		}
	}

	/**
	 * Returns sorted concepts list sorted by relevance to the user.
	 * Only includes concepts where concept.teach is true and concept.container
	 * is false
	 * @returns {Array.<*>}
	 */
	getOrderedConcepts(): ConceptKnowledge[] {
		return MasteryModel.model.filter((concept) => concept.should_teach && concept.container).sort(
				(a, b) => (b.dependencyKnowledge / b.knowledge -
						a.dependencyKnowledge / a.knowledge));
	}

  /**
   * getConceptsByType takes the orderedConcepts and then grabs only the ones with the 
   * specified type
   * @param {Array.<*>} orderedConcepts concepts from getOrderedConcepts();
   * @param {string} type type to filter by
   */
  getConceptsByType(orderedConcepts: ConceptKnowledge[], type: string) {
    return orderedConcepts.filter(concept => {
      return concept.type === type;
    })
  }

  componentDidMount() {
  	this.mounted = true;
  	this.authUnsub = this.props.firebase ? this.props.firebase.auth().onAuthStateChanged(user => {
  		if (this.mounted) {
				this.setState({loading: true}, () => {
					if (!user) {
						this.props.history.push(Routes.signin);
					}
					this.checkWaiverStatus(user);
				});
			}
		}) : null;
	}

	/**
	 * Function to ensure that learner can't change the route to get to the world view
	 * @param user
	 */
	checkWaiverStatus(user) {
		let databaseRef = this.props.firebase.database().ref("Users/" + user.uid + "/waiverStatus");
		databaseRef.once("value", (snapshot) => {
			if (snapshot == null || !snapshot.val()) {
				this.props.history.push(Routes.welcome);
			} else {
				if (this.mounted) {
					this.setState({loading: false});
				}
			}
		})
	}

	componentWillUnmount() {
  	// unlisten for auth changes
    if (this.authUnsub) {
		  this.authUnsub();
    }
		this.mounted = false;
	}

	renderWorld() {
		let conceptList = this.getOrderedConcepts();
		let titleLeft = [
			{name: t.onboarding, title : "Intro"},
			{name: t.semantic, title : "Code constructs"}
		];
		let titleRight = [
			{name: t.template, title : "Templates"}
		];
		return (
				<div className="container" style={{marginTop: '12vh'}}>
					<div style={{display: "flex"}}>
						<div style={{flexGrow: 3, margin: 10}}>
							{titleLeft.map(cTypeVal => {
								let cType = t[cTypeVal.name];
								return <div key={"world-"+cType} style={{marginTop: 10}}>
									<h1>{cTypeVal.title}</h1>
									{this.getConceptsByType(conceptList, cType).map((concept, index) => {
										let name = conceptInventory[concept.name].explanations.name;
										return <ConceptCard title={name}
																				key={index}
																				concept={concept.name}
																				generateExercise={this.props.generateExercise}
																				getInstruction={this.props.getInstruction}/>
									})}
								</div>
							})
							}
						</div>
						<div style={{flexGrow: 5, margin: 10}}>
							{
								titleRight.map(cTypeVal => {
									let cType = t[cTypeVal.name];
									return <div key={"world-"+cType} style={{marginTop: 10}}>
										<h1>{cTypeVal.title}</h1>
										{this.getConceptsByType(conceptList, cType).map((concept, index) => {
											let name = conceptInventory[concept.name].explanations.name;
											return <ConceptCard title={name}
																					key={index}
																					concept={concept.name}
																					generateExercise={this.props.generateExercise}
																					getInstruction={this.props.getInstruction}/>
										})}
									</div>
								})
							}
						</div>
					</div>
				</div>
		);
	}

  render() {
    return (
			<div>
				{this.state.loading ?
						<LoadingView/> :
						this.renderWorld()
				}
			</div>
		);
	}
}

export default withRouter(WorldView);
