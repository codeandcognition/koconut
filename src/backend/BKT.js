//@flow

class BKT {
  L: number;
  T: number;
  G: number;
  S: number;

  constructor() {
    this.L = 0.34; //Corbett
    this.T = 0.2; //Corbett
    this.G = 0.066; //Constant from Baker et al.
    this.S = 0.402; //Constant from Baker et al.
  }

  learned(previous: number, correct: boolean) {
    let S = correct ? 1 - this.S : this.S;
    let G = correct ? this.G : 1 - this.G;
    let previously = (previous * S) / ((previous * S) + ((1 - previous) * G));
    return previously + (1 - previously) * this.T;
  }

  printValues() {
    console.log('L: ' + this.L + '\nT: ' + this.T + '\nG: ' + this.G + '\nS: ' + this.S);
  }
}

export default BKT;
