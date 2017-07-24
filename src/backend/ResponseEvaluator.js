//@flow
/**
 * Created by alextan on 7/24/17.
 */

import ResponseLog from '../data/ResponseLog';
import MasteryModel from '../data/MasteryModel';

type Exercise = {
  prompt: string,
  code: string,
  choices?: string[],
  difficulty: number,
  type: string,
  concept: string
  // exerciseID: string
}

class ResponseEvaluator {
  static evaluateAnswer(exercise: Exercise, answer: string) {
    let isCorrect = true;
    ResponseLog.addResponse(
      '123', exercise.concept, exercise.type, exercise.difficulty, isCorrect, Date.now()
    );
    console.log(ResponseLog.log);
    MasteryModel.updateModel(
      exercise.concept, true
    );
    console.log(MasteryModel.model);
  }
}

export default ResponseEvaluator;