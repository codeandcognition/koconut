// @flow
import ExerciseTypes from './ExerciseTypes.js';
import {conceptInventory} from './ConceptMap';
// import {sep, op, quote, keyword, g} from './ConceptAbbreviations';
import _ from 'lodash';


export type Exercise = {
  code?: string,
  concepts: string[],
  prompt?: string,
  questions: any,
  labels?: Map<string,string>,
  type?: any
}

const difficulty = {
  low: 0,
  med: 1,
  high: 2,
};

export const stubExercise: Exercise =
    {
  "code": "",
    "prompt": "This is a stub exercise",
    "concepts": [
  "dataTypes"
  ],
    "questions": [
  {
    "answer": "integer",
    "choices": [
      "integer",
      "float",
      "string",
      "boolean"
    ],
    "code": "123",
    "difficulty": 0,
    "feedback": "",
    "followupPrompt": "",
    "hint": "",
    "prompt": "Value",
    "type": "multipleChoice"
  },
  {
    "answer": "string",
    "choices": [
      "integer",
      "float",
      "string",
      "boolean"
    ],
    "code": "\"123\"",
    "difficulty": 0,
    "feedback": "",
    "followupPrompt": "",
    "hint": "",
    "prompt": "Value",
    "type": "multipleChoice"
  }
  ]
};

export let variable17061 = [
  {
    'exercise': {
      'prompt': 'What does this expression simplify to?',
      'code': 'true != false',
      'difficulty': 0,
      'choices': ['true', 'false', '1', '0'],
      'type': 'multipleChoice',
      'concepts': ['boolean'],
    },
    'answer': 'true',
  },
  {
    'exercise': {
      'prompt': 'What is y?',
      'code': 'int y = 2.4/2;',
      'difficulty': 0,
      'choices': ['1', '1.2', '2', 'null'],
      'concepts': ['int'],
      'type': 'multipleChoice',
    },
    'answer': '1',
  },
  {
    'exercise': {
      'prompt': 'What is the value of num?',
      'code': 'int x = 2;\nfloat num = x*1.5;',
      'difficulty': 0,
      'choices': [],
      'concepts': ['float'],
      'type': 'shortResponse',
    },
    'answer': '3.0',
  },
  {
    'exercise': {
      'prompt': 'What does the "=" do for this code?',
      'code': 'x = 1;',
      'difficulty': 0,
      'choices': [
        'It checks if x is equal to 1.',
        'It sets x to 1.',
        'There is not enough information to tell.'],
      'concepts': ['='],
      'type': 'multipleChoice',
    },
    'answer': 'It sets x to 1.',
  },
  {
    'exercise': {
      'prompt': 'Which value is a String?',
      'code': '',
      'difficulty': 0,
      'choices': ['"123"', '\'123\'', '123', 'None of the above.'],
      'concepts': ['stringLiteral'],
      'type': 'multipleChoice',
    },
    'answer': '"123"',
  },
  {
    'exercise': {
      'prompt': 'What does this expression evaluate to?',
      'code': '(4.4 / 2) - 1',
      'difficulty': 0,
      'choices': [],
      'concepts': ['floatingPointLiteral'],
      'type': 'shortResponse',
    },
    'answer': '1.2',
  },
  {
    'exercise': {
      'prompt': 'Which of the following is NOT an allowed variable name?',
      'code': '',
      'difficulty': 0,
      'choices': [
        'oneTwo',
        'one2',
        '1Two',
        'All options are acceptable variable names.'],
      'concepts': ['identifier'],
      'type': 'multipleChoice',
    },
    'answer': '1Two',
  },
  {
    'exercise': {
      'prompt': 'Which of the following statements is true about \'c\' and "c"?',
      'code': '',
      'difficulty': 0,
      'choices': [
        'There is not enough information to answer this question.',
        'They are the same data type\n',
        'They are different data types.'],
      'concepts': ['characterLiteral'],
      'type': 'multipleChoice',
    },
    'answer': 'They are different data types.',
  },
  {
    'exercise': {
      'prompt': 'What\'s the value of y after this code finishes executing?',
      'code': 'int x = 10;\nint y = 0;\nwhile(x > y) {\n  x --;\n  y = y + x/2;\n}',
      'difficulty': 0,
      'choices': ['0', '4', '8', '8.5'],
      'concepts': ['breakStatement'],
      'type': 'multipleChoice',
    },
    'answer': '8',
  },
  {
    'exercise': {
      'prompt': 'Use a for loop to print all even numbers from 2 to 20 (inclusive) where each number is on a different line.',
      'code': '',
      'difficulty': 0,
      'choices': [],
      'concepts': ['forStatement'],
      'type': 'writeCode',
    },
    'answer': '2\n4\n6\n8\n10\n12\n14\n16\n18\n20\n',
  },
  {
    'exercise': {
      'prompt': 'What does the variable "foo" store?',
      'code': 'String foo = "bar";',
      'difficulty': 0,
      'choices': [
        'A reference to the String "bar".',
        'The String "bar".',
        'There is not enough information to answer this question.'],
      'concepts': ['referenceType'],
      'type': 'multipleChoice',
    },
    'answer': 'A reference to the String "bar".',
  },
  {
    'exercise': {
      'prompt': 'Fill in the blank to make the if statement true.',
      'code': 'int x = 3;\nint y = 7;\nif( x /*  <FILL ME IN> */ y) {\n     System.out.print("You\'re beautiful!");\n}',
      'difficulty': 0,
      'choices': [],
      'concepts': ['relationalExpression'],
      'type': 'fillBlank',
    },
    'answer': 'You\'re beautiful!',
  },
  {
    'exercise': {
      'prompt': 'Given an integer variable x, what is the expression "x *= 4" equivalent to?',
      'code': '',
      'difficulty': 0,
      'choices': [
        'x = x * 4',
        'x = "x4"',
        'x = 4',
        'The expression throws an error.'],
      'concepts': ['multiplicativeExpression'],
      'type': 'multipleChoice',
    },
    'answer': 'x = x * 4',
  }];
