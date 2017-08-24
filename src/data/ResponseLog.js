// @flow
/**
 * Stores student performance data for an exercise.
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
 * Stores collection of student performance data for exercises.
 */
class ResponseLogClass {
  log: ResponseObject[];

  constructor() {
    this.log = [];
  }

  /**
   * Static function stores submission results into response log.
   * @param id
   * @param concept
   * @param exerciseType
   * @param difficulty
   * @param correct
   * @param timestamp
   */
  addResponse(id: string, concept: string,
                         exerciseType: string,
                         difficulty: number, correct: boolean,
                         timestamp: number) {
    const immutable = Object.freeze(
        new ResponseObject(id, concept, exerciseType, difficulty, correct,
            timestamp));
    this.log.push(immutable);
  };

  /**
   * Returns feedback for the last response (currently just correctness)
   * @returns whether the last response was correct
   */
  getFeedback(): string {
    return this.log[this.log.length - 1].correct
        ? 'correct'
        : 'incorrect';
  };

  getFirstElement(): ResponseObject {
    return this.log[0];
  }

  getLastElement(): ResponseObject {
    return this.log[this.log.length - 1]
  }
}

export const ResponseLog = new ResponseLogClass();
export {ResponseObject};
export default ResponseLogClass;
