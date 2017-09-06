/*
Currently standalone file. Must confirm the mapping before using
 */

const sep = { left_paren: "(", right_paren: ")", left_curl: "{", right_curl: "}",
  left_sqr: "[", right_sqr: "]", semicolon: ";", comma: ",", dot: ".",
  triple_dot: "...", at: "@", double_colon: "::"
};

const op = { assign: "=", greater: ">", lesser: "<", not: "!", equality: "==",
  greater_equality: ">=", lesser_equality: ">=", not_equal: "!=", and: "&&",
  or: "||", incr: "++", decr: "--", add: "+", sub: "-", mult: "*", div: "/",
  add_assign: "+=", sub_assign: "-=", mult_assign: "*=", div_assign: "/="
};

const quote = { single: "'", double: "\"" };

const keyword = { new: "new", true: "true", false: "false", if: "if", else: "else",
  for: "for", do: "do", while: "while", continue: "continue", return: "return",
  null: "null",
};

const identifier = "identifier", classType = "classType", expression = "expression",
    classInstanceExpression = "classInstanceExpression", methodInvocationExpression = "methodInvocationExpression",
    arrayCreationExpression = "arrayCreationExpression", statement = "statement",
    ifThenStatement = "ifThenStatement", ifThenElseStatement = "ifThenElseStatement",
    forStatement = "forStatement", doStatement = "doStatement", whileStatement = "whileStatement",
    breakStatement = "breakStatement", continueStatement = "continueStatement",
    returnStatement = "returnStatement", primitiveType = "primitiveType", short = "short",
    int = "int", long = "long", char = "char", float = "float", boolean = "boolean",
    literal = "literal", integerLiteral = "integerLiteral", floatingPointLiteral = "floatingPointLiteral",
    booleanLiteral = "booleanLiteral", characterLiteral = "characterLiteral", stringLiteral = "stringLiteral",
    nullLiteral = "nullLiteral", variableDeclaration = "variableDeclaration", statementExpression = "statementExpression",
    assignmentExpression = "assignmentExpression", postIncrementExpression = "postIncrementExpression",
    postDecrementExpression = "postDecrementExpression", arrayAccessExpression = "arrayAccessExpression",
    multiplicativeExpression = "multiplicativeExpression", additiveExpression = "additiveExpression",
    equalityExpression = "equalityExpression", conditionalAndExpression = "conditionalAndExpression",
    conditionalOrExpression = "conditionalOrExpression", relationalExpression = "relationalExpression",
    leftHandSide = "leftHandSide", assignmentOperator = "assignmentOperator", string = "string",
    referenceType = "referenceType";
