// @flow
/**
 * Stores student performance data for a exercise.
 * @class
 */

class ResponseObject {
  id: string;
  concept: string;
  exerciseType: string;
  difficulty: number;
  correct: boolean;
  timestamp: number;

  constructor(
      id: string, //Prompt ID for matching
      concept: string, //Programming concept, maps to mastery model
      exerciseType: string, //Type of exercise
      difficulty: number, //
      correct: boolean,
      timestamp: number) {
    this.id = id;
    this.concept = concept;
    this.exerciseType = exerciseType;
    this.difficulty = difficulty;
    this.correct = correct;
    this.timestamp = timestamp;
  }
}

/**
 * Stores student performance data for a exercise.
 */
var ResponseLog = function() {
  return {
    constructor: function() {
      this.log = [];
    },
    addResponse: function(id: string, concept: string, exerciseType: string,
                          difficulty: number, correct: boolean, timestamp: number) {
      const immutable = Object.freeze(
          new ResponseObject(id, concept, exerciseType, difficulty, correct,
              timestamp));
      this.log.push(immutable);
    }
  }
}