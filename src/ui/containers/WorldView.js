// @flow
import React, {Component} from 'react';
import {ConceptKnowledge, MasteryModel} from '../../data/MasteryModel';
import {conceptInventory} from '../../data/ConceptMap.js';
import ConceptCard from './../components/ConceptCard';

/**
 * WorldView is the world view for the app, where the user can see all the
 * exercises they can do and are suggested to do
 * @class
 */
class WorldView extends Component {

	/**
	 * Returns sorted concepts list sorted by relevance to the user.
	 * Only includes concepts where concept.teach is true and concept.container
	 * is false
	 * @returns {Array.<*>}
	 */
	getOrderedConcepts(): ConceptKnowledge[] {
		return MasteryModel.model.filter((concept) => concept.teach && !concept.container).sort(
				(a, b) => (b.dependencyKnowledge / b.knowledge -
						a.dependencyKnowledge / a.knowledge));
	}


	render() {
		let conceptList = this.getOrderedConcepts();
		return (
				<div className="container" style={{marginTop: '5%'}}>
					<h1>Intro</h1>
					<li>Here you'll learn to code</li>
					<li>How code runs</li>
					<h1>Concepts</h1>
					{
						conceptList.map((concept, index) => {
							let name = conceptInventory[concept.name].explanations.name;
							return <ConceptCard title={name} key={index}/>
						})
					}
				</div>
		);
	}
}

export default WorldView;
