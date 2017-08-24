//@flow
import {ResponseLog, ResponseObject} from '../data/ResponseLog';
import ExerciseTypes from '../data/ExerciseTypes';

/**
 * Factors out values for contextualized G and S
 * from Baker et al.
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
 * @param num
 * @param i
 * @returns {boolean} true if response is string
 */
function responseIsString(response: ResponseObject) {
  return response.exerciseType === ExerciseTypes.writeCode ||
      response.exerciseType === ExerciseTypes.fillBlank ||
      response.exerciseType === ExerciseTypes.shortResponse;
}

/**
 * Determines the percentage of past responses of the same concept that were
 * errors.
 * @param response
 * @param num
 * @param i
 * @returns {number} percentage
 */
function percentPastErrors(response: ResponseObject) {
  let responsesOfConcept = ResponseLog.log.filter(
      (res) => res.concept === response.concept);
  let incorrectResponses = responsesOfConcept.filter((res) => res.correct === false);
  return incorrectResponses.length / responsesOfConcept.length;
}

/**
 * Determines the percentage of past responses of the same concept that were
 * errors.
 * @param response
 * @param num
 * @param i
 * @returns {number} percentage
 */
function numberOfLastFiveWrong(response: ResponseObject) {
  return 0;
}

function helpRequest(response: ResponseObject) {
  return 0;
}
function percentHelpRequested(response: ResponseObject) {
  return 0;
}
function numberOfLast8HelpRequested(response: ResponseObject) {
  return 0;
}
function timeTaken(response: ResponseObject) {
  return 0;
}
function timeTakenSD(response: ResponseObject) {
  return 0;
}
function timeTakenInLast5Actions(response: ResponseObject) {
  return 0;
}
function timeTakenOnThisConcept(response: ResponseObject) {
  return 0;
}
function numberOfTimesUsingConcept(response: ResponseObject) {
  return 0;
}

//Index for g in features
const g = "g";
//Index for s in features
const s = "s";

export {ResponseFeatures, g, s};