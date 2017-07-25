//@flow

import ResponseLog from '../data/ResponseLog';
import MasteryModel from '../data/MasteryModel';
import type {Exercise} from '../data/Exercises';

class ResponseEvaluator {

  /**
   * Takes in a concept, analyzes user log, and performs analysis of user
   * performance to reach conclusion about user knowing a concept.
   * //TODO: Make this better than a tally.
   * @param concept
   * @returns {number}
   */
  static analyzeLog(concept: string):number {
    let responsesWithConcept = ResponseLog.log.filter((res) => res.concept === concept && res.correct === true);
    let val = responsesWithConcept.length/10;
    return val > 1 ? 1 : val;
  }

  /**
   * TODO: Make this have logic.
   * Takes in an exercise and student response to update log and mastery model.
   * @param exercise
   * @param answer
   */
  static evaluateAnswer(exercise: Exercise, answer: string) {

    // TODO: Check answer for correctness.
    let isCorrect = true;
    ResponseLog.addResponse(
      '123', exercise.concept, exercise.type, exercise.difficulty, isCorrect, Date.now()
    );
    console.log(ResponseLog.log); //Debug/demo

    MasteryModel.updateModel(
      exercise.concept, ResponseEvaluator.analyzeLog(exercise.concept)
    );
    console.log(MasteryModel.model); //Debug/demo
  }
}

export default ResponseEvaluator;