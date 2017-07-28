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
  knowledge: number; //Between 0 and 1
  dependencyKnowledge: number; //Between 0 and 1
  dependencies: ConceptKnowledge[];
  parents: ConceptKnowledge[];

  constructor(
      concept: {
        name: string
      }) {
    this.concept = concept;
    this.knowledge = 0.0;
    this.dependencyKnowledge = 0.0;
    this.dependencies = [];
    this.parents = [];
  }

  /**
   * Append a dependency to the dependencies.
   * @param c
   */
  addDependency(c: ConceptKnowledge) {
    this.dependencies.push(c);
  }

  /**
   * Append a parent to the parents.
   * @param c
   */
  addParent(c: ConceptKnowledge) {
    this.parents.push(c);
  }

  /**
   * Update the mastery value for this concept object.
   * When mastery changes, its parent dependency value will need updating too.
   * @param num
   */
  updateKnowledgeValue(num: number) {
    this.knowledge = num;
    this.updateParentValues();
  }

  /**
   * Calculates current node's dependency knowledge.
   */
  calculateDependencyKnowledge() {
    this.dependencyKnowledge = (this.dependencies.reduce(
            (d1, d2) => d1.knowledge + d2.knowledge)) /
        this.dependencies.length;
  }

  /**
   * Updates parents' dependency knowledge values.
   * This is
   */
  updateParentValues() {
    this.parents.forEach((p) => p.calculateDependencyKnowledge());
  }
}

/**
 * Static class that contains student's knowledge of each concept.
 * @class
 */
const MasteryModel = function() {
};

/**
 * Static array that contains all of the concepts. Dummy version of model.
 * @type {Array}
 */
MasteryModel.model = [];

MasteryModel.modelMap = new Map();

/**
 * Populates array with each concept from concept model.
 */
MasteryModel.populate = function() {
  conceptInventory.map((c) => MasteryModel.model.push(
      new ConceptKnowledge(c)));
  let map = MasteryModel.modelMap;
  MasteryModel.model.map((m) => map.set(m.concept.name, m));
  conceptInventory.forEach(function(c) {
    let obj = map.get(c.name);
    c.dependencies.map((d) => obj.addDependency(map.get(d)));
    c.parents.map((p) => obj.addParent(map.get(p)));
    console.log(obj);
  });
  console.log(MasteryModel.model);
}();

/**
 * Updates concept in student knowledge model with true/false value.
 * @param concept
 * @param knowledge
 */
MasteryModel.updateModel = function(concept: string, knowledge: number) {
  let conceptKnowledge = MasteryModel.modelMap.get(concept);
  conceptKnowledge.updateKnowledgeValue(knowledge);
};

export {ConceptKnowledge, MasteryModel};
