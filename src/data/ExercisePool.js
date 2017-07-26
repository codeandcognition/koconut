// @flow

import type {Exercise} from './Exercises';

/**
 * Stores the exercise pool
 * @class
 */
const ExercisePool = function(){};

/**
 * Static array containing the exercise pool
 * @type {Array}
 */
ExercisePool.pool = new Map();

/**
 * Adds an exercise to the exercise pool
 * @param exercise - the Exercise to add
 * @param answer - the Exercise answer (undefined if the answer must be evaluated)
 */
ExercisePool.addExercise = function(exercise: Exercise, answer: ?string) {
  this.pool.set(exercise, answer);
};

/**
 * Returns the answer for the given Exercise
 * @param exercise - the Exercise to get an answer for
 * @returns the answer for the given Exercise
 */
ExercisePool.getAnswer = function(exercise: Exercise): string {
  return this.pool.get(exercise);
};

export default ExercisePool;
