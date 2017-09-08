// @flow
import conceptInventory from './ConceptMap.js';

/**
 * ConceptKnowledge object is a node containing a concept, with a boolean
 * to represent the student knowing or not knowing.
 */
class ConceptKnowledge {
  name: string;
  teach: boolean;

  dependencies: ConceptKnowledge[];
  parents: ConceptKnowledge[];

  knowledge: number; //p(cognitive mastery) [0,1]
  dependencyKnowledge: number; //p(support cognitive mastery) [0,1]

  constructor(name: string, teach: boolean) {
    this.name = name;
    this.teach = teach;

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
    conceptInventory.map((c) => this.model.push(
        new ConceptKnowledge(c.name, c.should_teach)));

    // Create a mapping of strings to ConceptKnowledge objects
    let map = this.modelMap;
    this.model.forEach((m) => map.set(m.name, m));

    // Fill ConceptKnowledge objects with references parents/dependencies
    conceptInventory.forEach((c) => {
      // Ensure that map gets a valid ConceptKnowledge object
      let obj_ = map.get(c.name); // Weird type coercion nonsense
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
    });
  }
}

export const MasteryModel = new MasteryModelClass();
export {ConceptKnowledge};
export default MasteryModelClass;
