//@flow

type Mini = string;
type Full = string;
type Abb = {[key: Mini]: Full};

const _c:Abb = {
  F_LOOP: 'for loops',
  _B_OP: 'boolean operators',
  E_OP: 'equality operators',
  R_OP: 'relational operators',
  C_OP: 'conditional operators',
  _A_OP: 'assignment operators',
  _VAR: 'variables',
  REF: 'reference types',
  PRIM: 'primitive types',
  A_OP: 'assignment operator',
  AA_OP: 'arithmetic-assignment operators',
  ARITH: 'arithmetic',
};

export default _c;