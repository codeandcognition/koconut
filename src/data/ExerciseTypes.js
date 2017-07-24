/**
 * Defines all available exercise types.
 * Provides logic to determine whether the exercise is an inline response type.
 * @class
 */
class ExerciseTypes {
  /**
   * Determines whether the exercise type is an inline exercise type.
   * An inline exercise type requires displaying only the code component,
   * rather than the code and response component.
   * @param type - the exercise type
   * @returns whether or not the exercise type requires inline responding
   */
  static isInlineResponseType = function(type: string): boolean {
    return type === this.writeCode ||
        type === this.fillBlank ||
        type === this.highlightCode;
  };
}

ExerciseTypes.writeCode = 'writeCode';
ExerciseTypes.fillBlank = 'fillBlank';
ExerciseTypes.highlightCode = 'highlightCode';
ExerciseTypes.multipleChoice = 'multipleChoice';
ExerciseTypes.shortResponse = 'shortResponse';

export default ExerciseTypes;
