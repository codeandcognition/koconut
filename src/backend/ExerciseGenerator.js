// @flow
import {exampleExercises} from '../data/Exercises.js';
import {MasteryModel} from '../data/MasteryModel';

class ExerciseGenerator {
  counter: number;

  constructor() {
    this.counter = 0;
  }

  getConcept():string {
    let model = MasteryModel.model;
    return model[Math.random()*model.length].concept;
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