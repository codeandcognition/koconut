//@flow
/**
 * Created by alextan on 7/24/17.
 */

import ModelUpdater from './ModelUpdater';

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

  constructor() {
    this.modelUpdater = new ModelUpdater();
  }

  evaluateAnswer(exercise: Exercise, answer: string) {
    // ResponseLog.addResponse...

  }
}

export default ResponseEvaluator;