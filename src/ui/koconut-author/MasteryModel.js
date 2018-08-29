// @flow
import conceptInventory from './ConceptMap.js';
import _ from 'lodash/core';

/**
 * ConceptKnowledge object is a node containing a concept, with a boolean
 * to represent the student knowing or not knowing, along with a second
 * boolean to represent if it is a container or not.
 */
class ConceptKnowledge {
  name: string;
  teach: boolean;
  container: boolean;

  dependencies: ConceptKnowledge[];
  parents: ConceptKnowledge[];

  knowledge: number; //p(cognitive mastery) [0,1]
  dependencyKnowledge: number; //p(support cognitive mastery) [0,1]

  constructor(name: string, teach: boolean, container: boolean) {
    this.name = name;
    this.teach = teach;
    this.container = container;

    this.dependencies = [];
    this.parents = [];

    this.knowledge = 0.01; // Initially set to survey value
    this.dependencyKnowledge = 1; // Avg of dependencies' K values
                                  // default is 1 because having no dependencies
                                  // means full knowledge
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
   * Returns the current node's knowledge value.
   * @returns {number}
   */
  getKnowledge() {
    return this.knowledge;
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
   * This is //TODO: an incomplete comment!
   */
  updateParentValues() {
    this.parents.forEach((p) => p.calculateDependencyKnowledge());
  }
}

/**
 * Static class that contains student's knowledge of each concept.
 * @class
 */
class MasteryModelClass {
  model: ConceptKnowledge[];
  modelMap: Map<string, ConceptKnowledge>;

  constructor() {
    this.model = [];
    this.modelMap = new Map();
    this._populate();
  }

  /**
   * Updates concept in student knowledge model with true/false value.
   * @param concepts
   * @param knowledges
   */
  updateModel(concepts: string[], knowledges: number[]) {
    concepts.forEach((concept, i) => {
      let conceptKnowledge = this.modelMap.get(concept);
      if (conceptKnowledge !== undefined && conceptKnowledge !== null)
        conceptKnowledge.updateKnowledgeValue(knowledges[i]);
    });
  }

  /**
   * Updates MasteryModel initial values based on survey data.
   * @param initialValues
   */
  surveyUpdateModel(initialValues: number[]) {
    initialValues.forEach((num, i) => {
      let concept = MasteryModel.model[i];
      //TODO: Make this not a bad hard coded value
      // let denominator = concept.dependencies.length;
      // denominator = denominator === 0 ? 1 : denominator;
      // concept.updateKnowledgeValue((0.5 / denominator) * (num / 5));
      concept.updateKnowledgeValue(num/5);
    });
  }

  /**
   * Populates array with each concept from concept model.
   * @private
   */
  _populate() {
    // Create ConceptKnowledge objects for each concept
    _.forEach(conceptInventory, (c, name) => this.model.push(
        new ConceptKnowledge(name, c.should_teach, c.container)));

    // Create a mapping of strings to ConceptKnowledge objects
    let map = this.modelMap;
    this.model.forEach((m) => map.set(m.name, m));

    // Fill ConceptKnowledge objects with references parents/dependencies
    _.forEach(conceptInventory, (c, name) => {
      // Ensure that map gets a valid ConceptKnowledge object
      let obj_ = map.get(name); // Weird type coercion nonsense
      let obj: ConceptKnowledge;
      if (obj_ !== undefined && obj_ !== null &&
          obj_ instanceof ConceptKnowledge) {
        obj = obj_;
      } else {
        return;
      }
      // Similar type safety for the dependency and parent objects
      c.dependencies.forEach((d) => {
        let dependency = map.get(d);
        if (dependency !== undefined && dependency !== null) obj.addDependency(
            dependency);
      });
      c.parents.forEach((p) => {
        let parent = map.get(p);
        if (parent !== undefined && parent !== null) obj.addParent(parent);
      });
      obj.updateParentValues();
    });
  }
}

export const MasteryModel = new MasteryModelClass();
export {ConceptKnowledge};
export default MasteryModelClass;
