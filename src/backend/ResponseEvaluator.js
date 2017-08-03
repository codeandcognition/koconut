//@flow

// import typeof doesn't agree with Flow for some reason:
//   https://flow.org/en/docs/types/modules/
// So, we import all of ResponseObject
import {ResponseLog, ResponseObject} from '../data/ResponseLog';
import {MasteryModel} from '../data/MasteryModel';
import ExercisePool from '../data/ExercisePool';
import ExerciseTypes from '../data/ExerciseTypes';
import type {Exercise} from '../data/Exercises';

const certaintyWeight = 2; //TODO: Each concept should its own value.

class ResponseEvaluator {
  /**
   * Takes in a relevant set of responses, and a weight that scales how strong
   * of a differential would be required to reach a level of certainty that the
   * student has learned a concept.
   * f(x) = -k/(x+k) + 1, where k is the weight value.
   * @param responses
   * @param weight
   * @returns {number}
   */
  static multiplicativeInverseMethod(
      responses: ResponseObject[], weight: number) {
    let correct = responses.filter((r) => r.correct === true).length;
    let wrong = responses.length - correct;
    let difference = correct - wrong;
    return difference < 0 ? 0 : ( -1 * weight) / (difference + weight) + 1;
  }

  /**
   * Takes in a relevant set of responses, and a function that calculates the
   * knowledge value of that concept. Assigns that value to the mastery model.
   * @param responses
   * @param method
   * @returns {*}
   */
  static calculateCertainty(responses: ResponseObject[], method: Function) {
    return method(responses, certaintyWeight);
  }

  /**
   * Takes in a concept, analyzes user log, and performs analysis of user
   * performance to reach conclusion about user knowing a concept.
   * @param concept
   * @returns {number}
   */
  static analyzeLog(concept: string): number {
    let responsesWithConcept = ResponseLog.log.filter(
        (res) => res.concept === concept);
    let val = this.calculateCertainty(responsesWithConcept,
        this.multiplicativeInverseMethod);
    return val > 1 ? 1 : val;
  }

  /**
   * TODO: Make this have logic.
   * Takes in an exercise and student response to update log and mastery model.
   * @param exercise
   * @param answer
   */
  static evaluateAnswer(exercise: Exercise, answer: string) {

    // TODO: Check written answers for correctness (currently always false)
    let isCorrect = answer === ExercisePool.getAnswer(exercise);
    ResponseLog.addResponse(
        '123', exercise.concept, exercise.type, exercise.difficulty, isCorrect,
        Date.now(),
    );
    // console.log(ResponseLog.log); //Debug/demo

    if (ExerciseTypes.isSurvey(exercise.type)) {
      MasteryModel.surveyUpdateModel(Array.from(answer).map(x =>
          parseInt(x, 10),
      ));
    } else {
      MasteryModel.updateModel(
          exercise.concept, ResponseEvaluator.analyzeLog(exercise.concept),
      );
    }

    this.printImportantStuff(); //Debug/demo
  }

  /**
   * Debugging method for quick analysis of CK behavior through console
   */
  static printImportantStuff() {
    console.log(MasteryModel.model);
    MasteryModel.model.forEach((m) => {
      console.log(m.name + '\n\tk: ' + m.knowledge + '\n\tdk: ' +
          m.dependencyKnowledge + '\n\t#d: ' + m.dependencies.length);
    });
  }
}

export default ResponseEvaluator;