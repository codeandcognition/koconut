// @flow
import {exampleExercises} from '../data/Exercises.js';
import ExerciseTypes from '../data/ExerciseTypes.js';
import ExercisePool from '../data/ExercisePool';

import MasteryModel from '../data/MasteryModel';


class ExerciseGenerator {
  counter: number;

  constructor() {
    this.counter = 0;
  }

  /**
   * Weights values closer to 0 more than values close to 1.
   * @returns {number} [0:1]
   */
  weightByParabolic(): number {
    let x = Math.random();
    let val = x*x - 2*x + 1;
    return val;
  }

  /**
   * Gives optimal index of the next concept to generate questions for.
   * Index is based on a list of concepts, sorted in this order:
   * least mastered -> most mastered
   * @param length
   * @param method
   * @returns {number}
   */
  getConceptIndex(length: number, method: Function): number {
    return Math.floor(method()*length);
  }

  /**
   * Returns a concept for the exercise, pulled from mastery model.
   * @returns an exercise concept
   */
  getConcept(): string {
    let orderedConcepts = MasteryModel.model.sort(
        (a, b) => a.knowledge - b.knowledge);
    let index = this.getConceptIndex(orderedConcepts.length,
        this.weightByParabolic);
    console.log(index);
    return orderedConcepts[index].concept.name;
  }

  /**
   * Returns an exercise type, pulled from exercise type inventory.
   * @returns an exercise type
   */
  getType(): string {
    let types = Object.keys(ExerciseTypes).filter(
        (obj) => typeof ExerciseTypes[obj] !== 'function',
    );
    let ret = types[Math.floor(Math.random() * types.length)];
    return ret;
  }

  /**
   * Returns a generated Exercise
   * @returns a generated Exercise
   */
  generateExercise() {
    let concept = this.getConcept();
    // let type = this.getType();
    let exercisePool = exampleExercises.filter(
        (e) => {return e.exercise.concept === concept;},
    );
    let exercise = exercisePool[Math.floor(
        Math.random() * exercisePool.length)];
    this.counter += 1;
    ExercisePool.addExercise(exercise.exercise, exercise.answer);
    return exercise.exercise;
  }
}

export default ExerciseGenerator;