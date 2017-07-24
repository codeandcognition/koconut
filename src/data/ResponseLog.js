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
class ResponseLog {
  log: ResponseObject[];

  constructor() {
    this.log = [];
  }

  addResponse(id: string, concept: string, exerciseType: string,
              difficulty: number, correct: boolean, timestamp: number) {
    /*
      Note: Here we use Object.freeze to make sure ResponseObjects can't be
      tampered with. Object.freeze is only a shallow freeze, so if we have
      objects within ResponseObject in the future, we will have to implement
      a deep freeze feature.
      https://mathiasbynens.be/notes/es6-const
     */
    const immutable = Object.freeze(
        new ResponseObject(id, concept, exerciseType, difficulty, correct,
            timestamp));
    this.log.push(immutable);
  }
}

export default ResponseLog;