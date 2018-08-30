//@flow
import {ResponseLog, ResponseObject} from '../data/ResponseLog';
import ExerciseTypes from '../data/ExerciseTypes';
// import _ from 'lodash';
import intersection from 'lodash/intersection';
// A note from Harrison:
//  I tried to make this file better by putting things in a class, but that ended
//  up breaking things. So, I tried to fix that using binds, and it worked, but
//  now this class has been cursed by JavaScript black magic. You're going to need
//  to add binds for things to work in the future.
//  🔥🌑🔥
// A note from William:
//  Don't worry kiddos, .bind(this) is pretty common nowadays in the future and 
//  is a very important thing to learn how to do with JavaScript ES6 syntax. A way
//  to probably avoid .bind(this) is to probably make the functions in the format 
//  of `const xxx = () => {}` instead of `static xxx() {}`. Arrow function syntax
//  applies the .bind(this) functionality automatically. 
//  I won't be changing this code, but I'm fairly sure we can change that if we don't
//  want to use .bind(this) anymore.

/**
 * Defines response features used for Bayesian Knowledge Tracing.
 * @class
 */
class ResponseFeaturesTable {
  /**
   * Values for contextualized G and S from Baker et al.
   * Adjust these values as needed. If we define additional features, add to this
   * object and append the necessary function below.
   */
  static ResponseFeatures() {return {
    responseIsString:             {g: 0.049,  s: -0.02,   analyze: this.responseIsString.bind(this)},
    numberOfLastFiveWrong:        {g: 0.036,  s: -0.033,  analyze: this.numberOfLastFiveWrong.bind(this)},
    percentPastErrors:            {g: 0,      s: -0.004,  analyze: this.percentPastErrors.bind(this)},
    helpRequest:                  {g: 0,      s: 0.066,   analyze: this.helpRequest.bind(this)},
    percentHelpRequested:         {g: 0,      s: -0.047,  analyze: this.percentHelpRequested.bind(this)},
    numberOfLast8HelpRequested:   {g: 0.042,  s: -0.019,  analyze: this.numberOfLast8HelpRequested.bind(this)},
    timeTaken:                    {g: 0.002,  s: -0.0002, analyze: this.timeTaken.bind(this)},
    timeTakenSD:                  {g: -0.024, s: 0.01,    analyze: this.timeTakenSD.bind(this)},
    timeTakenInLast5Actions:      {g: -0.003, s: 0.002,   analyze: this.timeTakenInLast5Actions.bind(this)},
    timeTakenOnThisConcept:       {g: 0.001,  s: -0.001,  analyze: this.timeTakenOnThisConcept.bind(this)},
    numberOfTimesUsingConcept:    {g: 0.003,  s: -0.001,  analyze: this.numberOfTimesUsingConcept.bind(this)}
  }};

  /**
   * Determines whether the response object was a String response
   * (WriteCode, FillBlank, or ShortResponse).
   * @param response
   * @returns {boolean} true if response is string
   */
  static responseIsString(response: ResponseObject) {
    let isString = response.exerciseType === ExerciseTypes.writeCode ||
        response.exerciseType === ExerciseTypes.fillBlank ||
        response.exerciseType === ExerciseTypes.shortResponse;
    return isString ? 1 : 0;
  }

  /**
   * Determines the percentage of past responses of the same concept that were
   * errors.
   * @param response
   * @returns {number} percentage
   */
  static percentPastErrors(response: ResponseObject) {
    let len = ResponseLog.log.length;
    if (len > 0) {
      let responsesOfConcept = ResponseLog.log.filter(
          (res) => intersection(res.concepts, response.concepts).length > 0);
      let incorrectResponses = responsesOfConcept.filter(
          (res) => res.correct === false);
      return incorrectResponses.length / responsesOfConcept.length;
    }
    return 0;
  }

  /**
   * Determines the percentage of past responses of the same concept that were
   * errors.
   * @param response
   * @returns {number} percentage
   */
  static numberOfLastFiveWrong(response: ResponseObject) {
    let len = ResponseLog.log.length;
    if (len > 4) {
      let lastFiveResponses = ResponseLog.log.slice(len - 5, len);
      return lastFiveResponses.filter((res) => res.correct === false).length;
    }
    return 0;
  }

  /**
   * Stub, no help request feature built in yet.
   * @param response
   * @returns {number}
   */
  static helpRequest(response: ResponseObject) {
    return 0;
  }

  /**
   * Stub, no help request feature built in yet.
   * @param response
   * @returns {number}
   */
  static percentHelpRequested(response: ResponseObject) {
    return 0;
  }

  /**
   * Stub, no help request feature built in yet.
   * @param response
   * @returns {number}
   */
  static numberOfLast8HelpRequested(response: ResponseObject) {
    return 0;
  }

  /**
   * Returns number of minutes spent on most recent exercise.
   * @param response
   * @returns {number}
   */
  static timeTaken(response: ResponseObject) {
    let len = ResponseLog.log.length;
    if (len > 1) {
      let now = ResponseLog.getLastElement();
      let pre = ResponseLog.log[len - 2];
      return this.convertMilliToMin(now.timestamp - pre.timestamp);
    }
    return 0;
  }

  /**
   * Stub, no collective student data yet.
   * @param response
   * @returns {number}
   */
  static timeTakenSD(response: ResponseObject) {
    return 0;
  }

  /**
   * Returns number of minutes spent on last 5 exercises.
   * @param response
   * @returns {number}
   */
  static timeTakenInLast5Actions(response: ResponseObject) {
    let len = ResponseLog.log.length;
    if (len > 5) {
      let now = ResponseLog.getLastElement();
      let pre = ResponseLog.log[len - 6];
      return this.convertMilliToMin(now.timestamp - pre.timestamp);
    }
    return 0;
  }

  /**
   * Returns total number of minutes spent on this concept.
   * @param response
   * @returns {number}
   */
  static timeTakenOnThisConcept(response: ResponseObject) {
    let len = ResponseLog.log.length;
    if (len > 1) {
      let relevant = ResponseLog.log.filter(
          (res) => intersection(res.concepts, response.concepts).length > 0);
      // Running sum to compute total time taken on this concept
      return relevant.reduce((sum, res) => {
        let pos = ResponseLog.log.indexOf(res);
        if(pos === 0) {
          return 0;
        }
        let pre = ResponseLog.log[pos - 1];
        let time = this.convertMilliToMin(res.timestamp - pre.timestamp);
        return sum + time;
      }, 0);
    }
    return 0;
  }

  /**
   * Returns number of times using this concept.
   * @param response
   * @returns {number}
   */
  static numberOfTimesUsingConcept(response: ResponseObject) {
    return ResponseLog.log.filter(
        (res) => intersection(res.concepts, response.concepts).length > 0).length;
  }

  /**
   * Helper function to convert milliseconds to minutes
   * @param time
   * @returns {number}
   */
  static convertMilliToMin(time: number) {
    return time / 1000 / 60;
  }
}

//Index for g in features
const g = "g";
//Index for s in features
const s = "s";
// This is a long-winded way of setting ResponseFeatures to an object
const ResponseFeatures = ResponseFeaturesTable.ResponseFeatures.bind(ResponseFeaturesTable)();

export {ResponseFeatures, g, s};
