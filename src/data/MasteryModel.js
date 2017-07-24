// @flow
/**
 * Models student knowledge of each concept.
 * @class
 */

import {conceptInventory} from '../backend/Concepts.js';

class ConceptKnowledge {
  concept: string;
  type: {
    read: boolean,
    write: boolean
  };

  constructor(
      concept: string,
      type: {
        read: boolean,
        write: boolean
      }) {
    this.concept = concept;
    this.type = type;
  }
}

/**
 * Contains student knowledge of each concept.
 * @class
 */

class MasteryModel {
  model: ConceptKnowledge[];

  constructor() {
    this.model = [];
    conceptInventory.forEach((c) => this.model.push(
        new ConceptKnowledge(c, {read: false, write: false}))); // Pushes each concept
  }
}

export default MasteryModel;