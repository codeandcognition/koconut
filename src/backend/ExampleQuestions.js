// @flow
class Questions {

  constructor() {

  }

  static questionTypes: {
    writeCode: string,
    fillBlank: string,
    highlightCode: string,
    multipleChoice: string,
    shortResponse: string,
  } = {
    writeCode: 'WriteCode',
    fillBlank: 'FillBlank',
    highlightCode: 'HighlightCode',
    multipleChoice: 'MultipleChoice',
    shortResponse: 'ShortResponse',
  };

  static exampleQuestions:
    [{
      content: string, code: string, type: string, answers: string[],
    }] = [{
        content: 'Write the code necessary to increment the value of x.',
        code: 'int x = 1;',
        type: Questions.questionTypes.writeCode,
      },
      {
        content: 'Fill in the blank so that x is assigned a value.',
        code: 'int x [text area] 2;',
        type: Questions.questionTypes.fillBlank,
      },
      {
        content: 'Highlight the variable type in this line of code.',
        code: 'int x = 3;',
        type: Questions.questionTypes.highlightCode,
      },
      {
        content: 'What is the value of x after code execution?',
        code: 'int x = 4;',
        type: Questions.questionTypes.multipleChoice,
        answers: ['1', '5', '10', '100'],
      },
      {
        content: 'What is the variable name of the integer?',
        code: 'int x = 5;',
        type: Questions.questionTypes.shortResponse,
      }];
}

export {Questions};