export let variable60932 = [
  {
    'exercise': {
      'prompt': 'Highlight the integer literal',
      'code': 'System.out.println(1);\nSystem.out.println(\'2\');\nSystem.out.println(3.0);',
      'difficulty': 0,
      'choices': [],
      'type': 'highlightCode',
      'concepts': ['integerLiteral'],
    },
    'answer': '1',
  },
  {
    'exercise': {
      'prompt': 'Highlight the boolean ',
      'code': '"false";\nfalse;\n"true";',
      'difficulty': 0,
      'choices': [],
      'type': 'highlightCode',
      'concepts': ['booleanLiteral'],
    },
    'answer': 'false',
  },
  {
    'exercise': {
      'prompt': 'The following expression is of what primitive type?',
      'code': '100.0;',
      'difficulty': 0,
      'choices': ['boolean', 'float', 'int'],
      'concepts': ['primitiveType'],
      'type': 'multipleChoice',
    },
    'answer': 'float',
  },
  {
    'exercise': {
      'prompt': 'What\'s the keyword that will let us instantiate an object of type Frog?',
      'code': 'Frog prince = /*   */ Frog();',
      'difficulty': 0,
      'choices': [],
      'concepts': ['new'],
      'type': 'fillBlank',
    },
    'answer': '',
  },
  {
    'exercise': {
      'prompt': 'What keyword lets us create this integer array?',
      'code': 'int[] itemCounts = /*   */ int[100];',
      'difficulty': 0,
      'choices': [],
      'concepts': ['new'],
      'type': 'fillBlank',
    },
    'answer': 'new',
  }];
