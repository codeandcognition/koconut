const BKT_ENDPOINT = `http://localhost:8080/bkt`; // TODO for prod: change URL

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

const READ = 'READ';
const WRITE = 'WRITE';

class ModelUpdater {
    conceptParameters: any;
    exerciseParameters: any;
    priorPKnown: any;
    conceptExerciseMap: any;
    maxNumRecommendations: any;

    constructor(conceptParameters: any, exerciseParameters: any, priorPKnown: any, conceptExerciseMap, maxNumRecommendations: any) {
        this.conceptParameters = conceptParameters;
        this.exerciseParameters = exerciseParameters;
        this.priorPKnown = priorPKnown;
        this.conceptExerciseMap = conceptExerciseMap;
        this.maxNumRecommendations = maxNumRecommendations;
    }

    // @flow
    update = async (isCorrect: boolean, exerciseID: string, conceptKey: string, readOrWrite: string, callback : Function) => {
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

        // console.log(itemParams);

        let pKnown = this.priorPKnown[conceptKey][readOrWrite][BKT_PARAMS.PKNOWN]; // get prior

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
            
            // limit number of recommendations
            let suggestedExercises = (this.maxNumRecommendations > 0 ? response.suggestedExercises.splice(0, this.maxNumRecommendations) : response.suggestedExercises);

            let recommendedExercises = {};
            suggestedExercises.forEach((exerciseID) => {
                recommendedExercises[exerciseID] = {};
            });
            callback(recommendedExercises); //updates state in App.js

            this.priorPKnown[conceptKey][readOrWrite][BKT_PARAMS.PKNOWN] = pkNew; // update priorPKnown locally

            return pkNew;
        } else {
            throw("Update to pknown failed.")
        }
        return pKnown;
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