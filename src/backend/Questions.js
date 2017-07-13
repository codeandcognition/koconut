// @flow
import QuestionTypes from './Types.js';

class Questions {

  static exampleQuestions: {
    prompt: string, code: string, type: string, answers?: string[],
  }[] = [
    {
      prompt: 'Write the code necessary to increment the value of x.',
      code: 'int x = 1;',
      type: QuestionTypes.writeCode,
    },
    {
      prompt: 'Fill in the blank so that x is assigned a value.',
      code: 'int x [text area] 2;',
      type: QuestionTypes.fillBlank,
    },
    {
      prompt: 'Highlight the variable type in this line of code.',
      code: 'int x = 3;',
      type: QuestionTypes.highlightCode,
    },
    {
      prompt: 'What is the value of x after code execution?',
      code: 'int x = 4;',
      type: QuestionTypes.multipleChoice,
      answers: ['1', '5', '10', '100'],
    },
    {
      prompt: 'What is the variable name of the integer?',
      code: 'int x = 5;',
      type: QuestionTypes.shortResponse,
    }];
}

export default Questions;
