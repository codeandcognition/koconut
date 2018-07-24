// @flow
import React, {Component} from 'react';
import {ConceptKnowledge, MasteryModel} from '../../../data/MasteryModel';
import {conceptInventory} from '../../../data/ConceptMap.js';
import ConceptCard from './../components/ConceptCard';
import {t} from '../../../data/ConceptAbbreviations';

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

  render() {
    let conceptList = this.getOrderedConcepts();
    let titleLeft = [
      {name: t.onboarding, title : "Intro"},
      {name: t.semantic, title : "Code constructs"}
    ]

    let titleRight = [
      {name: t.template, title : "Templates"}
    ]

    return (
        <div className="container" style={{marginTop: '12vh'}}>
          <div style={{display: "flex"}}>
            <div style={{flexGrow: 3, margin: 10}}>
            {
              titleLeft.map(cTypeVal => {
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
					{/* {
						conceptList.map((concept, index) => {
							let name = conceptInventory[concept.name].explanations.name;
							return <ConceptCard title={name}
																	key={index}
																	concept={concept.name}
																	generateExercise={this.props.generateExercise}
																	getInstruction={this.props.getInstruction}/>
						})
					} */}
				</div>
		);
	}
}

export default WorldView;
