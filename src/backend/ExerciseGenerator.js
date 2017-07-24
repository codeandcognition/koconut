// @flow
import {exampleExercises} from '../data/Exercises.js';
import ExerciseTypes from '../data/ExerciseTypes.js';
import MasteryModel from '../data/MasteryModel';

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
    let model = MasteryModel.model;
    return model[Math.random() * model.length].concept;
  }

  /**
   * Returns an exercise type, pulled from exercise type inventory.
   * @returns an exercise type
   */
  getType(): string {
    let types = Object.keys(ExerciseTypes);
    console.log(types);
    return types[Math.random() * types.length];
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