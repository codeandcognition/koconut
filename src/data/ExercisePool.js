// @flow
import type {Exercise} from './Exercises';

/**
 * Stores the exercise pool
 * @class
 */
class ExercisePoolClass {
  pool: Map<Exercise, ?string>;

  constructor() {
    this.pool = new Map();
  }

  /**
   * Adds an exercise to the exercise pool
   * @param exercise - the Exercise to add
   * @param answer - the Exercise answer (undefined if the answer must be evaluated)
   */
  addExercise(exercise: Exercise, answer: ?string) {
    this.pool.set(exercise, answer);
  }

  /**
   * Returns the answer for the given Exercise
   * @param exercise - the Exercise to get an answer for
   * @returns the answer for the given Exercise
   */
  getAnswer(exercise: Exercise): ?string {
    return this.pool.get(exercise);
  }


}

let ExercisePool = new ExercisePoolClass();

export default ExercisePool;
export {ExercisePoolClass};
