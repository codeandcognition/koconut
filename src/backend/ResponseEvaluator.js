//@flow

// import typeof doesn't agree with Flow for some reason:
//   https://flow.org/en/docs/types/modules/
// So, we import all of ResponseObject
import {ResponseLog, ResponseObject} from '../data/ResponseLog';
import {MasteryModel} from '../data/MasteryModel';
import ExerciseTypes from '../data/ExerciseTypes';
import {BayesKT} from './BKT.js';
import type {Exercise} from '../data/Exercises';

/**
 * Evaluates and calculates correctness of a student response, and the
 * probability that their response indicates knowing a concept
 * @class
 */
class ResponseEvaluator {
  /**
   * Takes in a relevant set of responses, and a weight that scales how strong
   * of a differential would be required to reach a level of certainty that the
   * student has learned a concept.
   * f(x) = -k/(x+k) + 1, where k is the weight value.
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
  static BKT(response: ResponseObject): number[] {
    let concepts = response.concepts;
    let ck = concepts.map((concept) => {
      return MasteryModel.modelMap.get(concept);
    });
    return ck.map((val) => {
      let knowledge = !(val === null || val === undefined) ? val.getKnowledge() : 0.01;
      return BayesKT.learned(knowledge, response);
    });
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
   * @returns {number[]}
   */
  static analyzeLog(response: ResponseObject): number[] {
    return this.calculateCertainty(response, this.BKT);
  }

  /**
   * Send a POST request to the API to compile and execute the given Java code
   * @param code - the Java code to compile and execute
   */
  static executeJava(code: string): Promise<Object> {
    return fetch('/api/java', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: 'replacemelater', // TODO: Actually get an id
        content: code,
      })
    });
  }

  /**
   * Takes in an exercise and student response to update log and mastery model.
   * @param exercise
   * @param answer
   * @param next - callback to be executed after evaluation
   * @param questionIndex - index of question being evaluated
   * @param questionType - OPTIONAL, for special new types (table and selectMultiple)
   * @param feedback - OPTIONAL, for special new types (table and selectMultiple)
   */
  static evaluateAnswer(exercise: Exercise, answer: string, next: Function, questionIndex: number,
                        questionType, feedback) {
    // no one can escape asyncronous programming!!!!
    // >:D

    // wrap it in a function for async
    let addResponseAndUpdate = (isCorrect, exercise) => {
      ResponseLog.addResponse( // TODO: replace '123' with a real ID
          '123', exercise.concepts,
            exercise.questions[questionIndex].type,
            exercise.questions[questionIndex].difficulty, isCorrect,
          Date.now(),
      );

      //Debug for demo
      console.groupCollapsed("Response Log");
      console.log(ResponseLog.log);
      console.groupEnd();

      if (ExerciseTypes.isSurvey(exercise.questions[questionIndex].type)) {
        MasteryModel.surveyUpdateModel(Array.from(answer).map(x =>
            parseInt(x, 10),
        ));
      } else {
        MasteryModel.updateModel(
            exercise.concepts,
            ResponseEvaluator.analyzeLog(ResponseLog.getLastElement()),
        );
      }

      this.printImportantStuff(); //Debug/demo
      next();
    };

    // actual logic
    // it's backwards, I know :(
    if(exercise.questions[questionIndex].type === ExerciseTypes.writeCode ||
       exercise.questions[questionIndex].type === ExerciseTypes.fillBlank) {
      this.executeJava(answer)//ExercisePool.getAnswer(exercise);
      .then((res) => {
        return res.json();
      }).then((json) => {
        console.log(json);
        addResponseAndUpdate(json.stdout === exercise.questions[questionIndex].answer, exercise);
      }).catch((err) => {
        console.log(err);
        addResponseAndUpdate(false, exercise); // TODO: remove hardcode
      });
    } else {
      let gotCorrect = true;
      if(questionType === "table") {
        feedback.forEach((d) => {
          d.forEach((e) => {
            if(e === "incorrect") {
              gotCorrect = false;
            }
          })
        })
      } else {
        answer = exercise.questions[questionIndex].answer;
      }
      addResponseAndUpdate(gotCorrect, exercise);
    }
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