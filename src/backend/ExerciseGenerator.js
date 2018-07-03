// @flow
import {exampleExercises, stubExercise} from '../data/Exercises.js';
import ExerciseTypes from '../data/ExerciseTypes.js';
import ExercisePool from '../data/ExercisePool';
import conceptInventory from '../data/ConceptMap';

import type {Exercise} from '../data/Exercises.js';

// import typeof doesn't agree with Flow for some reason:
//   https://flow.org/en/docs/types/modules/
// So, we import all of ConceptKnowledge
import {ConceptKnowledge, MasteryModel} from '../data/MasteryModel';

var exercises = require('../data/Exercises');

/**
 * Generates exercises associated with concepts
 * @class
 */
class ExerciseGenerator {
  counter: number;

  constructor() {
    this.counter = 0;
  }

  /**
   * Returns and array of exercises for the given exercise type and concept
   * @param exerciseType - String ("READ" or "WRITE")
   * @param concept - String (Camel Cased)
   */
  getExercisesByTypeAndConcept(exerciseType: string, concept: string, exerciseList: ?Exercise[], conceptMapGetter: ?Map<string,number[]>) {
    // Deprecated
    // var exerciseInventory = [exercises.variable17061, exercises.variable18916, exercises.variable51520,
    //   exercises.variable60932, exercises.variable88688]; // Add variable to this array as exercise inventory grows
    // var exerciseList = [];
    // for (var i = 0; i < exerciseInventory.length; i++) {
    //   exerciseList = exerciseList.concat(exerciseInventory[i]);
    // }
    console.log("getex", exerciseList);
    var results = [];
    var readTypes = ["highlightCode", "multipleChoice", "shortResponse"];
    exerciseList.forEach((item) => {
      if (item.exercise.concepts.includes(concept)) {
        if ((exerciseType === "READ" && readTypes.includes(item.exercise.type)) ||
            (exerciseType === "WRITE" && !readTypes.includes(item.exercise.type))) {
            results.push(item);
        }
      }
    });
    return results;
  }


  /**
   * Gives optimal index of the next concept to generate questions for.
   * Index is based on a list of concepts, sorted in this order:
   * least mastered -> most mastered
   * @param concepts
   * @param method
   * @returns {number}
   */
  getConceptIndex(concepts: ConceptKnowledge[], method: Function): number {
    if (concepts.length > 0) {
      let min = concepts[0].knowledge;
      let max = concepts[concepts.length - 1].knowledge;
      return Math.floor(method(max, min) * concepts.length);
    }
    return 0;
  }

  /**
   * Returns sorted concepts list sorted by relevance to the user.
   * @returns {Array.<*>}
   */
  getOrderedConcepts(): ConceptKnowledge[] {
    return MasteryModel.model.filter((concept) => concept.teach).sort(
        (a, b) => (b.dependencyKnowledge / b.knowledge -
        a.dependencyKnowledge / a.knowledge));
  }

  /**
   * Get a stub exercise defined in Exercises.js
   * @returns {Exercise} stub exercise
   */
  getStubExercise() : Exercise {
    return stubExercise;
  }

  /**
   * Returns the first N most relevant concepts. Relevance determined
   * by getOrderedConcepts() algorithm.
   * @param size
   * @returns {Array.<ConceptKnowledge>}
   */
  getConcepts(size: number): string[] {
    return this.getOrderedConcepts().slice(0, size).map((c) => c.name);
  }

  getConceptsRelativeTo(concept: string): string[] {
    console.log('relative to ' + concept);
    let ck = MasteryModel.model.filter((c) => c.name === concept)[0];
    return [this.getHarderConcept(ck), this.getEasierConcept(ck),
            this.getNewerConcept(ck), concept];
  }

  filterShouldTeach(concepts: ConceptKnowledge[]): ConceptKnowledge[] {
    return concepts.filter((c) => conceptInventory[c.name].should_teach);
  }
  
  getHarderConcept(concept: ConceptKnowledge) {
    if(!concept) return '';
    let chosen = concept.parents.sort(
        (a, b) => a.dependencyKnowledge - b.dependencyKnowledge);
    chosen = this.filterShouldTeach(chosen)[0];
    return chosen ? chosen.name : '';
  }

  getEasierConcept(concept: ConceptKnowledge) {
    if(!concept) return '';
    let chosen = concept.dependencies.sort(
        (a, b) => a.knowledge - b.knowledge);
    chosen = this.filterShouldTeach(chosen)[0];
    return chosen ? chosen.name : '';
  }
  
  getNewerConcept(concept: ConceptKnowledge) {
    let chosen = this.getOrderedConcepts().filter((c) => c !== concept);
    return this.filterShouldTeach(chosen)[0].name;
  }

  /**
   * Returns the most relevant concept. Relevance determined by
   * getOrderedConcepts() algorithm.
   * @returns an exercise concept
   */
  getConcept(): string {
    return this.getConcepts(1)[0];
  }

  /**
   * Returns an exercise type, pulled from exercise type inventory.
   * @returns an exercise type
   */
  getType(): string {
    let types = Object.keys(ExerciseTypes).filter(
        (obj) => typeof ExerciseTypes[obj] !== 'function',
    );
    return types[Math.floor(Math.random() * types.length)];
  }

  /**
   * Returns a generated Exercise
   * @param concept - specifies a concept type if provided
   * @returns a generated Exercise
   */
  generateExercise(concept: ?string) {
    //First exercise to pass is initial survey
    // TODO: This is probably bad architecture
    if(this.counter === 0) {
      let ret = exampleExercises.filter(
          (e) => e.exercise.type === ExerciseTypes.survey)[0].exercise;
      // need to increment
      this.counter += 1;

      console.log(ret);
      return ret;
    }

    // Retrieves a concept if not provided
    if(typeof concept !== 'string') {
      concept = this.getConcept();
    }

    // let type = this.getType();
    let exercisePool = exampleExercises.filter(
      (e) => {
        if(typeof concept === 'string') {
          return e.exercise.concepts.includes(concept);
        } else {
          return false;
        }
      },
    );

    let exercise;
    if(exercisePool.length > 0) {
      exercise = exercisePool[Math.floor(Math.random() * exercisePool.length)];
    } else {
      exercise = stubExercise;
      exercise.exercise.concepts = [concept];
    }
    this.counter += 1;
    ExercisePool.addExercise(exercise.exercise, exercise.answer);
    return exercise.exercise;
  }

  /**
   * Gets a specific exercise from the example exercises
   * For DEBUG eyes only 👀
   * @param index - the exercise index to retrieve
   * @private
   * @returns the exercise at the given index (wraps around if index > size)
   */
  _generateExercise(index: number) {
    let exercise = exampleExercises[index % exampleExercises.length];
    ExercisePool.addExercise(exercise.exercise, exercise.answer);
    return exercise.exercise;
  }

}

export default ExerciseGenerator;