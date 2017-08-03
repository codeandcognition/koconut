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

    this.knowledge = 0.01; // Initially set to probL
    this.dependencyKnowledge = 0.01; // Avg of dependencies' K values
    this.probL = 0.2; // Set to 0.3/(#dep + 1) * confidence/max-confidence
    this.probT = 0.5; // (diff + 1) * 0.3
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
  probGuess: number;
  probSlip: number;
  model: ConceptKnowledge[];
  modelMap: Map<string, ConceptKnowledge>;

  constructor() {
    this.probGuess = 0.1;
    this.probSlip = 0.05; // 0.05 * (difficulty + 1)
    this.model = [];
    this.modelMap = new Map();
    this._populate();
  }

  /**
   * Updates concept in student knowledge model with true/false value.
   * @param concept
   * @param knowledge
   */
  updateModel(concept: string, knowledge: number) {
    let conceptKnowledge = this.modelMap.get(concept);
    if(conceptKnowledge !== undefined && conceptKnowledge !== null)
      conceptKnowledge.updateKnowledgeValue(knowledge);
  }

  /**
   * Updates MasteryModel initial values based on survey data.
   * @param initialValues
   */
  surveyUpdateModel(initialValues: number[]) {
    initialValues.forEach((num, i) => {
      let concept = MasteryModel.model[i];
      //TODO: Make this not a bad hard coded value
      let denominator = concept.dependencies.length;
      denominator = denominator === 0 ? 1 : denominator;
      concept.updateKnowledgeValue((0.5/denominator)*(num/5));
    });
  }

  /**
   * Populates array with each concept from concept model.
   * @private
   */
  _populate() {
    // Create ConceptKnowledge objects for each concept
    conceptInventory.map((c) => this.model.push(
        new ConceptKnowledge(c.name)));

    // Create a mapping of strings to ConceptKnowledge objects
    let map = this.modelMap;
    this.model.map((m) => map.set(m.name, m));

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
    });
  }
}



export const MasteryModel = new MasteryModelClass();
export {ConceptKnowledge};
export default MasteryModelClass;
