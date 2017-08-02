// @flow
import ExerciseTypes from './ExerciseTypes.js';

export type Exercise = {
  prompt: string,
  code: string,
  choices?: string[],
  difficulty: number,
  type: string,
  concept: string
}

const difficulty = {
  low: 0,
  med: 1,
  high: 2
}

const _c = {
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
}
// const F_LOOP = 'for loops';
// const _B_OP = 'boolean operators';
// const E_OP = 'equality operators';
// const R_OP = 'relational operators';
// const C_OP = 'conditional operators';
// const _A_OP = 'assignment operators';
// const _VAR = 'variables';
// const REF = 'reference types';
// const PRIM = 'primitive types';
// const A_OP = 'assignment operator';
// const AA_OP = 'arithmetic-assignment operators';
// const ARITH = 'arithmetic';

export const exampleExercises: {exercise: Exercise, answer: ?string}[] = [
  {
    exercise: {
    prompt: 'Take this survey before we begin. Rate how confident you are in your abilities for each concept.',
      code: '',
      choices: Object.values(_c),
      difficulty: difficulty.low,
      type: ExerciseTypes.survey,
      concept: null,
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
      concept: _c.REF,
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
      concept: _c.E_OP
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
  },*/
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
      concept: _c.C_OP
    },
    answer: '(2 != 3) || (-1 >= 5) || !isPrime(n)'
  },
  {
    exercise: {
      prompt: 'Write the code necessary to increment the value of x.',
      code: 'int x = 1;',
      difficulty: 1,
      type: ExerciseTypes.writeCode,
      concept: _c.AA_OP
    },
    answer: undefined
  },
  {
    exercise: {
      prompt: 'Fill in the blank so that x is assigned a value.',
      code: 'int x /!*  *!/ 2;',
      difficulty: 2,
      type: ExerciseTypes.fillBlank,
      concept: _c._A_OP
    },
    answer: '='
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
      concept: _c.ARITH
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
      concept: _c.F_LOOP
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
      concept: _c._B_OP
    },
    answer: 'true'
  },
  {
    exercise: {
      prompt: 'Highlight the variable name.',
      code: 'int x = 1;',
      difficulty: 1,
      type: ExerciseTypes.highlightCode,
      concept: _c._VAR
    },
    answer: 'x'
  },
  {
    exercise: {
      prompt: 'Create a new variable x and set its value to 2.',
      code: 'int x = 2;',
      difficulty: 1,
      type: ExerciseTypes.writeCode,
      concept: _c.A_OP
    },
    answer: 'x'
  },
    {
      exercise: {
        prompt: 'Fill in the blank that x is less than y.',
          code: 'int x /!*  *!/ y;',
          difficulty: 1,
          type: ExerciseTypes.writeCode,
          concept: _c.R_OP
      },
      answer: 'x'
    },
];
