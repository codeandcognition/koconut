// @flow
import {exampleExercises} from '../data/Exercises.js';

class ExerciseGenerator {
  counter: number;

  constructor() {
    this.counter = 0;
  }

  /**
   * Returns a generated Exercise
   * @returns {Prompt} - a generated Exercise
   */
  generateExercise() {
    let exercise = exampleExercises[this.counter % exampleExercises.length];
    this.counter += 1;
    return exercise;
  }
}

export default ExerciseGenerator;