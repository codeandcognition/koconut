//@flow
import {ResponseLog, ResponseObject} from '../data/ResponseLog';
import ExerciseTypes from '../data/ExerciseTypes';

/**
 * Values for contextualized G and S from Baker et al.
 * Adjust these values as needed. If we define additional features, add to this
 * object and append the necessary function below.
 */
const ResponseFeatures = {
  responseIsString:             {g: 0.049,  s: -0.02,   analyze: responseIsString},
  numberOfLastFiveWrong:        {g: 0.036,  s: -0.033,  analyze: numberOfLastFiveWrong},
  percentPastErrors:            {g: 0,      s: -0.004,  analyze: percentPastErrors},
  helpRequest:                  {g: 0,      s: 0.066,   analyze: helpRequest},
  percentHelpRequested:         {g: 0,      s: -0.047,  analyze: percentHelpRequested},
  numberOfLast8HelpRequested:   {g: 0.042,  s: -0.019,  analyze: numberOfLast8HelpRequested},
  timeTaken:                    {g: 0.002,  s: -0.0002, analyze: timeTaken},
  timeTakenSD:                  {g: -0.024, s: 0.01,    analyze: timeTakenSD},
  timeTakenInLast5Actions:      {g: -0.003, s: 0.002,   analyze: timeTakenInLast5Actions},
  timeTakenOnThisConcept:       {g: 0.001,  s: -0.001,  analyze: timeTakenOnThisConcept},
  numberOfTimesUsingConcept:    {g: 0.003,  s:-0.001,   analyze: numberOfTimesUsingConcept}
};

/**
 * Determines whether the response object was a String response
 * (WriteCode, FillBlank, or ShortResponse).
 * @param response
 * @returns {boolean} true if response is string
 */
function responseIsString(response: ResponseObject) {
  let isString =  response.exerciseType === ExerciseTypes.writeCode ||
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
function percentPastErrors(response: ResponseObject) {
  let len = ResponseLog.log.length;
  if(len > 0) {
    let responsesOfConcept = ResponseLog.log.filter(
        (res) => res.concept === response.concept);
    let incorrectResponses = responsesOfConcept.filter((res) => res.correct === false);
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
function numberOfLastFiveWrong(response: ResponseObject) {
  let len = ResponseLog.log.length;
  if(len > 4) {
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
function helpRequest(response: ResponseObject) {
  return 0;
}

/**
 * Stub, no help request feature built in yet.
 * @param response
 * @returns {number}
 */
function percentHelpRequested(response: ResponseObject) {
  return 0;
}

/**
 * Stub, no help request feature built in yet.
 * @param response
 * @returns {number}
 */
function numberOfLast8HelpRequested(response: ResponseObject) {
  return 0;
}

/**
 * Returns number of minutes spent on most recent exercise.
 * @param response
 * @returns {number}
 */
function timeTaken(response: ResponseObject) {
  let len = ResponseLog.log.length;
  if(len > 1) {
    let now = ResponseLog.getLastElement();
    let pre = ResponseLog.log[len - 2];
    return convertMilliToMin(now.timestamp - pre.timestamp);
  }
  return 0;
}

/**
 * Stub, no collective student data yet.
 * @param response
 * @returns {number}
 */
function timeTakenSD(response: ResponseObject) {
  return 0;
}

/**
 * Returns number of minutes spent on last 5 exercises.
 * @param response
 * @returns {number}
 */
function timeTakenInLast5Actions(response: ResponseObject) {
  let len = ResponseLog.log.length;
  if(len > 5) {
    let now = ResponseLog.getLastElement();
    let pre = ResponseLog.log[len - 6];
    return convertMilliToMin(now.timestamp - pre.timestamp);
  }
  return 0;
}

/**
 * Returns total number of minutes spent on this concept.
 * @param response
 * @returns {number}
 */
function timeTakenOnThisConcept(response: ResponseObject) {
  let len = ResponseLog.log.length;
  if(len > 1) {
    let relevant = ResponseLog.log.filter((res) => res.concept === response.concept);
    // Running sum to compute total time taken on this concept
    return relevant.reduce((sum, res) => {
      let pos = ResponseLog.log.indexOf(res);
      let pre = ResponseLog.log[pos - 1];
      let time = convertMilliToMin(res.timestamp - pre.timestamp);
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
function numberOfTimesUsingConcept(response: ResponseObject) {
  return ResponseLog.log.filter((res) => res.concept === response.concept).length;
}

/**
 * Helper function to convert milliseconds to minutes
 * @param time
 * @returns {number}
 */
function convertMilliToMin(time: number) {
  return time/1000/60;
}

//Index for g in features
const g = "g";
//Index for s in features
const s = "s";

export {ResponseFeatures, g, s};