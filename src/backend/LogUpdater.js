//@flow
/**
 * Created by alextan on 7/24/17.
 */
import ResponseLog from '../data/ResponseLog';

class LogUpdater {
  responseLog: ResponseLog;

  constructor() {
    this.responseLog = new ResponseLog();
  }
}

export default LogUpdater;