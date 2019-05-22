const BKT_ENDPOINT = `http://localhost:8080/bkt`;

const BKT_PARAMS = {
    INIT: "init",
    TRANSFER: "transfer"
}

const BKT_ITEM_PARAMS = {
    SLIP: "slip",
    GUESS: "guess"
}

class ModelUpdater {
    conceptParameters: any;
    exerciseParameters: any;
    priorPKnown: any; // @TODO: ask Benji if every user has this map!

    constructor(conceptParameters: any, exerciseParameters: any) {
        this.conceptParameters = conceptParameters;
        this.exerciseParameters = exerciseParameters;
    }

    // @flow
    update = async (isCorrect: boolean, exerciseID: string, conceptKey: string, readOrWrite: string, callback : Function) => {
        let exerciseIDs = Object.keys(this.exerciseParameters);
        let conceptParams = this.conceptParameters[conceptKey];
        let itemParams = {
            slip: 0,
            guess: 0
        };
        let pKnown = this.priorPKnown[conceptKey][readOrWrite][BKT_PARAMS.INIT];

        // compose request body
        let requestParams = {
            isCorrect: isCorrect,
            exerciseID: exerciseID,
            readOrWrite: readOrWrite,
            exerciseIDs: exerciseIDs,
            transfer: conceptParams.transfer,
            itemParams: itemParams,
            priorPknown: pKnown
        };
        let response = await this.request(requestParams);
        let pkNew = response.pkNew;
        let suggestedExercises = response.suggestedExercises;

        // TODO: Write pkNew to Firebase for the user
        let recommendedExercises = {};
        suggestedExercises.forEach((exerciseID) => {
            recommendedExercises[exerciseID] = {};
        });
        callback(recommendedExercises); //updates state in App.js
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
        const body = await response.json();
        return body;
    }
}

export { ModelUpdater };