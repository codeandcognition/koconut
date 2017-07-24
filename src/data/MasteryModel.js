// @flow
/**
 * Models student knowledge of each concept.
 * @class
 */

import conceptInventory from '../backend/Concepts.js';

class ConceptKnowledge {
  concept: string;
  knowledge: boolean;

  constructor(
      concept: string,
      knowledge: boolean) {
    this.concept = concept;
    this.knowledge = knowledge;
  }
}

/**
 * Contains student knowledge of each concept.
 * @class
 */
const MasteryModel = function() {
  return {
    constructor: function() {
      // Pushes each concept
    },
  };
};
MasteryModel.model = [];
MasteryModel.populate = function() {
      conceptInventory.forEach((c) => MasteryModel.model.push(
          new ConceptKnowledge(c, false)));
    }();
    
MasteryModel.updateModel = function(concept: string, knowledge: boolean) {
  let conceptIndex = MasteryModel.model.findIndex((e) => e.concept === concept);
  MasteryModel.model[conceptIndex].knowledge = knowledge;
};

// var MasteryModel {g
//   model: ConceptKnowledge[];
//   constructor = function() {
//     this.model = [];
//   }
// }
// MasteryModel.model = [];
// MasteryModel.populate = function() {
//   conceptInventory.forEach((c) => MasteryModel.model.push(
//       new ConceptKnowledge(c, {read: false, write: false}))); // Pushes each concept
// };

export default MasteryModel;
