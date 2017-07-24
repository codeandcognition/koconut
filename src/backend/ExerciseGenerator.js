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
    return conceptInventory[Math.floor(Math.random() * conceptInventory.length)];
  }

  /**
   * Returns an exercise type, pulled from exercise type inventory.
   * @returns an exercise type
   */
  getType(): string {
    let types = Object.keys(ExerciseTypes);
    return types[Math.floor(Math.random() * types.length)];
  }

  /**
   * Returns a generated Exercise
   * @returns {Prompt} - a generated Exercise
   */
  generateExercise() {
    let exercisePool = exampleExercises.filter
      ((e) => e.concept === this.getConcept() && e.type === this.getType());
    console.log(exercisePool);
    let exercise = exampleExercises[Math.floor(Math.random() * exampleExercises.length)];
    this.counter += 1;
    return exercise;
  }
}

export default ExerciseGenerator;