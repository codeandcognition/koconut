// @flow
import {exampleExercises} from '../data/Exercises.js';
import ExerciseTypes from '../data/ExerciseTypes.js';
import ExercisePool from '../data/ExercisePool';

// import typeof doesn't agree with Flow for some reason:
//   https://flow.org/en/docs/types/modules/
// So, we import all of ConceptKnowledge
import {ConceptKnowledge, MasteryModel} from '../data/MasteryModel';

class ExerciseGenerator {
  counter: number;

  constructor() {
    this.counter = 0;
  }

  /**
   * Weights values closer to 0 more than values close to 1.
   * As range of mastery narrows, topics' chances gain equality.
   * @returns {number} [0:1]
   */
  weightByParabolic(max?: number, min?: number): number {
    let x = Math.random();
    let k = (max && min && (max - min > 0)) ?
        1 / (max - min) + (1 - (max - min)) :
        1;
    return (x * x - (1 + k) * x + 1) / k + (1 - 1 / k);
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
    return MasteryModel.model.sort(
        (a, b) => (a.knowledge * a.dependencyKnowledge - b.knowledge * b.dependencyKnowledge));
  }

  /**
   * Returns the most relevant concept. Relevance determined by
   * getOrderedConcepts() algorithm.
   * @returns an exercise concept
   */
  getConcept(): string {
    // let index = this.getConceptIndex(orderedConcepts, this.weightByParabolic);
    return this.getOrderedConcepts()[0].name;
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

  /**
   * Returns a generated Exercise
   * @returns a generated Exercise
   */
  generateExercise() {
    //First exercise to pass is initial survey
    if(this.counter === 0) {
      let ret = exampleExercises.filter((e) => e.exercise.type === ExerciseTypes.survey)[0].exercise;
      console.log(ret);
      return ret;
    }

    let concept = this.getConcept();
    // let type = this.getType();
    let exercisePool = exampleExercises.filter(
        (e) => {
          return e.exercise.concept === concept;
        },
    );
    let exercise = exercisePool[Math.floor(
        Math.random() * exercisePool.length)];
    this.counter += 1;
    ExercisePool.addExercise(exercise.exercise, exercise.answer);
    return exercise.exercise;
  }

  /**
   * Gets a specific exercise from the example exercises
   * For DEBUG eyes only 👀
   * @private
   * @returns the exercise at the given index (wraps around if index > size)
   */
  _generateExercise(index: number) {
    let exercise = exampleExercises[index % exampleExercises.length];
    ExercisePool.addExercise(exercise.exercise, exercise.answer);
    return exercise.exercise;
  }
}

export default ExerciseGenerator;