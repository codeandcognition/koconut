// utility functions to query completed exercises from Firebase

export async function filterCompletedInstructions(conceptsRef, pageVisitsRef) {
    // map from conceptKey to a list of indices that represent instruction pages
    let snap = await conceptsRef.once("value");
    let concepts = Object.keys(snap.val());
    return await readAsyncForEach(pageVisitsRef, concepts, readCallback);
}

async function readCallback(ref, concept, completed) {
    let snap = await ref.orderByChild("concept").equalTo(concept).once("value");
    if (snap && snap.val()) {
        let uniquePages = [];
        let pagesVisited = snap.val();
        Object.keys(pagesVisited).forEach(pageKey => {
            let page = pagesVisited[pageKey];
            if (!uniquePages.includes(page.page)) {
                uniquePages.push(page.page);
            }
        });
        uniquePages = uniquePages.sort();
        completed[concept] = uniquePages;
    }
}

async function readAsyncForEach(ref, concepts, callback) {
    let completed = {};
    for (let i = 0; i < concepts.length; i++) {
        await readCallback(ref, concepts[i], completed)
    }
    return completed;
}

