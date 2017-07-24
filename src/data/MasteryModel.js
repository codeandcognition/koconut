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
      knowledge: boolean
  ){
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
      conceptInventory.forEach((c) => this.model.push(
          new ConceptKnowledge(c, false))); // Pushes each concept
    }
  }
}
MasteryModel.model = [];

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
