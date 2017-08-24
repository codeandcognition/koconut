//@flow
import {ResponseFeatures, g, s} from './ResponseFeaturesTable';
import {ResponseLog, ResponseObject} from '../data/ResponseLog';
import ExerciseTypes from '../data/ExerciseTypes';

/**
 * Class for Bayesian Knowledge Tracing functionality.
 */
class BKT {
  T: number;
  G: number;
  S: number;
  Attributes: Function[];

  /**
   * Construct initial values of BKT model.
   */
  constructor() {
    //Arbitrary T value
    this.T = 0.2;
    //Constants from Baker et al.
    this.G = 0.066;
    this.S = 0.402;
    this.Attributes = [];
    this.Attributes.push(this.responseIsString, this.percentPastErrors,
        this.helpRequest, this.percentHelpRequested, this.numberOfLast8HelpRequested,
        this.timeTaken, this.timeTakenSD, this.timeTakenInLast5Actions,
        this.timeTakenOnThisConcept, this.numberOfTimesUsingConcept);
  }

  /**
   * Take in previous K value and correct/incorrect answer to update K value.
   * @param previous
   * @param correct
   * @returns {number}
   */
  learned(previous: number, correct: boolean) {
    //Use G/S contextual parameter fitting
    let G = this.contextualizeGuess(this.G);
    let S = this.contextualizeSlip(this.S);
    //Probabilistic inverses
    G = correct ? G : 1 - G;
    S = correct ? 1 - S : S;
    let previously = (previous * S) / ((previous * S) + ((1 - previous) * G));
    return previously + (1 - previously) * this.T;
  }

  /* TODO: implement table of G and S fitting from Baker paper */

  contextualizeGuess(G: number) {
    let retG = G;
    let lastElement = ResponseLog.getLastElement();
    this.Attributes.forEach((func) => retG = func(lastElement, retG, g));
    return retG;
  }

  /**
   *
   */
  contextualizeSlip(S: number) {
    let retS = S;
    let lastElement = ResponseLog.getLastElement();
    this.Attributes.forEach((func) => retS = func(lastElement, retS, s));
    return retS;
  }

  notNullOrUndefined(input: ResponseObject) {
    return input !== null && input !== undefined;
  }

  /**
   * Determines whether the response object was a String response
   * (WriteCode, FillBlank, or ShortResponse).
   * @param response
   * @param num
   * @param i
   * @returns Modified G or S value.
   */
  responseIsString(response: ResponseObject, num: number, i: number) {
    if(this.notNullOrUndefined(response)) {
      let isString = response.exerciseType === ExerciseTypes.writeCode ||
                      response.exerciseType === ExerciseTypes.fillBlank ||
                      response.exerciseType === ExerciseTypes.shortResponse;
      if(isString) {
        num  += ResponseFeatures.responseIsString[i];
        console.log('Response is string!' + num); //TODO: Remove console.log after verification
      }
    }
    return num;
  }

  /**
   * Determines the percentage of past responses of the same concept that were
   * errors.
   * @param response
   * @param num
   * @param i
   * @returns Modified G or S value.
   */
  percentPastErrors(response: ResponseObject, num: number, i: number) {
    if(this.notNullOrUndefined(response)) {
      let responsesOfConcept = ResponseLog.log.filter(
          (res) => res.concept === response.concept);
      let incorrectResponses = responsesOfConcept.filter((res) => res.correct === false);
      let percentage = incorrectResponses.length / responsesOfConcept.length;
      num += ResponseFeatures.percentPastErrors[i] * percentage;
      console.log('Percent past errors: ' + percentage + '%'); //TODO: Remove console.log after verification
    }
    return num;
  }

  helpRequest(response: ResponseObject, num: number, i: number) {
    let l
    return num;
  }
  percentHelpRequested(response: ResponseObject, num: number, i: number) {
    return num;
  }
  numberOfLast8HelpRequested(response: ResponseObject, num: number, i: number) {
    return num;
  }
  timeTaken(response: ResponseObject, num: number, i: number) {
    return num;
  }
  timeTakenSD(response: ResponseObject, num: number, i: number) {
    return num;
  }
  timeTakenInLast5Actions(response: ResponseObject, num: number, i: number) {
    return num;
  }
  timeTakenOnThisConcept(response: ResponseObject, num: number, i: number) {
    return num;
  }

  /**
   * Number of opportunities student has already had to use current skill
   */
  numberOfTimesUsingConcept(response: ResponseObject, num: number, i: number) {
    return num;
  }
}

export const BayesKT = new BKT();
export default BKT;