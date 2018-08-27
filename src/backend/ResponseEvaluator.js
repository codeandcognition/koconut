//@flow

// import typeof doesn't agree with Flow for some reason:
//   https://flow.org/en/docs/types/modules/
// So, we import all of ResponseObject
import {ResponseLog, ResponseObject} from '../data/ResponseLog';
import {MasteryModel} from '../data/MasteryModel';
import ExerciseTypes from '../data/ExerciseTypes';
import {BayesKT} from './BKT.js';
import type {Exercise} from '../data/Exercises';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
//

const Sk = require('skulpt');

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
   * runCode will run the code provided in a python interpreter (Skulpt)
   * Most of this code comes from Skulpt's examples. Documentation for this
   * will be in the docs folder.
   * @param code input python code as a string
   * @returns {string} python std output as a string
   */
  static runCode(code: string): string {
    function builtinRead(x) {
      if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
          throw new Error("File not found: '" + x + "'");
      return Sk.builtinFiles["files"][x];
    }
    let output = [];
    Sk.configure({output: d => output.push(d), read: builtinRead});
    try {
      Sk.importMainWithBody("<stdin>", false, code);
    } catch(e) {
      return e.toString();
    }
    return output.join("").trim();
  }

  /**
   * Takes in an exercise and student response to update log and mastery model.
   * @param exercise
   * @param answer
   * @param next - callback to be executed after evaluation
   * @param questionIndex - index of question being evaluated
   * @param questionType - OPTIONAL, for special new types (table and selectMultiple)
   * @param feedback - OPTIONAL, for special new types (table and selectMultiple)
   * @param exerciseId - OPTIONAL, exercise Id, for firebase logging
   */
  static evaluateAnswer(exercise: Exercise, answer: string, next: Function, questionIndex: number,
                        questionType: any, feedback: any, exerciseId: any) {
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
      /*console.groupCollapsed("Response Log");
      console.log(ResponseLog.log);
      console.groupEnd();*/

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

      let dataToPush = {
        exerciseId,
        questionIndex,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        answer: answer[questionIndex],
        correctness: isCorrect
      };
      let uid = firebase.auth().currentUser;
      if (uid) {
        uid = uid.uid; // makes flow happier, don't wanna worry about it right now
      }

      firebase.database().ref(`/Users/${uid?uid:'nullValue'}/Data/AnswerSubmission`).push(dataToPush);


      // this.printImportantStuff(); //Debug/demo
      next();
    };

    // actual logic
    // it's backwards, I know :(
    if(exercise.questions[questionIndex].type === ExerciseTypes.writeCode ||
       exercise.questions[questionIndex].type === ExerciseTypes.fillBlank) {
      let executedAnswer = this.runCode(answer[questionIndex]);
      addResponseAndUpdate(executedAnswer === exercise.questions[questionIndex].answer, exercise);
    } else {
      let gotCorrect = true;
      if(questionType === "table") {
        feedback[questionIndex].forEach((d) => {
          // console.log(d);
          d && d.forEach((e) => {
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