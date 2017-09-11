import {sep, op, quote, keyword, g} from './ConceptAbbreviations';

export const conceptInventory = [
  {	name: g.literal,
    dependencies: [g.integerLiteral, g.floatingPointLiteral, g.booleanLiteral, g.characterLiteral, g.stringLiteral, g.nullLiteral],
    parents: [g.multiplicativeExpression, g.additiveExpression, g.relationalExpression, g.equalityExpression],
    explanations: [],
    should_teach: false,
    container: true
  },
  { name: g.integerLiteral,
    dependencies: [],
    parents: [g.literal],
    explanations: [],
    should_teach: true,
    container: false
  },
  { name: g.floatingPointLiteral,
    dependencies: [sep.dot],
    parents: [g.literal],
    explanations: [],
    should_teach: true,
    container: false
  },
  { name: g.booleanLiteral,
    dependencies: [keyword.true, keyword.false],
    parents: [g.literal],
    explanations: [],
    should_teach: true,
    container: false
  },
  {	name: keyword.true,
    dependencies: [],
    parents: [g.booleanLiteral],
    explanations: [],
    should_teach: false,
    container: false
  },
  { name: keyword.false,
    dependencies: [],
    parents: [g.booleanLiteral],
    explanations: [],
    should_teach: false,
    container: false
  },
  { name: g.characterLiteral,
    dependencies: [quote.single],
    parents: [g.literal],
    explanations: [],
    should_teach: true,
    container: false
  },
  { name: g.stringLiteral,
    dependencies: [quote.double],
    parents: [g.literal],
    explanations: [],
    should_teach: true,
    container: false
  },
  { name: g.nullLiteral,
    dependencies: [],
    parents: [g.literal],
    explanations: [],
    should_teach: false,
    container: false
  },
  { name: keyword.null,
    dependencies: [],
    parents: [g.nullLiteral],
    explanations: [],
    should_teach: false,
    container: false
  },
  { name: g.primitiveType,
    dependencies: [g.short, g.int, g.long, g.char, g.float, g.boolean],
    parents: [],
    explanations: [],
    should_teach: false,
    container: true
  },
  { name: g.short,
    dependencies: [g.integerLiteral],
    parents: [g.primitiveType],
    explanations: [],
    should_teach: false,
    container: false
  },
  { name: g.int,
    dependencies: [g.integerLiteral],
    parents: [g.primitiveType],
    explanations: [],
    should_teach: true,
    container: false
  },
  { name: g.long,
    dependencies: [g.integerLiteral],
    parents: [g.primitiveType],
    explanations: [],
    should_teach: false,
    container: false
  },
  { name: g.char,
    dependencies: [g.characterLiteral],
    parents: [g.primitiveType],
    explanations: [],
    should_teach: true,
    container: false
  },
  { name: g.float,
    dependencies: [g.floatingPointLiteral],
    parents: [g.primitiveType],
    explanations: [],
    should_teach: true,
    container: false
  },
  { name: g.boolean,
    dependencies: [g.booleanLiteral],
    parents: [g.primitiveType],
    explanations: [],
    should_teach: true,
    container: false
  },
  { name: g.referenceType,
    dependencies: [g.string],
    parents: [],
    explanations: [],
    should_teach: true,
    container: true
  },
  { name: g.string,
    dependencies: [],
    parents: [g.referenceType],
    explanations: [],
    should_teach: false,
    container: false
  },
  { name: g.identifier,
    dependencies: [],
    parents: [g.classInstanceExpression, g.arrayCreationExpression, g.methodInvocationExpression, g.postIncrementExpression, g.postDecrementExpression, g.arrayAccessExpression, g.leftHandSide],
    explanations: [],
    should_teach: true,
    container: false
  },
  {	name: keyword.new,
    dependencies: [],
    parents: [g.classInstanceExpression, g.arrayCreationExpression],
    explanations: [],
    should_teach: true,
    container: false
  },
  { name: g.expression,
    dependencies: [g.assignmentExpression, g.postIncrementExpression, g.postDecrementExpression, g.classInstanceExpression, g.methodInvocationExpression, g.arrayCreationExpression, g.arrayAccessExpression],
    parents: [],
    explanations: [],
    should_teach: true,
    container: true
  },
  { name: g.arrayAccessExpression,
    dependencies: [g.identifier, sep.left_sqr, sep.right_sqr, ],
    parents: [g.expression],
    explanations: [],
    should_teach: true,
    container: false
  },
  { name: g.leftHandSide,
    dependencies: [g.identifier, g.fieldAccess, g.arrayAccessExpression],
    parents: [],
    explanations: [],
    should_teach: true,
    container: true
  },
  { name: g.fieldAccess,
    dependencies: [keyword.this, keyword.super, sep.dot],
    parents: [g.leftHandSide],
    explanations: [],
    should_teach: true,
    container: true
  },
  { name: g.assignmentOperator,
    dependencies: [op.assign, op.add_assign, op.sub_assign, op.div_assign, op.mult_assign],
    parents: [],
    explanations: [],
    should_teach: true,
    container: true
  },
  { name: op.assign,
    dependencies: [],
    parents: [g.assignmentOperator],
    explanations: [],
    should_teach: true,
    container: false
  },
  { name: op.add_assign,
    dependencies: [],
    parents: [g.assignmentOperator],
    explanations: [],
    should_teach: false,
    container: false
  },
  { name: op.sub_assign,
    dependencies: [],
    parents: [g.assignmentOperator],
    explanations: [],
    should_teach: false,
    container: false
  },
  { name: op.div_assign,
    dependencies: [],
    parents: [g.assignmentOperator],
    explanations: [],
    should_teach: false,
    container: false
  },
  { name: op.mult_assign,
    dependencies: [],
    parents: [g.assignmentOperator],
    explanations: [],
    should_teach: false,
    container: false
  },
  { name: g.assignmentExpression,
    dependencies: [g.leftHandSide, g.assignmentOperator, g.expression],
    parents: [g.expression],
    explanations: [],
    should_teach: true,
    container: false
  },
  { name: g.postIncrementExpression,
    dependencies: [g.leftHandSide, op.incr],
    parents: [g.expression],
    explanations: [],
    should_teach: true,
    container: false
  },
  { name: g.postDecrementExpression,
    dependencies: [g.leftHandSide, op.decr],
    parents: [g.expression],
    explanations: [],
    should_teach: true,
    container: false
  },
  {	name: g.classInstanceExpression,
    dependencies: [keyword.new, g.identifier, sep.left_paren, sep.right_paren],
    parents: [g.expression],
    explanations: [],
    should_teach: true,
    container: false
  },
  {	name: g.methodInvocationExpression,
    dependencies: [g.identifier, sep.left_paren, sep.right_paren],
    parents: [g.expression],
    explanations: [],
    should_teach: true,
    container: false
  },
  {	name: g.arrayCreationExpression,
    dependencies: [keyword.new, g.primitiveType, g.identifier, sep.left_sqr, sep.right_sqr],
    parents: [g.expression],
    explanations: [],
    should_teach: true,
    container: false
  },
  { name: g.multiplicativeExpression,
    dependencies: [g.leftHandSide, g.literal, op.mult],
    parents: [g.expression],
    explanations: [],
    should_teach: true,
    container: false
  },
  { name: g.additiveExpression,
    dependencies: [g.leftHandSide, g.literal, op.add],
    parents: [g.expression],
    explanations: [],
    should_teach: true,
  },
  { name: g.relationalOperator,
    dependencies: [op.greater, op.lesser, op.greater_equality, op.lesser_equality],
    parents: [],
    explanations: [],
    should_teach: true,
    container: true
  },
  { name: g.relationalExpression,
    dependencies: [g.leftHandSide, g.literal, g.relationalOperator],
    parents: [g.conditionalAndExpression, g.conditionalOrExpression],
    explanations: [],
    should_teach: true,
    container: false
  },
  { name: g.equalityExpression,
    dependencies: [g.leftHandSide, g.literal, op.equality],
    parents: [g.conditionalAndExpression, g.conditionalOrExpression],
    explanations: [],
    should_teach: true,
    container: false
  },
  { name: g.conditionalAndExpression,
    dependencies: [g.relationalExpression, g.equalityExpression, op.and],
    parents: [g.expression],
    explanations: [],
    should_teach: true,
    container: false
  },
  { name: g.conditionalOrExpression,
    dependencies: [g.relationalExpression, g.equalityExpression, op.or],
    parents: [g.expression],
    explanations: [],
    should_teach: true,
    container: false
  },
  { name: g.statement,
    dependencies: [g.ifThenStatement, g.ifThenElseStatement, g.forStatement, g.doStatement, g.whileStatement, g.breakStatement, g.continueStatement, g.returnStatement],
    parents: [],
    explanations: [],
    should_teach: true,
    container: true
  },
  { name: g.ifThenStatement,
    dependencies: [keyword.if, g.expression, sep.left_curl, sep.right_curl],
    parents: [],
    explanations: [],
    should_teach: true,
    container: false
  },
  { name: g.ifThenElseStatement,
    dependencies: [keyword.if, g.expression, keyword.else, sep.left_curl, sep.right_curl],
    parents: [g.statement],
    explanations: [],
    should_teach: true,
    container: false
  },
  { name: g.forStatement,
    dependencies: [keyword.for, sep.left_paren, g.variableDeclaration, g.expression, g.statementExpression, sep.right_paren, sep.semicolon, sep.left_curl, sep.right_curl],
    parents: [g.statement],
    explanations: [],
    should_teach: true,
    container: false
  },
  { name: g.doStatement,
    dependencies: [keyword.do, keyword.while, sep.left_paren, g.expression, sep.right_paren, sep.left_curl, sep.right_curl],
    parents: [g.statement],
    explanations: [],
    should_teach: true,
    container: false
  },
  { name: g.whileStatement,
    dependencies: [keyword.while, sep.left_paren, g.expression, sep.right_paren, sep.left_curl, sep.right_curl],
    parents: [g.statement],
    explanations: [],
    should_teach: true,
    container: false
  },
  { name: g.breakStatement,
    dependencies: [keyword.break, sep.semicolon],
    contextual_dependencies: [g.forStatement, g.whileStatement, g.doStatement],
    parents: [g.statement],
    explanations: [],
    should_teach: true,
    container: false
  },
  { name: g.continueStatement,
    dependencies: [keyword.continue, sep.semicolon],
    contextual_dependencies: [g.forStatement, g.whileStatement, g.doStatement],
    parents: [g.statement],
    explanations: [],
    should_teach: true,
    container: false
  },
  { name: g.returnStatement,
    dependencies: [keyword.return, g.statement, sep.semicolon],
    contextual_dependencies: [g.methodInvocationExpression],
    parents: [],
    explanations: [],
    should_teach: true,
    container: false
  },
];

export default conceptInventory;
