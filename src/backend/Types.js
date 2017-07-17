/**
 * Defines all available question types.
 * Provides logic to determine whether the question is an inline response type.
 * @class
 */
class QuestionTypes {
  /**
   * Determines whether the question type is an inline question type.
   * An inline question type requires displaying only the code component,
   * rather than the code and response component.
   * @param type - the question type
   * @returns whether or not the question type requires inline responding
   */
  static isInlineResponseType = function(type: string):boolean {
    return type === this.writeCode||
        type === this.fillBlank ||
        type === this.highlightCode;
  }
}

QuestionTypes.writeCode = 'WriteCode';
QuestionTypes.fillBlank = 'FillBlank';
QuestionTypes.highlightCode = 'HighlightCode';
QuestionTypes.multipleChoice = 'MultipleChoice';
QuestionTypes.shortResponse = 'ShortResponse';

export default QuestionTypes;
