//@flow

// import typeof doesn't agree with Flow for some reason:
//   https://flow.org/en/docs/types/modules/
// So, we import all of ResponseObject
import {ResponseLog, ResponseObject} from '../data/ResponseLog';
import {MasteryModel} from '../data/MasteryModel';
import ExercisePool from '../data/ExercisePool';
import ExerciseTypes from '../data/ExerciseTypes';
import {BayesKT} from './BKT.js';
import type {Exercise} from '../data/Exercises';

class ResponseEvaluator {
  /**
   * Takes in a relevant set of responses, and a weight that scales how strong
   * of a differential would be required to reach a level of certainty that the
   * student has learned a concept.
   * f(x) = -k/(x+k) + 1, where k is the weight value.
   * @param concept
   * @param responses
   * @returns {number}
   */
  static multiplicativeInverseMethod(responses: ResponseObject[]) {
    let correct = responses.filter((r) => r.correct === true).length;
    let wrong = responses.length - correct;
    let difference = correct - wrong;
    let weight = 2;
    return difference < 0 ? 0 : ( -1 * weight) / (difference + weight) + 1;
  }

  /**
   * Uses Bayesian Knowledge Tracing to update knowledge value.
   * @param response
   * @returns {number}
   * @constructor
   */
  static BKT(response: ResponseObject) {
    let concept = response.concept;
    let ck = MasteryModel.modelMap.get(concept);
    let knowledge = !(ck === null || ck === undefined) ? ck.getKnowledge() : 0.01;
    return BayesKT.learned(knowledge, response);
  }

  /**
   * Calculates certainty of knowing given a method.
   * @param response
   * @param method
   * @returns {*}
   */
  static calculateCertainty(response: ResponseObject, method: Function) {
    return method(response);
  }

  /**
   * Calculates certainty using specific analysis method.
   * @param response
   * @returns {number}
   */
  static analyzeLog(response: ResponseObject): number {
    return this.calculateCertainty(response, this.BKT);
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

    //Debug for demo
    console.groupCollapsed("Response Log");
    console.log(ResponseLog.log);
    console.groupEnd();

    if (ExerciseTypes.isSurvey(exercise.type)) {
      MasteryModel.surveyUpdateModel(Array.from(answer).map(x =>
          parseInt(x, 10),
      ));
    } else {
      MasteryModel.updateModel(
          exercise.concept,
          ResponseEvaluator.analyzeLog(ResponseLog.getLastElement()),
      );
    }

    this.printImportantStuff(); //Debug/demo
  }

  /**
   * Debugging method for quick analysis of CK behavior through console
   */
  static printImportantStuff() {
    console.groupCollapsed("Response Evaluator");
    console.log(MasteryModel.model);
    MasteryModel.model.forEach((m) => {
      console.log(m.name + '\n\tk: ' + m.knowledge + '\n\tdk: ' +
          m.dependencyKnowledge + '\n\t#d: ' + m.dependencies.length);
    });
    console.groupEnd();
  }
}

export default ResponseEvaluator;