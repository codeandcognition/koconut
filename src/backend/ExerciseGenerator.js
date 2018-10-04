// @flow
import ExerciseTypes from '../data/ExerciseTypes.js';
import conceptInventory from '../data/ConceptMap';
// import typeof doesn't agree with Flow for some reason:
//   https://flow.org/en/docs/types/modules/
// So, we import all of ConceptKnowledge
import {ConceptKnowledge, MasteryModel} from '../data/MasteryModel';

/**
 * Generates exercises associated with concepts
 * @class
 */
class ExerciseGenerator {
  counter: number;
  getOrderedConcepts: Function;

  constructor(getOrderedConcepts: Function) {
    this.getOrderedConcepts = getOrderedConcepts;
    this.counter = 0;
  }

  /**
   * Returns and array of exercises for the given exercise type and concept
   * @param exerciseType - String ("READ" or "WRITE")
   * @param concept - String (Camel Cased)
   * @param exerciseList - List of exercises coming from firebase
   * @param conceptMapGetter - List of concept mappings coming from firebase
   * @return {any[]} Array of exercises for the given exercise type and concept
   */
  getExercisesByTypeAndConcept(exerciseType: string,
                               concept: string,
                               exerciseList: any, // calm down flow jeez
                               conceptMapGetter: any): any { // made conceptMapGetter an any type to stop flow's anger
    let results = [];
    let exerciseIds = [];
    if(exerciseList && conceptMapGetter) {
    	if (conceptMapGetter[concept]) {
    	  exerciseIds = conceptMapGetter[concept][exerciseType];
    	  if (exerciseIds) {
					exerciseIds.forEach(id => {
						results.push(exerciseList[id]);
					});
        }
      }
    }
    return {results, exerciseIds};
  }


  /**
   * Gives optimal index of the next concept to generate questions for.
   * Index is based on a list of concepts, sorted in this order:
   * least mastered -> most mastered
   * @param concepts
   * @param method
   * @returns {number}
   */
  getConceptIndex(concepts: ConceptKnowledge[], method: Function): number {
    if (concepts.length > 0) {
      let min = concepts[0].knowledge;
      let max = concepts[concepts.length - 1].knowledge;
      return Math.floor(method(max, min) * concepts.length);
    }
    return 0;
  }

  /**
   * Returns sorted concepts list sorted by relevance to the user.
   * @returns {Array.<*>}
   */
  getOrderedConcepts(): ConceptKnowledge[] {
    return MasteryModel.model.filter((concept) => concept.should_teach).sort(
        (a, b) => (b.dependencyKnowledge / b.knowledge -
        a.dependencyKnowledge / a.knowledge));
  }

  /**
   * Returns the first N most relevant concepts. Relevance determined
   * by getOrderedConcepts() algorithm.
   * @param size
   * @returns {Array.<ConceptKnowledge>}
   */
  getConcepts(size: number): string[] {
    return this.getOrderedConcepts().slice(0, size).map((c) => c.name);
  }

  getConceptsRelativeTo(concept: string): string[] {
    let ck = MasteryModel.model.filter((c) => c.name === concept)[0];
    return [this.getHarderConcept(ck), this.getEasierConcept(ck),
            this.getNewerConcept(ck), concept];
  }

  filterShouldTeach(concepts: ConceptKnowledge[]): ConceptKnowledge[] {
    return concepts.filter((c) => conceptInventory[c.name].should_teach);
  }
  
  getHarderConcept(concept: ConceptKnowledge) {
    if(!concept) return '';
    let chosen = concept.parents.sort(
        (a, b) => a.dependencyKnowledge - b.dependencyKnowledge);
    chosen = this.filterShouldTeach(chosen)[0];
    return chosen ? chosen.name : '';
  }

  getEasierConcept(concept: ConceptKnowledge) {
    if(!concept) return '';
    let chosen = concept.dependencies.sort(
        (a, b) => a.knowledge - b.knowledge);
    chosen = this.filterShouldTeach(chosen)[0];
    return chosen ? chosen.name : '';
  }
  
  getNewerConcept(concept: ConceptKnowledge) {
    let chosen = this.getOrderedConcepts().filter((c) => c !== concept);
    return this.filterShouldTeach(chosen)[0].name;
  }

  /**
   * Returns the most relevant concept. Relevance determined by
   * getOrderedConcepts() algorithm.
   * @returns an exercise concept
   */
  getConcept(): string {
    return this.getConcepts(1)[0];
  }

  /**
   * Returns an exercise type, pulled from exercise type inventory.
   * @returns an exercise type
   */
  getType(): string {
    let types = Object.keys(ExerciseTypes).filter(
        (obj) => typeof ExerciseTypes[obj] !== 'function',
    );
    return types[Math.floor(Math.random() * types.length)];
  }

}

export default ExerciseGenerator;