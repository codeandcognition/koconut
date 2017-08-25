//@flow
import {ResponseFeatures, g, s} from './ResponseFeaturesTable';
import {ResponseObject} from '../data/ResponseLog';

/**
 * Class for Bayesian Knowledge Tracing functionality.
 */
class BKT {
  T: number;
  G: number;
  S: number;

  /**
   * Construct initial values of BKT model.
   */
  constructor() {
    //Arbitrary T value
    this.T = 0.4;
    //Constants from Baker et al.
    this.G = 0.066;
    this.S = 0.402;
  }

  /**
   * Take in previous K value and correct/incorrect answer to update K value.
   * @param previous
   * @param correct
   * @returns {number}
   */
  learned(previous: number, response: ResponseObject) {
    //Use G/S contextual parameter fitting
    let G = this.contextualize(response, this.G, g);
    let S = this.contextualize(response, this.S, s);
    //Probabilistic inverses
    let correct = response.correct;
    G = correct ? G : 1 - G;
    S = correct ? 1 - S : S;
    let previously = (previous * S) / ((previous * S) + ((1 - previous) * G));
    return previously + (1 - previously) * this.T;
  }

  /* TODO: implement table of G and S fitting from Baker paper */

  /**
   * Updates the G and S parameters contextually
   * @param response
   * @param constant
   * @param param
   * @returns {number}
   */
  contextualize(response: ResponseObject, constant: number, param: string) {
    let ret = constant;
    console.groupCollapsed('BKT ' + ' Param: ' + param + ' Initial: ' + constant);
    if(this.notNullOrUndefined(response)) {
      let features = Object.keys(ResponseFeatures);

      features.forEach((feature) => {
        let factor = ResponseFeatures[feature].analyze(response);
        let change = ResponseFeatures[feature][param] * factor;
        ret += change;
        console.log('Feature: ' + feature + ' Param: ' + param + ' \n' + change);
      });
    }
    console.log('Final: ' + ret);
    console.groupEnd();
    return this.boundedProbability(ret);
  }

  /**
   * Ensures that value is not probabilistically degenerate
   * @param num
   * @returns {number}
   */
  boundedProbability(num: number) {
    num = num <= 0 ? 0.001 : num;
    num = num >= 1 ? 0.999 : num;
    return num;
  }

  /**
   * Returns true if neither null nor undefined
   * @param input
   * @returns {boolean}
   */
  notNullOrUndefined(input: any) {
  return !(input === null || input === undefined);
}

}

export const BayesKT = new BKT();
export default BKT;