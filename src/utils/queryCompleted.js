// Utility functions to query completed exercises from Firebase

// TODO import strings instead
const READ = "READ";
const WRITE = "WRITE";

// Functions to query Instructions that were read 
export async function filterCompletedInstructions(conceptsRef, pageVisitsRef) {
    // map from conceptKey to a list of indices that represent instruction pages
    let snap = await conceptsRef.once("value");
    let concepts = Object.keys(snap.val());

    return await groupByConcept(pageVisitsRef, concepts, findUniquePages);
}

/**
 * Mutates completed object to add completed instruction (read and write) for given concept
 * @param {*} ref Reference to firebase database
 * @param {*} concept string of concept name
 * @param {*} completed Object which logs which instruction for each concept is already completed/read
 */
async function findUniquePages(ref, concept, completed) {
    let snap = await ref.orderByChild("concept").equalTo(concept).once("value");
    if (snap && snap.val()) {
        let uniquePages = {
            READ: [],
            WRITE: []
        };
        let pagesVisited = snap.val();
        Object.keys(pagesVisited).forEach(pageKey => {
            let page = pagesVisited[pageKey];
            let readOrWrite = page["readOrWrite"];
            if(readOrWrite == READ || readOrWrite == WRITE) {
                if (!uniquePages[readOrWrite].includes(page.page)) {
                    uniquePages[readOrWrite].push(page.page);
                }
            }
        });
        uniquePages[READ] = uniquePages[READ].sort();
        uniquePages[WRITE] = uniquePages[WRITE].sort();
        completed[concept] = uniquePages;
    }
}

async function groupByConcept(ref, concepts, findUniquePages) {
    let completed = {};
    for (let i = 0; i < concepts.length; i++) {
        await findUniquePages(ref, concepts[i], completed)
    }
    return completed;
}

// ---------------------------------------------------------------------- //

// Functions to query Exercises that were completed
export async function filterCompletedExercises(conceptsRef, answerSubmissionsRef, exercisesRef) {
    // get concept to exercise mapping
    let snap = await conceptsRef.once("value");
    let conceptExerciseMap = snap.val();
    let conceptToExercises = flattenExercises(conceptExerciseMap);

    // get all exercises along with the content (need these to check if user has answer all questions within an exercise)
    let allExercisesSnap = await exercisesRef.once("value");
    let allExercises = allExercisesSnap.val();

    // get all correct submissions (note the firebase query!)
    let correctSubmissionsSnap = await answerSubmissionsRef.orderByChild("correctness").equalTo(true).once("value");
    let correctSubmissions = correctSubmissionsSnap.val() ? correctSubmissionsSnap.val() : {};

    // map from exercise to all correctly answered questions within an exercise
    let exerciseToQuestionMapping = findQuestionsAnsweredCorrectly(correctSubmissions);

    // filter completed exercises
    let completedExercises = omitPartiallyCompletedExercises(exerciseToQuestionMapping, allExercises);
    
    return updateCompletedExercises(conceptToExercises, completedExercises);
}

// removes the read + write nesting
function flattenExercises(conceptExerciseMap) {
    let conceptToExercises = {};

    // flatten exercises
    Object.keys(conceptExerciseMap).forEach((conceptCode) => {
        let readingExercises = conceptExerciseMap[conceptCode]["READ"];
        let writingExercises = conceptExerciseMap[conceptCode]["WRITE"];
        conceptToExercises[conceptCode] = readingExercises.concat(writingExercises);
    });
    return conceptToExercises;
}

function findQuestionsAnsweredCorrectly(correctSubmissions) {
    let exerciseToQuestionMapping = {};
    Object.keys(correctSubmissions).forEach((submissionKey) => {
        let submission = correctSubmissions[submissionKey];
        let exID = submission["exerciseId"];
        let questionIndex = submission["questionIndex"];

        let questions = exerciseToQuestionMapping[exID];
        if (!exerciseToQuestionMapping[exID]) {
            questions = [];
        }
        if (!questions.includes(questionIndex)) {
            questions.push(questionIndex);
        }
        exerciseToQuestionMapping[exID] = questions;
    });
    return exerciseToQuestionMapping;
}

function omitPartiallyCompletedExercises(exerciseToQuestionMapping, allExercises) {
    let completedExercises = [];

    Object.keys(exerciseToQuestionMapping).forEach((exID) => {
        let questionsCorrect = exerciseToQuestionMapping[exID];
        let exerciseContent = allExercises[exID];
        if (exerciseContent && exerciseContent.questions.length == questionsCorrect.length) {
            completedExercises.push(exID);
        }
    });

    return completedExercises;
}

function updateCompletedExercises(conceptToExercises, completedExercises) {
    let concepts = Object.keys(conceptToExercises);
    for (let i = 0; i < concepts.length; i++) {
        let all = conceptToExercises[concepts[i]];
        let completed = all.filter(value => -1 !== completedExercises.indexOf(value));
        conceptToExercises[concepts[i]] = completed;
    }
    return conceptToExercises;
}