// @flow
import ExerciseTypes from './ExerciseTypes.js';

type Exercise = {
  prompt: string,
  code: string,
  choices?: string[],
  difficulty: number,
  type: string,
  exerciseID: string
}

export const exampleExercises: Exercise[] = [
  {
    prompt: 'What is the value of variable x?',
    code: 'boolean x = 1 != 2',
    choices: ['true', 'false'],
    difficulty: 0,
    type: ExerciseTypes.multipleChoice,
    exerciseID: 'a102b',
  },
  {
    prompt: 'Write code that assigns the value false to x.',
    code: '',
    difficulty: 1,
    type: ExerciseTypes.writeCode,
    exerciseID: 'a31415',
  },
/*{
    prompt: 'Write the code necessary to increment the value of x.',
    code: 'int x = 1;',
    type: ExerciseTypes.writeCode,
  },
  {
    prompt: 'Fill in the blank so that x is assigned a value.',
    code: 'int x /!* *!/ 2;',
    type: ExerciseTypes.fillBlank,
  },
  {
    prompt: 'Highlight the variable type in this line of code.',
    code: 'int x = 3;',
    type: ExerciseTypes.highlightCode,
  },g
  {
    // https://practiceit.cs.washington.edu/problem/view/bjp4/chapter2/s12-valueOfX
    prompt: 'What is the value of variable x after the following code executes?',
    code:
    'int x = 4; \n' +
    'x = x + 2; \n' +
    'x = x + x;',
    type: ExerciseTypes.multipleChoice,
    choices: ['3', '7', '10', '12'],
  },
  {
    // https://practiceit.cs.washington.edu/problem/view/bjp4/chapter2/s25-numberTotal
    prompt: 'What is the output of the following loop?',
    code:
    'int total = 5; \n' +
    'for (int number = 1; number <= (total / 2); number++) { \n' +
    '\t total = total - number; \n' +
    '\t System.out.println(total + " " + number); \n' +
    '}',
    type: ExerciseTypes.shortResponse,
  }*/
];
