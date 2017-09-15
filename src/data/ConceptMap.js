import {sep, op, quote, keyword, g} from './ConceptAbbreviations';

export const conceptInventory = {
  [g.literal]: {
    dependencies: [g.integerLiteral,
      g.floatingPointLiteral,
      g.booleanLiteral,
      g.characterLiteral,
      g.stringLiteral,
      g.nullLiteral],
    parents: [
      g.multiplicativeExpression,
      g.additiveExpression,
      g.relationalExpression,
      g.equalityExpression],
    explanations: {
      name: 'literal',
      definition: 'represent integer values',
      examples: ['int year = 365;'],
      future: ['expressions'],
    },
    should_teach: false,
    container: true,
  },
  [g.integerLiteral]: {
    dependencies: [],
    parents: [g.literal, g.short, g.int, g.long],
    explanations: {
      name: 'integer literal',
      definition: 'represent integer values',
      examples: ['int year = 365;'],
      future: ['expressions'],
    },
    should_teach: true,
    container: false,
  },
  [g.floatingPointLiteral]: {
    dependencies: [sep.dot],
    parents: [g.literal, g.float],
    explanations: {
      name: 'floating point literal',
      definition: 'represent decimal values',
      examples: ['float percent = 74.625;'],
      future: ['expressions'],
    },
    should_teach: true,
    container: false,
  },
  [g.booleanLiteral]: {
    dependencies: [keyword.true, keyword.false],
    parents: [g.literal, g.boolean],
    explanations: {
      name: 'boolean literal',
      definition: 'represent true or false',
      examples: ['boolean isDifficult = true;'],
      future: ['expressions'],
    },
    should_teach: true,
    container: false,
  },
  [keyword.true]: {
    dependencies: [],
    parents: [g.booleanLiteral],
    explanations: {name: '', definition: '', examples: [''], future: ['']},
    should_teach: false,
    container: false,
  },
  [keyword.false]: {
    dependencies: [],
    parents: [g.booleanLiteral],
    explanations: {name: '', definition: '', examples: [''], future: ['']},
    should_teach: false,
    container: false,
  },
  [g.characterLiteral]: {
    dependencies: [quote.single],
    parents: [g.literal, g.char],
    explanations: {
      name: 'character literal',
      definition: 'represent character values',
      examples: ['char firstLetter = \'a\';'],
      future: ['expressions'],
    },
    should_teach: true,
    container: false,
  },
  [g.stringLiteral]: {
    dependencies: [quote.double],
    parents: [g.literal],
    explanations: {
      name: 'string literal',
      definition: 'represent text values',
      examples: ['String passive = "Mmm I\'ll probably do it."'],
      future: ['expressions'],
    },
    should_teach: true,
    container: false,
  },
  [g.nullLiteral]: {
    dependencies: [keyword.null],
    parents: [g.literal],
    explanations: {
      name: 'null literal',
      definition: 'represent the absence of something',
      examples: [],
      future: ['expressions'],
    },
    should_teach: false,
    container: false,
  },
  [keyword.null]: {
    dependencies: [],
    parents: [g.nullLiteral],
    explanations: {name: '', definition: '', examples: [''], future: ['']},
    should_teach: false,
    container: false,
  },
  [g.primitiveType]: {
    dependencies: [g.short, g.int, g.long, g.char, g.float, g.boolean],
    parents: [],
    explanations: {name: '', definition: '', examples: [''], future: ['']},
    should_teach: false,
    container: true,
  },
  [g.short]: {
    dependencies: [g.integerLiteral],
    parents: [g.primitiveType],
    explanations: {name: '', definition: '', examples: [''], future: ['']},
    should_teach: false,
    container: false,
  },
  [g.int]: {
    dependencies: [g.integerLiteral],
    parents: [g.primitiveType],
    explanations: {name: '', definition: '', examples: [''], future: ['']},
    should_teach: false,
    container: false,
  },
  [g.long]: {
    dependencies: [g.integerLiteral],
    parents: [g.primitiveType],
    explanations: {name: '', definition: '', examples: [''], future: ['']},
    should_teach: false,
    container: false,
  },
  [g.char]: {
    dependencies: [g.characterLiteral],
    parents: [g.primitiveType],
    explanations: {name: '', definition: '', examples: [''], future: ['']},
    should_teach: false,
    container: false,
  },
  [g.float]: {
    dependencies: [g.floatingPointLiteral],
    parents: [g.primitiveType],
    explanations: {name: '', definition: '', examples: [''], future: ['']},
    should_teach: false,
    container: false,
  },
  [g.boolean]: {
    dependencies: [g.booleanLiteral],
    parents: [g.primitiveType],
    explanations: {name: '', definition: '', examples: [''], future: ['']},
    should_teach: false,
    container: false,
  },
  [g.referenceType]: {
    dependencies: [g.string],
    parents: [],
    explanations: {name: '', definition: '', examples: [''], future: ['']},
    should_teach: false,
    container: true,
  },
  [g.string]: {
    dependencies: [],
    parents: [g.referenceType],
    explanations: {name: '', definition: '', examples: [''], future: ['']},
    should_teach: false,
    container: false,
  },
  [g.identifier]: {
    dependencies: [],
    parents: [
      g.classInstanceExpression,
      g.arrayCreationExpression,
      g.methodInvocationExpression,
      g.arrayAccessExpression,
      g.leftHandSide],
    explanations: {
      name: g.identifier,
      definition: 'allow you to keep track of values',
      examples: ['double temperature = 101.9;'],
      future: ['classes', 'arrays', 'methods', 'expressions'],
    },
    should_teach: true,
    container: false,
  },
  [keyword.new]: {
    dependencies: [],
    parents: [g.classInstanceExpression, g.arrayCreationExpression],
    explanations: {name: '', definition: '', examples: [''], future: ['']},
    should_teach: false,
    container: false,
  },
  [g.expression]: {
    dependencies: [
      g.assignmentExpression,
      g.multiplicativeExpression,
      g.additiveExpression,
      g.conditionalOrExpression,
      g.conditionalAndExpression,
      g.postIncrementExpression,
      g.postDecrementExpression,
      g.classInstanceExpression,
      g.methodInvocationExpression,
      g.arrayCreationExpression,
      g.arrayAccessExpression],
    parents: [
      g.ifThenStatement,
      g.ifThenElseStatement,
      g.forStatement,
      g.doStatement,
      g.whileStatement],
    explanations: {name: '', definition: '', examples: [''], future: ['']},
    should_teach: false,
    container: true,
  },
  [g.arrayAccessExpression]: {
    dependencies: [g.identifier, sep.left_sqr, sep.right_sqr,],
    parents: [g.expression, g.leftHandSide],
    explanations: {
      name: 'Array access expression',
      definition: 'give you what\'s stored in an array',
      examples: ['String name = names[0];'],
      future: [''],
    },
    should_teach: true,
    container: false,
  },
  [g.leftHandSide]: {
    dependencies: [g.identifier, g.fieldAccess, g.arrayAccessExpression],
    parents: [g.assignmentExpression],
    explanations: {name: '', definition: '', examples: [''], future: ['']},
    should_teach: false,
    container: true,
  },
  [g.fieldAccess]: {
    dependencies: [keyword.this, keyword.super, sep.dot],
    parents: [g.leftHandSide],
    explanations: {
      name: 'field access',
      definition: 'allow you to access properties of a class',
      examples: ['String name = this.first_name;'],
      future: ['statements'],
    },
    should_teach: true,
    container: true,
  },
  [g.assignmentOperator]: {
    dependencies: [
      op.assign,
      op.add_assign,
      op.sub_assign,
      op.div_assign,
      op.mult_assign],
    parents: [g.assignmentExpression],
    explanations: {name: '', definition: '', examples: [''], future: ['']},
    should_teach: true,
    container: true,
  },
  [op.assign]: {
    dependencies: [],
    parents: [g.assignmentOperator],
    explanations: {name: '', definition: '', examples: [''], future: ['']},
    should_teach: false,
    container: false,
  },
  [op.add_assign]: {
    dependencies: [],
    parents: [g.assignmentOperator],
    explanations: {name: '', definition: '', examples: [''], future: ['']},
    should_teach: false,
    container: false,
  },
  [op.sub_assign]: {
    dependencies: [],
    parents: [g.assignmentOperator],
    explanations: {name: '', definition: '', examples: [''], future: ['']},
    should_teach: false,
    container: false,
  },
  [op.div_assign]: {
    dependencies: [],
    parents: [g.assignmentOperator],
    explanations: {name: '', definition: '', examples: [''], future: ['']},
    should_teach: false,
    container: false,
  },
  [op.mult_assign]: {
    dependencies: [],
    parents: [g.assignmentOperator],
    explanations: {name: '', definition: '', examples: [''], future: ['']},
    should_teach: false,
    container: false,
  },
  [g.assignmentExpression]: {
    dependencies: [g.leftHandSide, g.assignmentOperator],
    parents: [g.expression],
    explanations: {
      name: 'assignment expression',
      definition: 'allow you to store values',
      examples: ['int x = 100; x += 10; x *= 2;'],
      future: ['statements'],
    },
    should_teach: true,
    container: false,
  },
  [g.postIncrementExpression]: {
    dependencies: [g.leftHandSide, op.incr],
    parents: [g.expression],
    explanations: {
      name: 'increment expression',
      definition: 'allow you to increase numbers by 1',
      examples: ['int x = 0; x++;'],
      future: ['loops'],
    },
    should_teach: true,
    container: false,
  },
  [g.postDecrementExpression]: {
    dependencies: [g.leftHandSide, op.decr],
    parents: [g.expression],
    explanations: {
      name: 'decrement expression',
      definition: 'allow you to decrease numbers by 1',
      examples: ['int x = 10; x--;'],
      future: ['loops'],
    },
    should_teach: true,
    container: false,
  },
  [g.classInstanceExpression]: {
    dependencies: [keyword.new, g.identifier, sep.left_paren, sep.right_paren],
    parents: [g.expression],
    explanations: {
      name: 'class instance creation expression',
      definition: 'allow you to create an object',
      examples: ['Balloon b = new Balloon();'],
      future: [''],
    },
    should_teach: true,
    container: false,
  },
  [g.methodInvocationExpression]: {
    dependencies: [g.identifier, sep.left_paren, sep.right_paren],
    parents: [g.expression],
    explanations: {
      name: 'method invocation expression',
      definition: 'allow you to reuse code',
      examples: ['int largestNumber = getLargest(3, 5);'],
      future: ['statements'],
    },
    should_teach: true,
    container: false,
  },
  [g.arrayCreationExpression]: {
    dependencies: [
      keyword.new,
      g.primitiveType,
      g.identifier,
      sep.left_sqr,
      sep.right_sqr],
    parents: [g.expression],
    explanations: {
      name: 'array creation expression',
      definition: 'allow you to create an array for storing values',
      examples: ['int numberOfPeople = 19; String[] names = new String[numberOfPeople];'],
      future: [''],
    },
    should_teach: true,
    container: false,
  },
  [g.multiplicativeExpression]: {
    dependencies: [g.leftHandSide, g.literal, op.mult],
    parents: [g.expression],
    explanations: {
      name: 'multiplicative expression',
      definition: 'allow you to multiply/divide numbers',
      examples: ['double revenue = 19426 * 0.99;'],
      future: ['statements'],
    },
    should_teach: true,
    container: false,
  },
  [g.additiveExpression]: {
    dependencies: [g.leftHandSide, g.literal, op.add],
    parents: [g.expression],
    explanations: {
      name: 'additive expression',
      definition: 'allow you to add/subtract numbers',
      examples: ['double weight = 19.7 + 20.2;'],
      future: ['statements'],
    },
    should_teach: true,
    container: false,
  },
  [g.relationalOperator]: {
    dependencies: [
      op.greater,
      op.lesser,
      op.greater_equality,
      op.lesser_equality],
    parents: [],
    explanations: {name: '', definition: '', examples: [''], future: ['']},
    should_teach: true,
    container: true,
  },
  [g.relationalExpression]: {
    dependencies: [g.leftHandSide, g.literal, g.relationalOperator],
    parents: [g.conditionalAndExpression, g.conditionalOrExpression],
    explanations: {
      name: 'relational expression',
      definition: 'allow you to compare the values',
      examples: ['int height = 5; boolean isProperHeight = height < 10;'],
      future: ['statements'],
    },
    should_teach: true,
    container: false,
  },
  [g.equalityExpression]: {
    dependencies: [g.leftHandSide, g.literal, op.equality],
    parents: [g.conditionalAndExpression, g.conditionalOrExpression],
    explanations: {
      name: 'equality expression',
      definition: 'allow you to check if things are equivalent',
      examples: ['double height = 5.7; boolean notSameHeight = height != 6;'],
      future: ['statements'],
    },
    should_teach: true,
    container: false,
  },
  [g.conditionalAndExpression]: {
    dependencies: [g.relationalExpression, g.equalityExpression, op.and],
    parents: [g.expression],
    explanations: {
      name: 'AND expression',
      definition: 'allow you to perform more complex logic',
      examples: ['int age = 21; boolean legal = age >= 18 && age % 2 != 0;'],
      future: ['statements'],
    },
    should_teach: true,
    container: false,
  },
  [g.conditionalOrExpression]: {
    dependencies: [g.relationalExpression, g.equalityExpression, op.or],
    parents: [g.expression],
    explanations: {
      name: 'OR expression',
      definition: 'allow you to perform more complex logic',
      examples: ['int score = 145; boolean notAverage = score < 100 || score > 200;'],
      future: ['statements'],
    },
    should_teach: true,
    container: false,
  },
  [g.statement]: {
    dependencies: [
      g.ifThenStatement,
      g.ifThenElseStatement,
      g.forStatement,
      g.doStatement,
      g.whileStatement,
      g.breakStatement,
      g.continueStatement,
      g.returnStatement],
    parents: [],
    explanations: {name: '', definition: '', examples: [''], future: ['']},
    should_teach: false,
    container: true,
  },
  [g.ifThenStatement]: {
    dependencies: [keyword.if, g.expression, sep.left_curl, sep.right_curl],
    parents: [],
    explanations: {
      name: 'if statement',
      definition: 'help you control whether code will execute',
      examples: ['int x = Scanner.nextInt(); if(x > 100) { System.out.println("Good job"); }'],
      future: [''],
    },
    should_teach: true,
    container: false,
  },
  [g.ifThenElseStatement]: {
    dependencies: [
      keyword.if,
      g.expression,
      keyword.else,
      sep.left_curl,
      sep.right_curl],
    parents: [g.statement],
    explanations: {
      name: 'if-else statement',
      definition: 'help you control the execution of code',
      examples: ['int x = Scanner.nextInt(); if(x > 100) { System.out.println("Large!"); } else { System.out.println("Small."); }'],
      future: [''],
    },
    should_teach: true,
    container: false,
  },
  [g.forStatement]: {
    dependencies: [
      keyword.for,
      sep.left_paren,
      g.variableDeclaration,
      g.expression,
      g.statementExpression,
      sep.right_paren,
      sep.semicolon,
      sep.left_curl,
      sep.right_curl],
    parents: [g.statement],
    explanations: {
      name: 'for loop',
      definition: 'help you perform the same task many times',
      examples: ['for( int i = 0; i < 100; i ++) { System.out.println(i + " ducks"); }'],
      future: [''],
    },
    should_teach: true,
    container: false,
  },
  [g.doStatement]: {
    dependencies: [
      keyword.do,
      keyword.while,
      sep.left_paren,
      g.expression,
      sep.right_paren,
      sep.left_curl,
      sep.right_curl],
    parents: [g.statement],
    explanations: {
      name: 'do-while loop',
      definition: 'help you perform the same task many times',
      examples: ['int x = 0; do { x++; } while ( x < 100 );'],
      future: [''],
    },
    should_teach: true,
    container: false,
  },
  [g.whileStatement]: {
    dependencies: [
      keyword.while,
      sep.left_paren,
      g.expression,
      sep.right_paren,
      sep.left_curl,
      sep.right_curl],
    parents: [g.statement],
    explanations: {
      name: 'while loop',
      definition: 'help you perform the same task many times',
      examples: ['while(true) { System.out.println("forever"); }'],
      future: [''],
    },
    should_teach: true,
    container: false,
  },
  [g.breakStatement]: {
    dependencies: [keyword.break, sep.semicolon],
    contextual_dependencies: [g.forStatement, g.whileStatement, g.doStatement],
    parents: [g.statement],
    explanations: {
      name: 'break statement',
      definition: 'help you exit out of loops',
      examples: ['int x = 0; while(x < 10) { if(x %2 == 0) { break; } System.out.println(x);}'],
      future: [''],
    },
    should_teach: true,
    container: false,
  },
  [g.continueStatement]: {
    dependencies: [keyword.continue, sep.semicolon],
    contextual_dependencies: [g.forStatement, g.whileStatement, g.doStatement],
    parents: [g.statement],
    explanations: {
      name: 'continue statement',
      definition: 'help you skip to the next iteration of a loop',
      examples: ['int x = 0; while(x < 10) { if(x %2 == 0) { continue; } System.out.println(x);}'],
      future: [''],
    },
    should_teach: true,
    container: false,
  },
  [g.returnStatement]: {
    dependencies: [keyword.return, g.statement, sep.semicolon],
    contextual_dependencies: [g.methodInvocationExpression],
    parents: [],
    explanations: {
      name: 'return statement',
      definition: 'help you reuse code',
      examples: ['int addTen(int x) { return x + 10; }'],
      future: [''],
    },
    should_teach: true,
    container: false,
  },
};

export default conceptInventory;