export let variable18916 = [
  {
    'exercise': {
      'prompt': 'What is the value of x after the following code executes?',
      'code': 'int x = 5;\nx += 10;\n',
      'difficulty': 0,
      'choices': ['5', '10', '15', '20'],
      'concepts': ['+=', '='],
      'type': 'multipleChoice',
    },
    'answer': '15',
  },
  {
    'exercise': {
      'prompt': 'What is the output of the following code?',
      'code': 'int x = 1;\n\nif(x > 0) {\n System.out.print("compute");\n break;\n}\n\nSystem.out.print("r");\n',
      'difficulty': 0,
      'choices': [],
      'concepts': ['breakStatement', 'ifThenStatement'],
      'type': 'shortResponse',
    },
    'answer': 'computer',
  },
  {
    'exercise': {
      'prompt': 'What is the console output of the following code?',
      'code': 'int x = 10;\n\nif(true) {\n System.out.print("Hello");\n return x;\n}\n\nSystem.out.print("World");\nreturn x;',
      'difficulty': 0,
      'choices': ['Hello', 'World', 'HelloWorld', '10'],
      'concepts': ['ifThenStatement', 'returnStatement'],
      'type': 'multipleChoice',
    },
    'answer': 'Hello',
  },
  {
    'exercise': {
      'prompt': 'Replace the block comment in the code to make the code output "I AM ROBOT".',
      'code': 'int x = 7;\n\nSystem.out.print("I AM ");\n\nif(x /* REPLACE ME */ 7) {\n System.out.print("ROBOT");\n} else {\n System.out.print("HUMAN");\n}\n',
      'difficulty': 0,
      'choices': [],
      'concepts': ['ifThenElseStatement', 'equalityExpression'],
      'type': 'fillBlank',
    },
    'answer': 'I AM ROBOT',
  },
  {
    'exercise': {
      'prompt': 'Write a program that prints the numbers 0 through 100, with no spaces or newlines in between each number.',
      'code': '',
      'difficulty': 0,
      'choices': [],
      'concepts': ['forStatement'],
      'type': 'writeCode',
    },
    'answer': '0123456789101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263646566676869707172737475767778798081828384858687888990919293949596979899100',
  },
  {
    'exercise': {
      'prompt': 'What is the output of the following code?',
      'code': 'int x = 100;\n\nSystem.out.print(x < 100);\n',
      'difficulty': 0,
      'choices': ['true', '100', 'false', '99'],
      'concepts': ['relationalExpression'],
      'type': 'multipleChoice',
    },
    'answer': 'false',
  },
  {
    'exercise': {
      'prompt': 'What is the value of x after the following code executes?',
      'code': 'int x = 100;\n\nx *= 1;\nx *= 2;\n',
      'difficulty': 0,
      'choices': [],
      'concepts': ['multiplicativeExpression'],
      'type': 'shortResponse',
    },
    'answer': '200',
  },
  {
    'exercise': {
      'prompt': 'Highlight the entire char literal in the code.',
      'code': 'System.out.println(3);\nSystem.out.println(\'3\');\nSystem.out.println("3");',
      'difficulty': 0,
      'choices': [],
      'concepts': ['char'],
      'type': 'highlightCode',
    },
    'answer': '\'3\'',
  }];
export let variable88688 = [
  {
    'exercise': {
      'prompt': 'Choose the correct output of the following code',
      'code': 'char[] characters = new char[10];\nchar[1] = \'a\';\nchar[3] = \'b\';\nchar[5] = \'c\';\nchar[7] = \'d\';\nSystem.out.println(characters[3]);',
      'difficulty': 0,
      'choices': ['\'d\'', '\'c\'', '\'k\'', '\'b\''],
      'type': 'multipleChoice',
      'concepts': ['arrayAccessExpression'],
    },
    'answer': '\'b\'',
  },
  {
    'exercise': {
      'prompt': 'Enter the correct output of the following code',
      'code': 'int x = 10;\nx++;\nx++;\nSystem.out.println(x);',
      'difficulty': 0,
      'choices': [],
      'concepts': ['postIncrementExpression'],
      'type': 'shortResponse',
    },
    'answer': '12',
  },
  {
    'exercise': {
      'prompt': 'Write code that instantiates an integer variable with the value 100, and then decrements that value, and prints it to the console.',
      'code': '',
      'difficulty': 0,
      'choices': [],
      'concepts': ['postDecrementExpression'],
      'type': 'writeCode',
    },
    'answer': '99',
  },
  {
    'exercise': {
      'prompt': 'Highlight the line that makes the variable x have a value of 15.',
      'code': 'int x = 0;\nx = x + 5;\nx -= 2;\nx = x * 5;\nx += 15;\nx -= 10;\nx -= 20;\nx++;',
      'difficulty': 0,
      'choices': [],
      'concepts': ['assignmentOperator'],
      'type': 'highlightCode',
    },
    'answer': 'x = x * 5;',
  },
  {
    'exercise': {
      'prompt': 'Write a line of code that doubles the value of x.',
      'code': 'int x = 10;\n/*   */\nSystem.out.println(x);\n\n/* Methods available are as follows:\n\npublic int methodQ(int a) {\n    return a + a + a;\n}\n\npublic int methodB(int a) {\n    return a * (a - 5);\n}\n\npublic int methodZ(int a) {\n    return a * 2;\n}\n\n*/',
      'difficulty': 0,
      'choices': [],
      'concepts': ['methodInvocationExpression'],
      'type': 'fillBlank',
    },
    'answer': 'x = methodZ(x);',
  },
  {
    'exercise': {
      'prompt': 'The following expression evaluates to what value?',
      'code': '1 <= 5;',
      'difficulty': 0,
      'choices': ['1', '5', '6', 'true', 'false'],
      'concepts': ['relationalExpression'],
      'type': 'multipleChoice',
    },
    'answer': 'true',
  },
  {
    'exercise': {
      'prompt': 'Fill in the blank so that the expression evaluates to true.',
      'code': '100.0 /*   */ 100;',
      'difficulty': 0,
      'choices': [],
      'concepts': ['equalityExpression'],
      'type': 'fillBlank',
    },
    'answer': '==',
  },
  {
    'exercise': {
      'prompt': 'What\'s the output of the following code?',
      'code': 'boolean isRed = true;\nboolean isBlue = false;\nSystem.out.println(isRed && isBlue);',
      'difficulty': 0,
      'choices': [],
      'concepts': ['conditionalAndExpression'],
      'type': 'shortResponse',
    },
    'answer': 'false',
  },
  {
    'exercise': {
      'prompt': 'True or False: The first println() outputs something different than the second println().',
      'code': 'boolean x = true;\nboolean y = false;\nSystem.out.println(x || y);\nx = false;\ny = true;\nSystem.out.println(x || y);',
      'difficulty': 0,
      'choices': ['true', 'false'],
      'concepts': ['conditionalOrExpression'],
      'type': 'multipleChoice',
    },
    'answer': 'false',
  }];
