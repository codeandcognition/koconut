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
    }
  ){
    this.concept = concept;
    this.type = this.type;
  }
}

/**
 * Contains student knowledge of each concept.
 * @class
 */

class MasteryModel {
  model: ConceptKnowledge[];

  constructor() {
    this.model = [conceptInventory.length];
  }
}
