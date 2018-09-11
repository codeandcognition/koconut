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
    return type === this.writeCode || type === this.fillBlank;
  };

  /**
   * Determines whether the exercise type is a survey.
   * @param type
   * @returns {boolean}
   */
  static isSurvey = function(type: string): boolean {
    return type === this.survey;
  };

  /**
   * Determines whether the exercise type is a read type
   * @param type
   * @returns {boolean}
   */
  static isReadType = function(type: string): boolean {
    return this.readTypes.includes(type);
  }
}

ExerciseTypes.survey = 'survey'; // Survey is just another type of exercise
ExerciseTypes.writeCode = 'writeCode';
ExerciseTypes.fillBlank = 'fillBlank';
ExerciseTypes.highlightCode = 'highlightCode';
ExerciseTypes.multipleChoice = 'multipleChoice';
ExerciseTypes.checkboxQuestion = 'checkboxQuestion';
ExerciseTypes.shortResponse = 'shortResponse';
ExerciseTypes.table = 'table';
ExerciseTypes.selectMultiple = 'selectMultiple';
ExerciseTypes.memoryTable = 'memoryTable'; // TODO: decide if this is of type read or write
ExerciseTypes.readTypes = ["highlightCode", "multipleChoice", "shortResponse", "table", "selectMultiple"]; // Can probably define this based on the above, but it's fine for now

export default ExerciseTypes;
