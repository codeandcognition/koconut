// @flow
import QuestionTypes from './Types.js';

export const exampleQuestions = [
  {
    prompt: 'Write the code necessary to increment the value of x.',
    code: 'int x = 1;',
    type: QuestionTypes.writeCode,
  },
  {
    prompt: 'Fill in the blank so that x is assigned a value.',
    code: 'int x /* */ 2;',
    type: QuestionTypes.fillBlank,
  },
  {
    prompt: 'Highlight the variable type in this line of code.',
    code: 'int x = 3;',
    type: QuestionTypes.highlightCode,
  },
  {
    // https://practiceit.cs.washington.edu/problem/view/bjp4/chapter2/s12-valueOfX
    prompt: 'What is the value of variable x after the following code executes?',
    code:
      'int x = 4; \n' +
      'x = x + 2; \n' +
      'x = x + x;',
    type: QuestionTypes.multipleChoice,
    answers: ['3', '7', '10', '12'],
  },
  {
    // https://practiceit.cs.washington.edu/problem/view/bjp4/chapter2/s25-numberTotal
    prompt: 'What is the output of the following loop?',
    code:
      'int x = 5; \n' +
      'for (int number = 1; number <= (total / 2); number++) { \n' +
      '\t total = total - number; \n' +
      '\t System.out.println(total + " " + number); \n' +
      '}',
    type: QuestionTypes.shortResponse,
  }];
