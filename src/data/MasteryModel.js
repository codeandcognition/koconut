// @flow

import conceptInventory from '../backend/Concepts.js';

/**
 * ConceptKnowledge object is a node containing a concept, with a boolean
 * to represent the student knowing or not knowing.
 */
class ConceptKnowledge {
  name: string;

  dependencies: ConceptKnowledge[];
  parents: ConceptKnowledge[];

  knowledge: number; //p(cognitive mastery) [0,1]
  dependencyKnowledge: number; //p(support cognitive mastery) [0,1]
  probL: number; //p(initial learned state) [0,1]
  probT: number; //p(transition from unlearned -> learned) [0,1]

  constructor(name: string) {
    this.name = name;

    this.dependencies = [];
    this.parents = [];

    this.knowledge = 0.01;
    this.dependencyKnowledge = 0.01;
    this.probL = 0.2;
    this.probT = 0.5;
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
            (sum, d) => sum + d.knowledge, 0)) /
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

MasteryModel.probGuess = 0.1;
MasteryModel.probSlip = 0.1;

/**
 * Static array that contains all of the concepts. Dummy version of model.
 * @type {Array}
 */
MasteryModel.model = [];

/**
 * Mapping between a concept name and concept object
 * @type {Map}
 */
MasteryModel.modelMap = new Map();

/**
 * Populates array with each concept from concept model.
 */
MasteryModel.populate = function() {
  // Create ConceptKnowledge objects for each concept
  conceptInventory.map((c) => MasteryModel.model.push(
      new ConceptKnowledge(c.name)));

  // Create a mapping of strings to ConceptKnowledge objects
  let map = MasteryModel.modelMap;
  MasteryModel.model.map((m) => map.set(m.name, m));

  // Fill ConceptKnowledge objects with references parents/dependencies
  conceptInventory.forEach((c) => {
    // Ensure that map gets a valid ConceptKnowledge object
    let obj_ = map.get(c.name); // Weird type coercion nonsense
    let obj : ConceptKnowledge;
    if(obj_ !== undefined && obj_ !== null && obj_ instanceof ConceptKnowledge) {
      obj = obj_;
    } else {
      return;
    }
    // Similar type safety for the dependency and parent objects
    c.dependencies.forEach((d) => {
      let dependency = map.get(d);
      if(dependency !== undefined && dependency !== null) obj.addDependency(dependency);
    });
    c.parents.forEach((p) => {
      let parent = map.get(p);
      if(parent !== undefined && parent !== null) obj.addParent(parent);
    });
    // console.log(obj);
  });
  // console.log(MasteryModel.model);
}();

/**
 * Updates concept in student knowledge model with true/false value.
 * @param concept
 * @param knowledge
 */
MasteryModel.updateModel = function(concept: string, knowledge: number) {
  let conceptKnowledge = MasteryModel.modelMap.get(concept);
  if(conceptKnowledge !== undefined && conceptKnowledge !== null)
    conceptKnowledge.updateKnowledgeValue(knowledge);
};

export {ConceptKnowledge, MasteryModel};
