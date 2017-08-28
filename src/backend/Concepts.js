import _c from './ConceptAbbreviations';

/*
 * Defines all learning concepts. Currently sorted alphabetically.
 */
const conceptTypes = {lang: 'langSemantics', des: 'designPatterns'};

const conceptInventory = [
  {
    name: _c.F_LOOP,
    type: conceptTypes.lang,
    dependencies: [_c._B_OP, _c.E_OP],
    parents: []
  },
  {
    name: _c._B_OP,
    type: conceptTypes.lang,
    dependencies: [_c.E_OP, _c.R_OP, _c.C_OP],
    parents: [_c.F_LOOP]
  },
  {
    name: _c.E_OP,
    type: conceptTypes.lang,
    dependencies: [],
    parents: [_c._B_OP]
  },
  {
    name: _c.R_OP,
    type: conceptTypes.lang,
    dependencies: [],
    parents: [_c._B_OP]
  },
  {
    name: _c.C_OP,
    type: conceptTypes.lang,
    dependencies: [],
    parents: [_c._B_OP]
  },
  {
    name: _c._A_OP,
    type: conceptTypes.lang,
    dependencies: [_c._VAR, _c.A_OP, _c.AA_OP],
    parents: [_c.F_LOOP]
  },
  {
    name: _c._VAR,
    type: conceptTypes.lang,
    dependencies: [_c.REF, _c.PRIM],
    parents: [_c._A_OP]
  },
  {
    name: _c.REF,
    type: conceptTypes.lang,
    dependencies: [],
    parents: [_c._VAR]
  },
  {
    name: _c.PRIM,
    type: conceptTypes.lang,
    dependencies: [],
    parents: [_c._VAR]
  },
  {
    name: _c.A_OP,
    type: conceptTypes.lang,
    dependencies: [],
    parents: [_c._A_OP]
  },
  {
    name: _c.AA_OP,
    type: conceptTypes.lang,
    dependencies: [_c.ARITH],
    parents: [_c._A_OP]
  },
  {
    name: _c.ARITH,
    type: conceptTypes.lang,
    dependencies: [],
    parents: [_c.AA_OP]
  }
];

export default conceptInventory;