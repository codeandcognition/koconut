//@flow

import ResponseLog from '../data/ResponseLog';
import MasteryModel from '../data/MasteryModel';
import type {Exercise} from '../data/Exercises';

class ResponseEvaluator {

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
      exercise.concept, true
    );
    console.log(MasteryModel.model); //Debug/demo
  }
}

export default ResponseEvaluator;