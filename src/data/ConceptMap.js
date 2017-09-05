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
    dependencies: [],
    parents: [integerLiteral, floatingPointLiteral, booleanLiteral, characterLiteral, stringLiteral, nullLiteral],
    should_teach: true
  },
  { name: integerLiteral,
    dependencies: [literal],
    parents: [],
    should_teach: true
  },
  { name: floatingPointLiteral,
    dependencies: [literal, sep.dot],
    parents: [],
    should_teach: true
  },
  { name: booleanLiteral,
    dependencies: [literal],
    parents: [keyword.true, keyword.false],
    should_teach: true
  },
  {	name: keyword.true,
    dependencies: [booleanLiteral],
    parents: [],
    should_teach: true
  },
  { name: keyword.false,
    dependencies: [booleanLiteral],
    parents: [],
    should_teach: true
  },
  { name: characterLiteral,
    dependencies: [quote.single, literal],
    parents: [],
    should_teach: true
  },
  { name: stringLiteral,
    dependencies: [quote.double, literal],
    parents: [],
    should_teach: true
  },
  { name: nullLiteral,
    dependencies: [literal],
    parents: [],
    should_teach: true
  },
  { name: keyword.null,
    dependencies: [nullLiteral],
    parents: [],
    should_teach: true
  },
  { name: primitiveType,
    dependencies: [],
    parents: [short, int, long, char, float, boolean],
    should_teach: true
  },
  { name: short,
    dependencies: [primitiveType, integerLiteral],
    parents: [],
    should_teach: true
  },
  { name: int,
    dependencies: [primitiveType, integerLiteral],
    parents: [],
    should_teach: true
  },
  { name: long,
    dependencies: [primitiveType, integerLiteral],
    parents: [],
    should_teach: true
  },
  { name: char,
    dependencies: [primitiveType, integerLiteral],
    parents: [],
    should_teach: true
  },
  { name: float,
    dependencies: [primitiveType, floatingPointLiteral],
    parents: [],
    should_teach: true
  },
  { name: boolean,
    dependencies: [primitiveType, integerLiteral],
    parents: [],
    should_teach: true
  },
  { name: referenceType,
    dependencies: [],
    parents: [string],
    should_teach: true
  },
  { name: string,
    dependencies: [referenceType],
    parents: [],
    should_teach: true
  },
  { name: identifier,
    dependencies: [],
    parents: [classType, methodInvocationExpression, postIncrementExpression, postDecrementExpression],
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
    dependencies: [],
    parents: [assignmentExpression, postIncrementExpression, postDecrementExpression, classInstanceExpression, methodInvocationExpression, arrayCreationExpression, arrayAccessExpression],
    should_teach: true
  },
  { name: arrayAccessExpression,
    dependencies: [identifier, sep.left_sqr, sep.right_sqr, expression],
    parents: [],
    should_teach: true
  },
  { name: leftHandSide,
    dependencies: [identifier, arrayAccessExpression],
    parents: [],
    should_teach: true
  },
  { name: assignmentOperator,
    dependencies: [],
    parents: [op.assign, op.add_assign, op.sub_assign, op.div_assign, op.mult_assign],
    should_teach: true
  },
  { name: op.assign,
    dependencies: [assignmentOperator],
    parents: [],
    should_teach: true
  },
  { name: op.add_assign,
    dependencies: [assignmentOperator],
    parents: [],
    should_teach: true
  },
  { name: op.sub_assign,
    dependencies: [assignmentOperator],
    parents: [],
    should_teach: true
  },
  { name: op.div_assign,
    dependencies: [assignmentOperator],
    parents: [],
    should_teach: true
  },
  { name: op.mult_assign,
    dependencies: [assignmentOperator],
    parents: [],
    should_teach: true
  },
  { name: assignmentExpression,
    dependencies: [leftHandSide, assignmentOperator, expression],
    parents: [],
    should_teach: true
  },
  { name: postIncrementExpression,
    dependencies: [identifier, op.incr, expression],
    parents: [],
    should_teach: true
  },
  { name: postDecrementExpression,
    dependencies: [identifier, op.decr, expression],
    parents: [],
    should_teach: true
  },
  {	name: classInstanceExpression,
    dependencies: [keyword.new, classType, sep.left_paren, sep.right_paren, expression],
    parents: [],
    should_teach: true
  },
  {	name: methodInvocationExpression,
    dependencies: [identifier, sep.left_paren, sep.right_paren, expression],
    parents: [],
    should_teach: true
  },
  {	name: arrayCreationExpression,
    dependencies: [keyword.new, primitiveType, classType, sep.left_sqr, sep.right_sqr, expression],
    parents: [],
    should_teach: true
  },
  { name: multiplicativeExpression,
    dependencies: [identifier, literal, op.mult, expression],
    parents: [],
    should_teach: true
  },
  { name: additiveExpression,
    dependencies: [identifier, literal, op.add, expression],
    parents: [],
    should_teach: true
  },
  { name: relationalExpression,
    dependencies: [identifier, literal, op.greater, op.lesser, op.greater_equality, op.lesser_equality, expression],
    parents: [conditionalAndExpression, conditionalOrExpression],
    should_teach: true
  },
  { name: equalityExpression,
    dependencies: [identifier, literal, op.equality, expression],
    parents: [conditionalAndExpression, conditionalOrExpression],
    should_teach: true
  },
  { name: conditionalAndExpression,
    dependencies: [relationalExpression, equalityExpression, op.and, expression],
    parents: [],
    should_teach: true
  },
  { name: conditionalOrExpression,
    dependencies: [relationalExpression, equalityExpression, op.or, expression],
    parents: [],
    should_teach: true
  },
  { name: statement,
    dependencies: [],
    parents: [ifThenStatement, ifThenElseStatement, forStatement, doStatement, whileStatement, breakStatement, continueStatement, returnStatement],
    should_teach: true
  },
  { name: ifThenStatement,
    dependencies: [keyword.if, sep.left_paren, expression, sep.right_paren, statement],
    parents: [],
    should_teach: true
  },
  { name: ifThenElseStatement,
    dependencies: [keyword.if, statement, keyword.else],
    parents: [],
    should_teach: true
  },
  { name: forStatement,
    dependencies: [keyword.for, sep.left_paren, variableDeclaration, expression, statementExpression, sep.right_paren, statement, sep.semicolon],
    parents: [],
    should_teach: true
  },
  { name: doStatement,
    dependencies: [keyword.do, statement, keyword.while, sep.left_paren, expression, sep.right_paren ],
    parents: [],
    should_teach: true
  },
  { name: whileStatement,
    dependencies: [keyword.while, sep.left_paren, expression, sep.right_paren, statement],
    parents: [],
    should_teach: true
  },
  { name: breakStatement,
    dependencies: [keyword.break, statement, sep.semicolon],
    parents: [],
    should_teach: true
  },
  { name: continueStatement,
    dependencies: [keyword.continue, statement, sep.semicolon],
    parents: [],
    should_teach: true
  },
  { name: returnStatement,
    dependencies: [keyword.return, statement, sep.semicolon],
    parents: [],
    should_teach: true
  },
];

export default conceptInventory;