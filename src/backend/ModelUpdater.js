/*
 * ModelUpdater handles updates (e.g. on exercise on submit) for user/learner model
 */

// const BKT_ENDPOINT = `http://127.0.0.1:5000/bkt`; // TODO for prod: change URL
const BKT_ENDPOINT = `https://codeitz.herokuapp.com/bkt`; // TODO for prod: change URL

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

// direct relationships between concepts
const RELATIONSHIPS = {
    SAME: "same",
    PARENT: "parent",
    CHILD: "child"
};

const REC_TYPES = {
    REWIND: "review",
    CONTINUE: "continue",
    JUMP: "jump"
};

const REC_PREFIX = "Based on how you've been doing on exercises";

const REC_INFO = {
    "review": {
        "text": `${REC_PREFIX}, this will help you review concepts you know`,
        "icon": "fa-undo"
    },
    "continue": {
        "text": `${REC_PREFIX}, this will help you continue what you've been learning`,
        "icon": "fa-play-circle"
    },
    "jump": {
        "text": `${REC_PREFIX}, this will challenge you; but you're ready!`,
        "icon": "fa-redo"
    }
};

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

    constructor(conceptParameters: any, exerciseParameters: any, priorPKnown: any, conceptExerciseMap, maxNumRecommendations: any, conceptMap: any) {
        this.conceptParameters = conceptParameters;
        this.exerciseParameters = exerciseParameters;
        this.priorPKnown = priorPKnown;
        this.conceptExerciseMap = conceptExerciseMap;
        this.maxNumRecommendations = maxNumRecommendations;
        this.conceptMap = conceptMap;
    }

    // @flow
    update = async (isCorrect: boolean, exerciseID: string, conceptKey: string, readOrWrite: string, questionIndex: Number, userAnswer: string, passed: boolean, callback: Function) => {
        // let exerciseIDs = Object.keys(this.exerciseParameters);
        let exerciseIDs = [];
        let conceptParams = this.conceptParameters[conceptKey];
        let itemParams = [];

        // populate itemParams
        Object.keys(this.conceptExerciseMap).forEach((concept) => {
            let read = this.conceptExerciseMap[concept][READ];
            let write = this.conceptExerciseMap[concept][WRITE];
            read.forEach((eid) => {
                let params = this.exerciseParameters[eid];
                if (params) {
                    params[BKT_ITEM_PARAMS.EID] = eid;
                    params[BKT_ITEM_PARAMS.CONCEPT] = concept;
                    itemParams.push(params);
                    exerciseIDs.push(eid)
                }
            });
            write.forEach((eid) => {
                let params = this.exerciseParameters[eid];
                if (params) {
                    params[BKT_ITEM_PARAMS.EID] = eid;
                    params[BKT_ITEM_PARAMS.CONCEPT] = concept;
                    itemParams.push(params);
                    exerciseIDs.push(eid);
                }
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

            // limit number of recommendations
            let suggestedExercises = response.suggestedExercises;

            let recommendedExercises = {};
            suggestedExercises.forEach((exerciseID) => {

                recommendedExercises[exerciseID] = {};

                // get diff
                if (response.exerciseInfo && BKT_ITEM_PARAMS.EID in response.exerciseInfo) {
                    let index = Object.keys(response.exerciseInfo[BKT_ITEM_PARAMS.EID])
                        .find(key => response.exerciseInfo[BKT_ITEM_PARAMS.EID][key] === exerciseID); // map eid to concept
                    let diff = -1;
                    if (index && index >= 0) {
                        diff = response.exerciseInfo["diff"][index];
                    } else {
                        throw `couldn't find eid ${exerciseID} in response`;
                    };

                    let relationship = this.determineConceptRelationship(exerciseID, conceptKey, itemParams);
                    let recType = this.determineRecType(diff, relationship);

                    recommendedExercises[exerciseID] = {
                        "type": recType,
                        "text": REC_INFO[recType]["text"],
                        "icon": REC_INFO[recType]["icon"]
                    };
                } else throw "exerciseInfo not returned in response";
            });
            callback(recommendedExercises, questionIndex, userAnswer, passed); //updates state in App.js

            this.priorPKnown[conceptKey][readOrWrite][BKT_PARAMS.PKNOWN] = pkNew; // update priorPKnown locally

            return pkNew;
        } else {
            throw ("Update to pknown failed.")
        }
        return pKnown;
    }

    /**
     * Determine relationship between concept of recommended exercise and targetConcept
     * Returns value in RELATIONSHIPS object
     */
    determineConceptRelationship = (eidOfRec: string, targetConcept: string, itemParams: Array) => {
        let targetIndex = this.conceptMap["concepts"].indexOf(targetConcept);
        let recIndex = -1;

        if (itemParams) {
            // get concept for recommendation from exercide ID
            let recConceptList = itemParams.filter((x) => x[BKT_ITEM_PARAMS.EID] == eidOfRec);
            if (recConceptList.length > 0) { // if exercise found
                let recConcept = recConceptList[0][BKT_ITEM_PARAMS.CONCEPT];
                recIndex = this.conceptMap["concepts"].indexOf(recConcept);
            } else {
                throw `No concept found in item params for EID ${eidOfRec}`
            }
        } else throw "No item params, so cannot determine concept relationship";


        if (targetIndex < 0 || recIndex < 0) throw "Could not find target or recommendation index in concept map";

        // determine relationship
        if (targetIndex == recIndex) return RELATIONSHIPS.SAME;
        if (this.conceptMap["adjMat"][targetIndex][recIndex] > 0) return RELATIONSHIPS.CHILD;
        if (this.conceptMap["adjMat"][recIndex][targetIndex] > 0) return RELATIONSHIPS.PARENT;

        console.log(`No direct relationship between exercise ${eidOfRec} & target concept ${targetConcept}`);
        return null;
    }

    /**
     * determine type of recommendation and returns string of recommendation type
     * 
     * diff: difference between goal score and exercise score. >proximalDiff means exercise is more difficult
     * relationship: relationship of concept for recommended exercise to targetConcept
     * proximalDiff: |diff| < proximalDist means exercise is "just right" in difficulty
     */
    determineRecType = (diff: Number, relationship = RELATIONSHIPS.SAME, proximalDist = 0.05) => {
        console.log(`determineRecType called`);
        if (!Object.values(RELATIONSHIPS).includes(relationship)) { // ensure relationship is acceptable value
            throw `concept relationship type not acceptable. relationship passed in ${relationship}`;
        }

        if (
            (diff < -proximalDist && relationship == RELATIONSHIPS.PARENT) ||
            (diff < -proximalDist && relationship == RELATIONSHIPS.SAME) ||
            (Math.abs(diff) < proximalDist && relationship == RELATIONSHIPS.SAME)
        ) return REC_TYPES.REWIND;

        if (
            (Math.abs(diff) < proximalDist && relationship == RELATIONSHIPS.continue) ||
            (diff > proximalDist && relationship == RELATIONSHIPS.PARENT)
        ) return REC_TYPES.CONTINUE;

        if (
            (Math.abs(diff) < proximalDist && relationship == RELATIONSHIPS.CHILD) ||
            (diff > proximalDist && RELATIONSHIPS.PARENT)
        ) return REC_TYPES.JUMP

        console.log(`determineRecType: Hit unaccounted for case where diff if ${diff} and relationship is ${relationship}`);
        return REC_TYPES.CONTINUE;

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