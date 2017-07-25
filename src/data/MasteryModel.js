// @flow

import conceptInventory from '../backend/Concepts.js';

/**
 * ConceptKnowledge object is a node containing a concept, with a boolean
 * to represent the student knowing or not knowing.
 */
class ConceptKnowledge {
  concept: {
    name: string
  };
  knowledge: boolean;

  constructor(
      concept: {
        name: string
      },
      knowledge: boolean) {
    this.concept = concept;
    this.knowledge = knowledge;
  }
}

/**
 * Static class that contains student's knowledge of each concept.
 * @class
 */
const MasteryModel = function(){};

/**
 * Static array that contains all of the concepts. Dummy version of model.
 * @type {Array}
 */
MasteryModel.model = [];

/**
 * Populates array with each concept from concept model.
 */
MasteryModel.populate = function() {
      conceptInventory.forEach((c) => MasteryModel.model.push(
          new ConceptKnowledge(c, false)));
    }();

/**
 * Updates concept in student knowledge model with true/false value.
 * @param concept
 * @param knowledge
 */
MasteryModel.updateModel = function(concept: string, knowledge: boolean) {
  let conceptIndex = MasteryModel.model.findIndex((e) => e.concept.name === concept);
  MasteryModel.model[conceptIndex].knowledge = knowledge;
};


export default MasteryModel;
