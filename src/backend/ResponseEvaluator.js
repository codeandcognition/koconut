//@flow
/**
 * Created by alextan on 7/24/17.
 */

import ModelUpdater from './ModelUpdater';
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
  modelUpdater: ModelUpdater;

  constructor() {
    this.modelUpdater = new ModelUpdater();
  }

  evaluateAnswer(exercise: Exercise, answer: string) {
<<<<<<< HEAD
    let isCorrect = true; //stub for evaluating answer
    ResponseLog.addResponse(
      '123', exercise.concept, exercise.type, exercise.difficulty, isCorrect, 123
    );
=======
    // ResponseLog.addResponse('123', 'loops', exercise.type, exercise.difficulty, true, Date.now());
    // MasteryModel.model;
>>>>>>> 42f3c485914ab4d339c212788eeefe53dc26a6c4
  }
}

export default ResponseEvaluator;