/*
 * ModelUpdater handles updates (e.g. on exercise on submit) for user/learner model
 */

import {REC_RESPONSES} from './../utils/Conditions';
import _ from 'lodash';

// const BKT_ENDPOINT = `http://127.0.0.1:5000/bkt`; // TODO for prod: change URL
const BKT_ENDPOINT = `https://codeitz.herokuapp.com/bkt`;

const BKT_PARAMS = {
    PKNOWN: "pKnown",
    TRANSFER: "transfer"
}

const BKT_ITEM_PARAMS = {
    SLIP: "slip",
    GUESS: "guess",
    EID: "eid",
    CONCEPT: "concept"
}

// thresholds for recommendations
const THRESHOLDS = {
    MIN_INSTRUCTIONS_READ: 1,
    PK_THRESHOLD: 0.5
}

const READ = 'READ';
const WRITE = 'WRITE';

class ModelUpdater {
    conceptParameters: any;
    exerciseParameters: any;
    priorPKnown: any;
    conceptExerciseMap: any;
    maxNumRecommendations: any;
    currentConcept: any;
    conceptMap: any;

    constructor(conceptParameters: any, exerciseParameters: any, priorPKnown: any, conceptExerciseMap, conceptMap: any) {
        this.conceptParameters = conceptParameters;
        this.exerciseParameters = exerciseParameters; // key: exerciseID, value: object w/ bkt params ('guess', 'slip')
        this.priorPKnown = priorPKnown;
        this.conceptExerciseMap = conceptExerciseMap;
        this.conceptMap = conceptMap;
    }

    // @flow
    /**
     * isCorrect: true if exercise attempt was _entirely_ correct
     * exerciseID: string of exercise identifier
     * conceptKey: string of concept identifier
     * readOrWrite: READ if exercise for reading and WRITE if writing exercise
     * questionIndex: n-th question in exercise
     * userAnswer: answer response
     * instructionsRead: object w/ instructions user has read
     * exercisesCompleted: object with all exercises user has gotten correct
     * callback: function to call after making request
     * recommendComplete: true if recommendations should include previously completed exercises (default is false)
     */
    update = async (isCorrect: boolean, exerciseID: string, conceptKey: string, readOrWrite: string, questionIndex: Number, 
        userAnswer: string, instructionsRead: any, exercisesCompleted: any, callback: Function, recommendComplete = false) => {
        let exerciseIDs = [];
        let conceptParams = this.conceptParameters[conceptKey];
        let itemParams = [];

        // populate itemParams
        Object.keys(this.conceptExerciseMap).forEach((concept) => {
            [READ, WRITE].forEach(readOrWrite => {
                let allExerciseIds = this.conceptExerciseMap[concept][readOrWrite];
                allExerciseIds.forEach((eid) => {
                    let params = this.exerciseParameters[eid];
                    let exerciseComplete = (exercisesCompleted && Object.keys(exercisesCompleted).includes(concept) && exercisesCompleted[concept].includes(eid));
                    if (params) {
                        params[BKT_ITEM_PARAMS.EID] = eid;
                        params[BKT_ITEM_PARAMS.CONCEPT] = concept;
                        itemParams.push(params);
                        if(recommendComplete || (!recommendComplete && !exerciseComplete)) { // don't recommend completed exercises is recommendComplete flag set to false
                            exerciseIDs.push(eid);
                        }
                    }
                });
            });
        });

        let pKnown = this.priorPKnown[conceptKey][readOrWrite][BKT_PARAMS.PKNOWN]; // get prior

        // compose request body
        let requestParams = {
            isCorrect: isCorrect,
            exerciseID: exerciseID,
            exerciseIDs: exerciseIDs,
            transfer: conceptParams[readOrWrite].transfer,
            itemParams: itemParams,
            readOrWrite: readOrWrite == READ ? true : false,
            priorPknown: pKnown,
            conceptMap: this.conceptMap,
            targetConcept: conceptKey
        };

        let response = await this.request(requestParams);
        if (!response.error) {
            let pkNew = response.pkNew;

            let suggestedExercises = response.suggestedExercises;

            let recommendedExercises = {};
            suggestedExercises.forEach((exerciseID) => {

                recommendedExercises[exerciseID] = {};

                // get diff
                if (_.has(response.exerciseInfo, BKT_ITEM_PARAMS.EID)) {
                    // determine concept, readOrWrite
                    let recInfo = this.getConceptFromExercise(exerciseID);
                    let recConcept = recInfo.concept;
                    let recReadOrWrite = recInfo.readOrWrite;

                    // determine if instructions read
                    let hasReadMinInstructions = instructionsRead && _.has(instructionsRead, recConcept) 
                        && _.has(instructionsRead[recConcept], recReadOrWrite) && Array.isArray(instructionsRead[recConcept][recReadOrWrite]) 
                        && instructionsRead[recConcept][recReadOrWrite].length >= THRESHOLDS.MIN_INSTRUCTIONS_READ;
                    
                    // get avg pk of parent/dependency concepts
                    let colIndex = this.conceptMap.concepts.indexOf(recConcept); // index corresponding to target concept
                    let parentConcepts = [];
                    for (let rowIndex in this.conceptMap.adjMat) {
                        if (this.conceptMap.adjMat[rowIndex][colIndex] > 0) { // (x,y)=1 => x is parent of y
                            parentConcepts.push(this.conceptMap.concepts[rowIndex]);
                        }
                    }

                    let parentBkts = [];
                    parentConcepts.forEach(parentConcept => {
                        [READ, WRITE].forEach(exType => {
                            parentBkts.push(this.priorPKnown[parentConcept][exType][BKT_PARAMS.PKNOWN]);
                        });
                    });

                    let avgParentBkt = parentBkts.length > 0 ? parentBkts.reduce((acc, val) => acc + val) / parentBkts.length : 1; // if no parents => "know" parents

                    let recPk = recConcept == conceptKey ? pkNew : this.priorPKnown[recConcept][recReadOrWrite][BKT_PARAMS.PKNOWN];

                    let rec = this.determineRecGoal(recPk, hasReadMinInstructions, avgParentBkt);

                    recommendedExercises[exerciseID] = {
                        type: rec.type,
                        text: rec.text,
                        icon: rec.icon
                    };

                } else throw "exerciseInfo not returned in response";
            });
            callback(recommendedExercises, questionIndex, userAnswer, isCorrect); //updates state in App.js

            this.priorPKnown[conceptKey][readOrWrite][BKT_PARAMS.PKNOWN] = pkNew; // update priorPKnown locally

            return pkNew;
        } else {
            throw ("Update to pknown failed.")
        }
        return pKnown;
    }

