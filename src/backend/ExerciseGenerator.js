// @flow
import {exampleExercises} from '../data/Exercises.js';
import ExerciseTypes from '../data/ExerciseTypes.js';
import conceptInventory from '../backend/Concepts.js';

class ExerciseGenerator {
  counter: number;

  constructor() {
    this.counter = 0;
  }

  /**
   * Returns a concept for the exercise, pulled from mastery model.
   * @returns an exercise concept
   */
  getConcept(): string {
    let ret = conceptInventory[Math.floor(
        Math.random() * conceptInventory.length)].name;
    // console.log(ret);
    return ret;
  }

  /**
   * Returns an exercise type, pulled from exercise type inventory.
   * @returns an exercise type
   */
  getType(): string {
    let types = Object.keys(ExerciseTypes).
        filter((obj) => typeof ExerciseTypes[obj] !== 'function');
    let ret = types[Math.floor(Math.random() * types.length)];
    console.log(ret);
    return ret;
  }

  /**
   * Returns a generated Exercise
   * @returns {Prompt} - a generated Exercise
   */
  generateExercise() {
    let concept = this.getConcept();
    let type = this.getType();
    let exercisePool = exampleExercises.filter
    ((e) => {
      return e.concept === concept;
    });
    let exercise = exercisePool[Math.floor(
        Math.random() * exercisePool.length)];
    this.counter += 1;
    return exercise;
  }
}

export default ExerciseGenerator;