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
	null: "null", this: "this", super: "super",
};

const identifier = "identifier", expression = "expression", classInstanceExpression = "classInstanceExpression",
		methodInvocationExpression = "methodInvocationExpression", arrayCreationExpression = "arrayCreationExpression",
		statement = "statement", ifThenStatement = "ifThenStatement", ifThenElseStatement = "ifThenElseStatement",
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
		referenceType = "referenceType", fieldAccess = "fieldAccess", relationalOperator = "relationalOperator"
;
/*
 { name: ,
   dependencies: [],
   parents: [],
   should_teach: true,
 },
*/
const conceptInventory = [
	{	name: literal,
		dependencies: [integerLiteral, floatingPointLiteral, booleanLiteral, characterLiteral, stringLiteral, nullLiteral],
		parents: [],
		should_teach: true,
		container: true
	},
	{ name: integerLiteral,
		dependencies: [],
		parents: [literal],
		should_teach: true,
		container: false
	},
	{ name: floatingPointLiteral,
		dependencies: [sep.dot],
		parents: [literal],
		should_teach: true,
		container: false
	},
	{ name: booleanLiteral,
		dependencies: [keyword.true, keyword.false],
		parents: [literal],
		should_teach: true,
		container: false
	},
	{	name: keyword.true,
		dependencies: [],
		parents: [booleanLiteral],
		should_teach: true,
		container: false
	},
	{ name: keyword.false,
		dependencies: [],
		parents: [booleanLiteral],
		should_teach: true,
		container: false
	},
	{ name: characterLiteral,
		dependencies: [quote.single],
		parents: [literal],
		should_teach: true,
		container: false
	},
	{ name: stringLiteral,
		dependencies: [quote.double],
		parents: [literal],
		should_teach: true,
		container: false
	},
	{ name: nullLiteral,
		dependencies: [],
		parents: [literal],
		should_teach: true,
		container: false
	},
	{ name: keyword.null,
		dependencies: [],
		parents: [nullLiteral],
		should_teach: true,
		container: false
	},
	{ name: primitiveType,
		dependencies: [short, int, long, char, float, boolean],
		parents: [],
		should_teach: true,
		container: true
	},
	{ name: short,
		dependencies: [integerLiteral],
		parents: [primitiveType],
		should_teach: true,
		container: false
	},
	{ name: int,
		dependencies: [integerLiteral],
		parents: [primitiveType],
		should_teach: true,
		container: false
	},
	{ name: long,
		dependencies: [integerLiteral],
		parents: [primitiveType],
		should_teach: true,
		container: false
	},
	{ name: char,
		dependencies: [characterLiteral],
		parents: [primitiveType],
		should_teach: true,
		container: false
	},
	{ name: float,
		dependencies: [floatingPointLiteral],
		parents: [primitiveType],
		should_teach: true,
		container: false
	},
	{ name: boolean,
		dependencies: [booleanLiteral],
		parents: [primitiveType],
		should_teach: true,
		container: false
	},
	{ name: referenceType,
		dependencies: [string],
		parents: [],
		should_teach: true,
		container: true
	},
	{ name: string,
		dependencies: [],
		parents: [referenceType],
		should_teach: true,
		container: false
	},
	{ name: identifier,
		dependencies: [],
		parents: [classInstanceExpression, arrayCreationExpression, methodInvocationExpression, postIncrementExpression, postDecrementExpression, arrayAccessExpression, leftHandSide],
		should_teach: true,
		container: false
	},
	{	name: keyword.new,
		dependencies: [],
		parents: [classInstanceExpression, arrayCreationExpression],
		should_teach: true,
		container: false
	},
	{ name: expression,
		dependencies: [assignmentExpression, postIncrementExpression, postDecrementExpression, classInstanceExpression, methodInvocationExpression, arrayCreationExpression, arrayAccessExpression],
		parents: [],
		should_teach: true,
		container: true
	},
	{ name: arrayAccessExpression,
		dependencies: [identifier, sep.left_sqr, sep.right_sqr, ],
		parents: [expression],
		should_teach: true,
		container: false
	},
	{ name: leftHandSide,
		dependencies: [identifier, fieldAccess, arrayAccessExpression],
		parents: [],
		should_teach: true,
		container: true
	},
	{ name: fieldAccess,
		dependencies: [keyword.this, keyword.super, sep.dot],
		parents: [leftHandSide],
		should_teach: true,
		container: true
	},
	{ name: assignmentOperator,
		dependencies: [op.assign, op.add_assign, op.sub_assign, op.div_assign, op.mult_assign],
		parents: [],
		should_teach: true,
		container: true
	},
	{ name: op.assign,
		dependencies: [],
		parents: [assignmentOperator],
		should_teach: true,
		container: false
	},
	{ name: op.add_assign,
		dependencies: [],
		parents: [assignmentOperator],
		should_teach: true,
		container: false
	},
	{ name: op.sub_assign,
		dependencies: [],
		parents: [assignmentOperator],
		should_teach: true,
		container: false
	},
	{ name: op.div_assign,
		dependencies: [],
		parents: [assignmentOperator],
		should_teach: true,
		container: false
	},
	{ name: op.mult_assign,
		dependencies: [],
		parents: [assignmentOperator],
		should_teach: true,
		container: false
	},
	{ name: assignmentExpression,
		dependencies: [leftHandSide, assignmentOperator, expression],
		parents: [expression],
		should_teach: true,
		container: false
	},
	{ name: postIncrementExpression,
		dependencies: [leftHandSide, op.incr],
		parents: [expression],
		should_teach: true,
		container: false
	},
	{ name: postDecrementExpression,
		dependencies: [leftHandSide, op.decr],
		parents: [expression],
		should_teach: true,
		container: false
	},
	{	name: classInstanceExpression,
		dependencies: [keyword.new, identifier, sep.left_paren, sep.right_paren],
		parents: [expression],
		should_teach: true,
		container: false
	},
	{	name: methodInvocationExpression,
		dependencies: [identifier, sep.left_paren, sep.right_paren],
		parents: [expression],
		should_teach: true,
		container: false
	},
	{	name: arrayCreationExpression,
		dependencies: [keyword.new, primitiveType, identifier, sep.left_sqr, sep.right_sqr],
		parents: [expression],
		should_teach: true,
		container: false
	},
	{ name: multiplicativeExpression,
		dependencies: [leftHandSide, literal, op.mult],
		parents: [expression],
		should_teach: true,
		container: false
	},
	{ name: additiveExpression,
		dependencies: [leftHandSide, literal, op.add],
		parents: [expression],
		should_teach: true,
	},
	{ name: relationalOperator,
		dependencies: [op.greater, op.lesser, op.greater_equality, op.lesser_equality],
		parents: [],
		should_teach: true,
		container: true
	},
	{ name: relationalExpression,
		dependencies: [leftHandSide, literal, relationalOperator],
		parents: [conditionalAndExpression, conditionalOrExpression],
		should_teach: true,
		container: false
	},
	{ name: equalityExpression,
		dependencies: [leftHandSide, literal, op.equality],
		parents: [conditionalAndExpression, conditionalOrExpression],
		should_teach: true,
		container: false
	},
	{ name: conditionalAndExpression,
		dependencies: [relationalExpression, equalityExpression, op.and],
		parents: [expression],
		should_teach: true,
		container: false
	},
	{ name: conditionalOrExpression,
		dependencies: [relationalExpression, equalityExpression, op.or],
		parents: [expression],
		should_teach: true,
		container: false
	},
	{ name: statement,
		dependencies: [ifThenStatement, ifThenElseStatement, forStatement, doStatement, whileStatement, breakStatement, continueStatement, returnStatement],
		parents: [],
		should_teach: true,
		container: true
	},
	{ name: ifThenStatement,
		dependencies: [keyword.if, expression, sep.left_curl, sep.right_curl],
		parents: [],
		should_teach: true,
		container: false
	},
	{ name: ifThenElseStatement,
		dependencies: [keyword.if, expression, keyword.else, sep.left_curl, sep.right_curl],
		parents: [statement],
		should_teach: true,
		container: false
	},
	{ name: forStatement,
		dependencies: [keyword.for, sep.left_paren, variableDeclaration, expression, statementExpression, sep.right_paren, sep.semicolon, sep.left_curl, sep.right_curl],
		parents: [statement],
		should_teach: true,
		container: false
	},
	{ name: doStatement,
		dependencies: [keyword.do, keyword.while, sep.left_paren, expression, sep.right_paren, sep.left_curl, sep.right_curl],
		parents: [statement],
		should_teach: true,
		container: false
	},
	{ name: whileStatement,
		dependencies: [keyword.while, sep.left_paren, expression, sep.right_paren, sep.left_curl, sep.right_curl],
		parents: [statement],
		should_teach: true,
		container: false
	},
	{ name: breakStatement,
		dependencies: [keyword.break, sep.semicolon],
		parents: [statement],
		should_teach: true,
		container: false
	},
	{ name: continueStatement,
		dependencies: [keyword.continue, sep.semicolon],
		parents: [statement],
		should_teach: true,
		container: false
	},
	{ name: returnStatement,
		dependencies: [keyword.return, statement, sep.semicolon],
		parents: [],
		should_teach: true,
		container: false
	},
];

export default conceptInventory;