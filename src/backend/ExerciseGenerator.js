// @flow
import {exampleQuestions} from '../backend/Questions.js';

class ExerciseGenerator {
  counter: number;

  constructor() {
    this.counter = 0;
  }

  /**
   * Returns a generated Exercise
   * @returns {Question} - a generated Exercise
   */
  generateExercise() {
    let question = exampleQuestions[this.counter % exampleQuestions.length];
    this.counter += 1;
    return question;
  }
}

export default ExerciseGenerator;