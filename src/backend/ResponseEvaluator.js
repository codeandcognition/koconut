//@flow
/**
 * Created by alextan on 7/24/17.
 */

import ModelUpdater from './ModelUpdater';
import ResponseLog from '../data/ResponseLog';

type Exercise = {
  prompt: string,
  code: string,
  choices?: string[],
  difficulty: number,
  type: string,
  // exerciseID: string
}

class ResponseEvaluator {
  modelUpdater: ModelUpdater;
  responseLog: ResponseLog;

  constructor() {
    this.modelUpdater = new ModelUpdater();
    this.responseLog= new ResponseLog();
  }

  evaluateAnswer(exercise: Exercise, answer: string) {

  }
}

export default ResponseEvaluator;