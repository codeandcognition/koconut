/**
 * Created by alextan on 7/12/17.
 */
/**
 * Defines all available question types.
 * Provides logic to determine whether the question is an inline response type.
 */
class QuestionTypes {

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
    return type === QuestionTypes.writeCode ||
        type === QuestionTypes.fillBlank ||
        type === QuestionTypes.highlightCode;
  }
}

export default QuestionTypes;