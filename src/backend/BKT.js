//@flow

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
    this.T = 0.2;
    this.G = 0.066; //Constant from Baker et al.
    this.S = 0.402; //Constant from Baker et al.
  }

  /**
   * Take in previous K value and correct/incorrect answer to update K value.
   * @param previous
   * @param correct
   * @returns {number}
   */
  learned(previous: number, correct: boolean) {
    let S = correct ? 1 - this.S : this.S;
    let G = correct ? this.G : 1 - this.G;
    let previously = (previous * S) / ((previous * S) + ((1 - previous) * G));
    return previously + (1 - previously) * this.T;
  }
}

export default BKT;
