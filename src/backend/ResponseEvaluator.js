//@flow
/**
 * Created by alextan on 7/24/17.
 */

import ModelUpdater from './ModelUpdater';
import LogUpdater from './LogUpdater';

class ResponseEvaluator {
  modelUpdater: ModelUpdater;
  logUpdater: LogUpdater;

  constructor() {
    this.modelUpdater = new ModelUpdater();
    this.logUpdater = new LogUpdater();
  }

  evaluateAnswer(answer: string) {

  }
}

export default ResponseEvaluator;