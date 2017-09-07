//@flow

// type Mini = string;
// type Full = string;
// type Abb = {[key: Mini]: Full};
//
// const _c:Abb = {
//   F_LOOP: 'for loops',
//   _B_OP: 'boolean operators',
//   E_OP: 'equality operators',
//   R_OP: 'relational operators',
//   C_OP: 'conditional operators',
//   _A_OP: 'assignment operators',
//   _VAR: 'variables',
//   REF: 'reference types',
//   PRIM: 'primitive types',
//   A_OP: 'assignment operator',
//   AA_OP: 'arithmetic-assignment operators',
//   ARITH: 'arithmetic',
// };

export const sep = { left_paren: "(", right_paren: ")", left_curl: "{", right_curl: "}",
  left_sqr: "[", right_sqr: "]", semicolon: ";", comma: ",", dot: ".",
  triple_dot: "...", at: "@", double_colon: "::"};

export const op = { assign: "=", greater: ">", lesser: "<", not: "!", equality: "==",
  greater_equality: ">=", lesser_equality: ">=", not_equal: "!=", and: "&&",
  or: "||", incr: "++", decr: "--", add: "+", sub: "-", mult: "*", div: "/",
  add_assign: "+=", sub_assign: "-=", mult_assign: "*=", div_assign: "/="};

export const quote = { single: "'", double: "\"" };

export const keyword = { new: "new", true: "true", false: "false", if: "if", else: "else",
  for: "for", do: "do", while: "while", continue: "continue", return: "return",
  null: "null", this: "this", super: "super"};

//All grammar labels
export const g = {identifier: "identifier", expression: "expression", classInstanceExpression: "classInstanceExpression",
  methodInvocationExpression: "methodInvocationExpression", arrayCreationExpression: "arrayCreationExpression",
  statement: "statement", ifThenStatement: "ifThenStatement", ifThenElseStatement: "ifThenElseStatement",
  forStatement: "forStatement", doStatement: "doStatement", whileStatement: "whileStatement",
  breakStatement: "breakStatement", continueStatement: "continueStatement",
  returnStatement: "returnStatement", primitiveType: "primitiveType", short: "short",
  int: "int", long: "long", char: "char", float: "float", boolean: "boolean",
  literal: "literal", integerLiteral: "integerLiteral", floatingPointLiteral: "floatingPointLiteral",
  booleanLiteral: "booleanLiteral", characterLiteral: "characterLiteral", stringLiteral: "stringLiteral",
  nullLiteral: "nullLiteral", variableDeclaration: "variableDeclaration", statementExpression: "statementExpression",
  assignmentExpression: "assignmentExpression", postIncrementExpression: "postIncrementExpression",
  postDecrementExpression: "postDecrementExpression", arrayAccessExpression: "arrayAccessExpression",
  multiplicativeExpression: "multiplicativeExpression", additiveExpression: "additiveExpression",
  equalityExpression: "equalityExpression", conditionalAndExpression: "conditionalAndExpression",
  conditionalOrExpression: "conditionalOrExpression", relationalExpression: "relationalExpression",
  leftHandSide: "leftHandSide", assignmentOperator: "assignmentOperator", string: "string",
  referenceType: "referenceType", fieldAccess: "fieldAccess", relationalOperator: "relationalOperator"};

export default g;
