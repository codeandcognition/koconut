/**
 * Defines all learning concepts. Currently sorted alphabetically.
 * @class
 */

const F_LOOP = 'for loops';
const _B_OP = 'boolean operators';
const E_OP = 'equality operators';
const R_OP = 'relational operators';
const C_OP = 'conditional operators';
const _A_OP = 'assignment operators';
const _VAR = 'variables';
const REF = 'reference types';
const PRIM = 'primitive types';
const A_OP = 'assignment operator';
const AA_OP = 'arithmetic-assignment operators';
const ARITH = 'arithmetic';

const conceptTypes = {lang: 'langSemantics', des: 'designPatterns'}

const conceptInventory = [
  {
    name: F_LOOP,
    type: conceptTypes.lang,
    dependencies: [_B_OP, E_OP],
    parents: []
  },
  {
    name: _B_OP,
    type: conceptTypes.lang,
    dependencies: [E_OP, R_OP, C_OP],
    parents: [F_LOOP]
  },
  {
    name: E_OP,
    type: conceptTypes.lang,
    dependencies: [],
    parents: [_B_OP]
  },
  {
    name: R_OP,
    type: conceptTypes.lang,
    dependencies: [],
    parents: [_B_OP]
  },
  {
    name: C_OP,
    type: conceptTypes.lang,
    dependencies: [],
    parents: [_B_OP]
  },
  {
    name: _A_OP,
    type: conceptTypes.lang,
    dependencies: [VAR, A_OP, AA_OP],
    parents: [F_LOOP]
  },
  {
    name: VAR,
    type: conceptTypes.lang,
    dependencies: [REF, PRIM],
    parents: [_A_OP]
  },
  {
    name: REF,
    type: conceptTypes.lang,
    dependencies: [],
    parents: [VAR]
  },
  {
    name: PRIM,
    type: conceptTypes.lang,
    dependencies: [],
    parents: [VAR]
  },
  {
    name: A_OP,
    type: conceptTypes.lang,
    dependencies: [],
    parents: [_A_OP]
  },
  {
    name: AA_OP,
    type: conceptTypes.lang,
    dependencies: [ARITH],
    parents: [_A_OP]
  },
  {
    name: ARITH,
    type: conceptTypes.lang,
    dependencies: [],
    parents: [AA_OP]
  }
];

export default conceptInventory;