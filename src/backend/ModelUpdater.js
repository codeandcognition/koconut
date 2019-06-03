const BKT_ENDPOINT = `http://localhost:8080/bkt`; // TODO for prod: change URL

const BKT_PARAMS = {
    INIT: "init",
    TRANSFER: "transfer"
}

const BKT_ITEM_PARAMS = {
    SLIP: "slip",
    GUESS: "guess",
    EID: "eid",
    CONCEPT: "concept"
}

const READ = 'READ';
const WRITE = 'WRITE';

class ModelUpdater {
    conceptParameters: any;
    exerciseParameters: any;
    priorPKnown: any;
    conceptExerciseMap: any;

    constructor(conceptParameters: any, exerciseParameters: any, priorPKnown: any, conceptExerciseMap) {
        this.conceptParameters = conceptParameters;
        this.exerciseParameters = exerciseParameters;
        this.priorPKnown = priorPKnown;
        this.conceptExerciseMap = conceptExerciseMap;
    }

    // @flow
    update = async (isCorrect: boolean, exerciseID: string, conceptKey: string, readOrWrite: string, callback : Function) => {
        let exerciseIDs = Object.keys(this.exerciseParameters);
        let conceptParams = this.conceptParameters[conceptKey];
        let itemParams = [];

        Object.keys(this.conceptExerciseMap).forEach((concept) => {
            let read = this.conceptExerciseMap[concept][READ];
            let write = this.conceptExerciseMap[concept][WRITE];
            read.forEach((eid) => {
                let params = this.exerciseParameters[eid];
                if (params) {
                    params[BKT_ITEM_PARAMS.EID] = eid;
                    params[BKT_ITEM_PARAMS.CONCEPT] = conceptKey;
                    itemParams.push(params);
                }
            });
            write.forEach((eid) => {
                let params = this.exerciseParameters[eid];
                if (params) {
                    params[BKT_ITEM_PARAMS.EID] = eid;
                    params[BKT_ITEM_PARAMS.CONCEPT] = conceptKey;
                    itemParams.push(params);
                }
            });
        });

        let pKnown = this.priorPKnown[conceptKey][readOrWrite][BKT_PARAMS.INIT];

        // compose request body
        let requestParams = {
            isCorrect: isCorrect,
            exerciseID: exerciseID,
            exerciseIDs: exerciseIDs,
            transfer: conceptParams[readOrWrite].transfer,
            itemParams: itemParams,
            readOrWrite: readOrWrite == READ ? true : false,
            priorPknown: pKnown
        };
        let response = await this.request(requestParams);
        if (!response.error) {
            let pkNew = response.pkNew;
            let suggestedExercises = response.suggestedExercises;

            // TODO: Write pkNew to Firebase for the user
            let recommendedExercises = {};
            suggestedExercises.forEach((exerciseID) => {
                recommendedExercises[exerciseID] = {};
            });
            callback(recommendedExercises); //updates state in App.js
        }
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
        } else {
            body = {error: response.statusText};
        }
        return body;
    }
}

export { ModelUpdater };