export let variable51520 = [
  {
    'exercise': {
      'prompt': 'Fill in the blank so that the method behaves as follows:\naddTen(15); //would evaluate to 25\naddTen(1); //would evaluate to 11',
      'code': 'public int addTen(int a) {\n    /*   */ a + 10;\n}',
      'difficulty': 0,
      'choices': [],
      'type': 'fillBlank',
      'concepts': ['returnStatement'],
    },
    'answer': 'return',
  },{
    'exercise': {
      'prompt': 'Highlight the symbol that assigns the value 7 to the variable.',
      'code': 'int number = 7;',
      'difficulty': 0,
      'choices': [],
      'concepts': ['assignmentOperator'],
      'type': 'highlightCode',
    },
    'answer': '=',
  }
  ,
  {
    'exercise': {
      'prompt': 'Write the code that instantiates an integer array of size 1024. Then, print out its size to the console.',
      'code': '',
      'difficulty': 0,
      'choices': [],
      'concepts': ['arrayCreationExpression'],
      'type': 'writeCode',
    },
    'answer': '1024',
  },
  {
    'exercise': {
      'prompt': 'Write code that instantiates a variable of type double to the value 7. Then, write a statement that prints the variable\'s value if it\'s less than 10, and prints half the variable\'s value otherwise.',
      'code': '',
      'difficulty': 0,
      'choices': [],
      'concepts': ['ifThenElseStatement'],
      'type': 'writeCode',
    },
    'answer': '7',
  }];

export let survey =
    {
      exercise: {
        prompt: 'Take this survey before we begin. Rate how confident you are in your abilities for each concept.',
        code: '',
        // TODO: better survey selection policy (or no survey)
        choices: _.filter(
            _.map(conceptInventory, (c, name: string) => c.container ? name : ''),
            k => k !== ''),
        difficulty: difficulty.low,
        type: ExerciseTypes.survey,
        concepts: [],
      },
      answer: '',
    };

// export const exampleExercises = variable17061.concat(survey, variable18916,
//     variable51520, variable60932, variable88688);

