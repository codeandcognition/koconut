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

export const exampleExercises: {exercise: Exercise, answer: ?string}[] = [
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
      difficulty: 2,
      type: ExerciseTypes.shortResponse,
      concept: REF,
    },
    answer: '[7, 2]'
  },*/
  { // 
    exercise: {
      prompt: 'What is the value of variable x?',
      code: 'boolean x = 1 != 2',
      choices: ['true', 'false'],
      difficulty: 0,
      type: ExerciseTypes.multipleChoice,
      concept: E_OP
    },
    answer: 'true'
  },/*
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
      concept: C_OP
    },
    answer: '(2 != 3) || (-1 >= 5) || !isPrime(n)'
  },
  {
    exercise: {
      prompt: 'Write the code necessary to increment the value of x.',
      code: 'int x = 1;',
      difficulty: 1,
      type: ExerciseTypes.writeCode,
      concept: AA_OP
    },
    answer: undefined
  },
  {
    exercise: {
      prompt: 'Fill in the blank so that x is assigned a value.',
      code: 'int x /!*  *!/ 2;',
      difficulty: 2,
      type: ExerciseTypes.fillBlank,
      concept: _A_OP
    },
    answer: '='

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
      concept: ARITH
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
      '\t total =   },\n' +
      '  {\n' +
      '    exercise: {\n' +
      '      prompt: \'Highlight the variable type in this line of code.\',\n' +
      '      code: \'int x = 3;\',\n' +
      '      difficulty: 1,\n' +
      '      type: ExerciseTypes.highlightCode,\n' +
      '      concept: \'PRIM\'\n' +
      '    },\n' +
      '    answer: \'int\'\n' +
      '  },total - number; \n' +
      '\t System.out.println(total + " " + number); \n' +
      '}',
      difficulty: 2,
      type: ExerciseTypes.shortResponse,
      concept: F_LOOP
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
      concept: _B_OP
    },
    answer: 'true'
  },
  {
    exercise: {
      prompt: 'Highlight the variable name.',
      code: 'int x = 1;',
      difficulty: 1,
      type: ExerciseTypes.highlightCode,
      concept: _VAR
    },
    answer: 'x'
  },
  {
    exercise: {
      prompt: 'Create a new variable x and set its value to 2.',
      code: 'int x = 2;',
      difficulty: 1,
      type: ExerciseTypes.writeCode,
      concept: A_OP
    },
    answer: 'x'
  },
    {
      exercise: {
        prompt: 'Fill in the blank that x is less than y.',
          code: 'int x /!*  *!/ y;',
          difficulty: 1,
          type: ExerciseTypes.writeCode,
          concept: R_OP
      },
      answer: 'x'
    },
];