/*
 { name: ,
   dependencies: [],
   parents: [],
   should_teach: true
 },
*/
const conceptInventory = [
  {	name: literal,
    dependencies: [integerLiteral, floatingPointLiteral, booleanLiteral, characterLiteral, stringLiteral, nullLiteral],
    parents: [],
    should_teach: true
  },
  { name: integerLiteral,
    dependencies: [],
    parents: [literal],
    should_teach: true
  },
  { name: floatingPointLiteral,
    dependencies: [sep.dot],
    parents: [literal],
    should_teach: true
  },
  { name: booleanLiteral,
    dependencies: [keyword.true, keyword.false],
    parents: [literal],
    should_teach: true
  },
  {	name: keyword.true,
    dependencies: [],
    parents: [booleanLiteral],
    should_teach: true
  },
  { name: keyword.false,
    dependencies: [],
    parents: [booleanLiteral],
    should_teach: true
  },
  { name: characterLiteral,
    dependencies: [quote.single],
    parents: [literal],
    should_teach: true
  },
  { name: stringLiteral,
    dependencies: [quote.double],
    parents: [literal],
    should_teach: true
  },
  { name: nullLiteral,
    dependencies: [],
    parents: [literal],
    should_teach: true
  },
  { name: keyword.null,
    dependencies: [],
    parents: [nullLiteral],
    should_teach: true
  },
  { name: primitiveType,
    dependencies: [short, int, long, char, float, boolean],
    parents: [],
    should_teach: true
  },
  { name: short,
    dependencies: [integerLiteral],
    parents: [primitiveType],
    should_teach: true
  },
  { name: int,
    dependencies: [integerLiteral],
    parents: [primitiveType],
    should_teach: true
  },
  { name: long,
    dependencies: [integerLiteral],
    parents: [primitiveType],
    should_teach: true
  },
  { name: char,
    dependencies: [characterLiteral],
    parents: [primitiveType],
    should_teach: true
  },
  { name: float,
    dependencies: [floatingPointLiteral],
    parents: [primitiveType],
    should_teach: true
  },
  { name: boolean,
    dependencies: [booleanLiteral],
    parents: [primitiveType],
    should_teach: true
  },
  { name: referenceType,
    dependencies: [string],
    parents: [],
    should_teach: true
  },
  { name: string,
    dependencies: [],
    parents: [referenceType],
    should_teach: true
  },
  { name: identifier,
    dependencies: [],
    parents: [classType, methodInvocationExpression, postIncrementExpression, postDecrementExpression, arrayAccessExpression, leftHandSide],
    should_teach: true
  },
  { name: classType,
    dependencies: [identifier],
    parents: [classInstanceExpression, arrayCreationExpression],
    should_teach: true
  },
  {	name: keyword.new,
    dependencies: [],
    parents: [classInstanceExpression, arrayCreationExpression],
    should_teach: true
  },
  { name: expression,
    dependencies: [assignmentExpression, postIncrementExpression, postDecrementExpression, classInstanceExpression, methodInvocationExpression, arrayCreationExpression, arrayAccessExpression],
    parents: [],
    should_teach: true
  },
  { name: arrayAccessExpression,
    dependencies: [identifier, sep.left_sqr, sep.right_sqr, ],
    parents: [expression],
    should_teach: true
  },
  { name: leftHandSide,
    dependencies: [identifier, arrayAccessExpression],
    parents: [],
    should_teach: true
  },
  { name: assignmentOperator,
    dependencies: [op.assign, op.add_assign, op.sub_assign, op.div_assign, op.mult_assign],
    parents: [],
    should_teach: true
  },
  { name: op.assign,
    dependencies: [],
    parents: [assignmentOperator],
    should_teach: true
  },
  { name: op.add_assign,
    dependencies: [],
    parents: [assignmentOperator],
    should_teach: true
  },
  { name: op.sub_assign,
    dependencies: [],
    parents: [assignmentOperator],
    should_teach: true
  },
  { name: op.div_assign,
    dependencies: [],
    parents: [assignmentOperator],
    should_teach: true
  },
  { name: op.mult_assign,
    dependencies: [],
    parents: [assignmentOperator],
    should_teach: true
  },
  { name: assignmentExpression,
    dependencies: [leftHandSide, assignmentOperator, expression],
    parents: [expression],
    should_teach: true
  },
  { name: postIncrementExpression,
    dependencies: [identifier, op.incr],
    parents: [expression],
    should_teach: true
  },
  { name: postDecrementExpression,
    dependencies: [identifier, op.decr],
    parents: [expression],
    should_teach: true
  },
  {	name: classInstanceExpression,
    dependencies: [keyword.new, classType, sep.left_paren, sep.right_paren],
    parents: [expression],
    should_teach: true
  },
  {	name: methodInvocationExpression,
    dependencies: [identifier, sep.left_paren, sep.right_paren],
    parents: [expression],
    should_teach: true
  },
  {	name: arrayCreationExpression,
    dependencies: [keyword.new, primitiveType, classType, sep.left_sqr, sep.right_sqr],
    parents: [expression],
    should_teach: true
  },
  { name: multiplicativeExpression,
    dependencies: [identifier, literal, op.mult],
    parents: [expression],
    should_teach: true
  },
  { name: additiveExpression,
    dependencies: [identifier, literal, op.add],
    parents: [expression],
    should_teach: true
  },
  { name: relationalExpression,
    dependencies: [identifier, literal, op.greater, op.lesser, op.greater_equality, op.lesser_equality],
    parents: [conditionalAndExpression, conditionalOrExpression],
    should_teach: true
  },
  { name: equalityExpression,
    dependencies: [identifier, literal, op.equality],
    parents: [conditionalAndExpression, conditionalOrExpression],
    should_teach: true
  },
  { name: conditionalAndExpression,
    dependencies: [relationalExpression, equalityExpression, op.and],
    parents: [expression],
    should_teach: true
  },
  { name: conditionalOrExpression,
    dependencies: [relationalExpression, equalityExpression, op.or],
    parents: [expression],
    should_teach: true
  },
  { name: statement,
    dependencies: [],
    parents: [ifThenStatement, ifThenElseStatement, forStatement, doStatement, whileStatement, breakStatement, continueStatement, returnStatement],
    should_teach: true
  },
  { name: ifThenElseStatement,
    dependencies: [keyword.if, keyword.else],
    parents: [statement],
    should_teach: true
  },
  { name: forStatement,
    dependencies: [keyword.for, sep.left_paren, variableDeclaration, expression, statementExpression, sep.right_paren, sep.semicolon],
    parents: [statement],
    should_teach: true
  },
  { name: doStatement,
    dependencies: [keyword.do, keyword.while, sep.left_paren, expression, sep.right_paren ],
    parents: [statement],
    should_teach: true
  },
  { name: whileStatement,
    dependencies: [keyword.while, sep.left_paren, expression, sep.right_paren],
    parents: [statement],
    should_teach: true
  },
  { name: breakStatement,
    dependencies: [keyword.break, sep.semicolon],
    parents: [statement],
    should_teach: true
  },
  { name: continueStatement,
    dependencies: [keyword.continue, sep.semicolon],
    parents: [statement],
    should_teach: true
  },
  { name: returnStatement,
    dependencies: [keyword.return, statement, sep.semicolon],
    parents: [],
    should_teach: true
  },
];

export default conceptInventory;