    /**
     * Given exercise id (eid) and item parameters (itemParams), return the conceptKey and readOrWrite for given exercise
     */
    getConceptFromExercise = (eid) => {
        // get concept for recommendation from exercide ID
        let targetConcept = null;
        let readOrWrite = null;

        for(const [conceptName, properties] of Object.entries(this.conceptExerciseMap)) {
            [READ, WRITE].forEach(exType => {
                if(_.has(properties, exType) && properties[exType].includes(eid)) {
                    targetConcept = conceptName;
                    readOrWrite = exType;
                }
            })
        }
        return {concept: targetConcept, readOrWrite: readOrWrite};
    }
    
    /**
     * Given a target concept's probablility of known (pk, float), hasReadMinInstructions (boolean), 
     * average probability of known for parent concepts (avgParentBkt, float), 
     * determine type of recommendation and returns string of recommendation type
     */
    determineRecGoal = (pk, hasReadMinInstructions, avgParentBkt) => {
        let isPkHigh = pk > THRESHOLDS.PK_THRESHOLD;
        let isParentsPkHigh = avgParentBkt > THRESHOLDS.PK_THRESHOLD;
        
        let rec = Object.values(REC_RESPONSES).filter(opt => opt.read == hasReadMinInstructions 
            && opt.know == isPkHigh 
            && opt.parents_know == isParentsPkHigh);

        if (rec.length==1) {
            return rec[0]
        } else if (rec.length > 1) throw "multiple recommendation types found";
        else throw "no recommendation types found";
    }


    request = async (requestParams) => {
        const response = await fetch(BKT_ENDPOINT, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestParams)
        });

        let body = {};
        if (response.ok) {
            body = await response.json();
            if (body["exerciseInfo"]) {
                body["exerciseInfo"] = JSON.parse(body["exerciseInfo"]);
            }
        } else {
            body = { error: response.statusText };
        }
        return body;
    }
}

export { ModelUpdater };