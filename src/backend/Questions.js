// @flow

/**
 * Defines all available question types.
 * Provides logic to determine whether the question is an inline response type.
 */

class Questions {

  static writeCode: 'WriteCode';
  static fillBlank: 'FillBlank';
  static highlightCode: 'HighlightCode';
  static multipleChoice: 'MultipleChoice';
  static shortResponse: 'ShortResponse';

  /**
   * Determines whether the question type is an inline question type.
   * An inline question type requires displaying only the code component,
   * rather than the code and response component.
   * @param type - the question type
   * @returns whether or not the question type requires inline responding
   */
  static isInlineResponseType = function(type: string):boolean {
    return type === Questions.writeCode ||
        type === Questions.fillBlank ||
        type === Questions.highlightCode;
  }

  static exampleQuestions: {
    prompt: string, code: string, type: string, answers?: string[],
  }[] = [
    {
      prompt: 'Write the code necessary to increment the value of x.',
      code: 'int x = 1;',
      type: Questions.writeCode,
    },
    {
      prompt: 'Fill in the blank so that x is assigned a value.',
      code: 'int x [text area] 2;',
      type: Questions.fillBlank,
    },
    {
      prompt: 'Highlight the variable type in this line of code.',
      code: 'int x = 3;',
      type: Questions.highlightCode,
    },
    {
      prompt: 'What is the value of x after code execution?',
      code: 'int x = 4;',
      type: Questions.multipleChoice,
      answers: ['1', '5', '10', '100'],
    },
    {
      prompt: 'What is the variable name of the integer?',
      code: 'int x = 5;',
      type: Questions.shortResponse,
    }];
}

export default {Questions};