/*
export const oldExampleExercises: {exercise: Exercise, answer: ?string}[] = [
  {
    exercise: {
      prompt: 'Take this survey before we begin. Rate how confident you are in your abilities for each concept.',
      code: '',
      choices: conceptInventory.map((k) => k.name),
      difficulty: difficulty.low,
      type: ExerciseTypes.survey,
      concept: '',
    },
    answer: ''
  },
  {
    exercise: {
      prompt: 'Indicate what the array {6, 3} contents [] would be after the' +
      ' method mystery was called and passed that array as its parameter.',
      code: 'public static void mystery2(int[] list) {\n' +
      '    for (int i = 0; i < list.length - 1; i++) {\n' +
      '        if (i % 2 == 0) {\n' +
      '            list[i]++;\n' +
      '        } else {\n' +
      '            list[i]--;\n' +
      '        }\n' +
      '    }\n' +
      '}',
      difficulty: difficulty.med,
      type: ExerciseTypes.shortResponse,
      concept: g.referenceType
    },
    answer: '[7, 2]'
  },
  { // 
    exercise: {
      prompt: 'What is the value of variable x?',
      code: 'boolean x = 1 != 2',
      choices: ['true', 'false'],
      difficulty: difficulty.high,
      type: ExerciseTypes.multipleChoice,
      concept: g.equalityExpression
    },
    answer: 'true'
  },/*=
  {
    exercise: {
      prompt: 'Write code that assigns the value false to x.',
      code: '',
      difficulty: 1,
      type: ExerciseTypes.writeCode,
      concept: 'boolean'
    },
    answer: undefined
  },
  {
    exercise: {
      prompt: 'Which of the following is a properly reversed version of the' +
      ' following Boolean expression, according to De Morgan\'s Laws?',
      code: '(2 == 3) && (-1 < 5) && isPrime(n)',
      choices: ['(2 != 3) || (-1 >= 5) || !isPrime(n)',
        '(2 == 3) || (-1 < 5) || isPrime(n)',
        '!(2 != 3) || !(-1 < 5) || isNotPrime(n)',
        '(2 != 3) && (-1 > 5) && isPrime(n)',
        '!(2 == 3) && !(-1 < 5) && !isPrime(n)'],
      difficulty: 2,
      type: ExerciseTypes.multipleChoice,
      concept: g.conditionalOrExpression
    },
    answer: '(2 != 3) || (-1 >= 5) || !isPrime(n)'
  },
  {
    exercise: {
      prompt: 'Write the code necessary to increment the value of x.',
      code: 'int x = 1;',
      difficulty: 1,
      type: ExerciseTypes.writeCode,
      concept: g.postIncrementExpression
    },
    answer: 'int x = 1;\nx++;'
  },
  {
    exercise: {
      prompt: 'Fill in the blank so that x is assigned a value.',
      code: 'int x /!*  *!/ 2;',
      difficulty: 2,
      type: ExerciseTypes.fillBlank,
      concept: g.assignmentExpression
    },
    answer: 'int x = 2;'
  },
  {
    // https://practiceit.cs.washington.edu/problem/view/bjp4/chapter2/s12-valueOfX
    exercise: {
      prompt: 'What is the value of variable x after the following code executes?',
      code:
      'int x = 4; \n' +
      'x = x + 2; \n' +
      'x = x + x;',
      choices: ['3', '7', '10', '12'],
      difficulty: 2,
      type: ExerciseTypes.multipleChoice,
      concept: op.add_assign
    },
    answer: '12'
  },
  {
    // https://practiceit.cs.washington.edu/problem/view/bjp4/chapter2/s25-numberTotal
    exercise: {
      prompt: 'What is the output of the following loop?',
      code:
      'int total = 5; \n' +
      'for (int number = 1; number <= (total / 2); number++) { \n' +
      '\t total = total - number; \n' +
      '\t System.out.println(total + " " + number); \n' +
      '}',
      difficulty: 2,
      type: ExerciseTypes.shortResponse,
      concept: g.forStatement
    },
    answer: '4 1\n2 2'
  },
  {
    exercise: {
      prompt: 'What is the value of variable x?',
      code: 'boolean x = 1 <= 2',
      choices: ['true', 'false'],
      difficulty: 0,
      type: ExerciseTypes.multipleChoice,
      concept: g.booleanLiteral
    },
    answer: 'true'
  },
  {
    exercise: {
      prompt: 'Highlight the variable name.',
      code: 'int x = 1;',
      difficulty: 1,
      type: ExerciseTypes.highlightCode,
      concept: g.variableDeclaration
    },
    answer: 'x'
  },
  {
    exercise: {
      prompt: 'Create a new variable x and set its value to 2.',
      code: '',
      difficulty: 1,
      type: ExerciseTypes.writeCode,
      concept: g.assignmentExpression
    },
    answer: 'int x = 2;'
  },
  {
    exercise: {
      prompt: 'Fill in the blank so that x is assigned to true if y is less than 5.',
        code: 'boolean x = 7 5;',
        difficulty: 1,
        type: ExerciseTypes.writeCode,
        concept: g.relationalExpression
    },
    answer: 'boolean x = y < 5;'
  },
  {
    exercise: {
      prompt: 'After the arithmetic operation, what is the value of x?',
      code: 'int x = 5/3;',
      choices: ['3', '5', '1', '2'],
      difficulty: 1,
      type: ExerciseTypes.multipleChoice,
      concept: g.integerLiteral
    },
    answer: '1'
  },
];
*/