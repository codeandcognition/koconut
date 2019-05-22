const BKT_ENDPOINT = `http://localhost:8080/bkt`;

class ModelUpdater {
    conceptParameters: any;
    exerciseParameters: any;
    priorPKnown: any; // @TODO: ask Benji if every user has this map!

    constructor(conceptParameters: any, exerciseParameters: any) {
        this.conceptParameters = conceptParameters;
        this.exerciseParameters = exerciseParameters;
    }

    // @flow
    update = async (isCorrect: boolean, exerciseID: string, conceptKey: string, callback : Function) => {
        let exerciseIDs = Object.keys(this.exerciseParameters);
        let conceptParams = this.conceptParameters[conceptKey];
        let itemParams = {
            slip: 0,
            guess: 0
        };

        // compose request body
        let requestParams = {
            isCorrect: isCorrect,
            exerciseID: exerciseID,
            exerciseIDs: exerciseIDs,
            transfer: conceptParams.transfer,
            itemParams: itemParams
        };

        let response = await this.request(requestParams);

        // do we write anything to firebase?
        console.log(response);
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