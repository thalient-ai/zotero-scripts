(async function() {
    const startTime = performance.now();

    try {
        const items = await getItemsToEdit();
        if (!items) {
            console.log("No items to process.");
            return;
        }

        const weights = {
            title: 0.4,
            shortTitle: 0.05,
            creators: 0.2,
            date: 0.05,
            publisher: 0.05,
            place: 0.05,
            journal: 0.05,
            DOI: 0.05,
            ISBN: 0.05,
            itemType: 0.05 // Added weight for item type
        };

        normalizeWeights(weights);

        const threshold = getUserInputThreshold(weights);
        if (threshold === null) return;

        const weightsConfirmedTime = performance.now();
        logTime("Time to confirm weights", weightsConfirmedTime - startTime);

        console.log(`Using similarity threshold: ${threshold}`);
        console.log(`Number of items to process: ${items.length}`);

        const potentialDuplicates = await detectPotentialDuplicatesOptimized(items, threshold, weights);
        
        const duplicatesDetectedTime = performance.now();
        logTime("Time to detect duplicates", duplicatesDetectedTime - weightsConfirmedTime);

        await handleDetectedDuplicates(potentialDuplicates);

        alert("Duplicate detection process completed.");
    } catch (error) {
        console.error(`Error in findAndHandleDuplicates: ${error.message}`);
        alert(`An error occurred: ${error.message}`);
    } finally {
        const endTime = performance.now();
        logTime("Total time", endTime - startTime);
    }
})();

// Logs the time taken for a specific operation
function logTime(label, time) {
    try {
        console.log(`${label}: ${(time / 1000).toFixed(2)} seconds`);
    } catch (error) {
        console.error(`Failed to log time for ${label}: ${error.message}`);
    }
}

// Normalizes the weights so their sum equals 1
function normalizeWeights(weights) {
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    for (let key in weights) {
        weights[key] /= totalWeight;
    }
}

// Prompts the user to enter a similarity threshold, ensuring it is a valid number between 0 and 1
function getUserInputThreshold(weights) {
    const weightsInfo = `Weights used in the similarity calculation:\nTitle: ${weights.title.toFixed(2)}\nShort Title: ${weights.shortTitle.toFixed(2)}\nCreators: ${weights.creators.toFixed(2)}\nDate: ${weights.date.toFixed(2)}\nPublisher: ${weights.publisher.toFixed(2)}\nPlace: ${weights.place.toFixed(2)}\nJournal: ${weights.journal.toFixed(2)}\nDOI: ${weights.DOI.toFixed(2)}\nISBN: ${weights.ISBN.toFixed(2)}\nItem Type: ${weights.itemType.toFixed(2)}\n\n`; // Added item type to weights info
    const thresholdInput = prompt(weightsInfo + "Enter the similarity threshold for detecting duplicates (a number between 0 and 1, e.g., 0.6 for 60% similarity):", "0.6");

    // Sanitize and validate the threshold input
    const sanitizedThresholdInput = thresholdInput ? thresholdInput.trim() : null;
    const threshold = parseFloat(sanitizedThresholdInput);

    if (isNaN(threshold) || threshold < 0 || threshold > 1) {
        alert("Invalid threshold value. Please enter a number between 0 and 1.");
        return null;
    }

    console.log(`User input similarity threshold: ${threshold}`);
    return threshold;
}

// Detects potential duplicates based on similarity threshold and weights
async function detectPotentialDuplicatesOptimized(items, threshold, weights) {
    const potentialDuplicates = [];
    const itemMap = new Map();

    // Preprocess items into map for faster lookup
    for (const item of items) {
        const normalized = normalizeItemFields(item, weights);
        itemMap.set(item.id, normalized);
    }

    const itemEntries = Array.from(itemMap.entries());
    for (let i = 0; i < itemEntries.length; i++) {
        const [id1, item1] = itemEntries[i];
        for (let j = i + 1; j < itemEntries.length; j++) {
            const [id2, item2] = itemEntries[j];
            const similarity = calculateSimilarity(item1, item2, weights);
            if (similarity > threshold) {
                potentialDuplicates.push({ item1, item2, similarity });
                console.log(`Potential duplicate found:\nItem 1: ${item1.title}\nItem 2: ${item2.title}\nSimilarity: ${similarity}`);
            }
        }
    }
    return potentialDuplicates;
}

// Normalizes the fields of an item for comparison
function normalizeItemFields(item, weights) {
    const fields = ['title', 'shortTitle', 'date', 'publisher', 'place', 'journal', 'DOI', 'ISBN', 'itemType']; // Added item type to fields
    const normalizedItem = {};
    fields.forEach(field => {
        normalizedItem[field] = normalizeField(item.getField(field));
    });
    normalizedItem.creators = normalizeCreators(item.getCreators());
    normalizedItem.itemType = item.itemType.toLowerCase().trim(); // Normalize item type
    return normalizedItem;
}

// Normalizes a field by removing special characters and converting to lowercase
function normalizeField(field) {
    return (field || "").replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase().trim();
}

// Normalizes the creators field by combining first and last names
function normalizeCreators(creators) {
    return creators.map(creator => `${creator.firstName || ""} ${creator.lastName || creator.name || ""}`.toLowerCase().trim()).join(' ');
}

// Calculates the similarity between two items using the Jaccard similarity index
function calculateSimilarity(item1, item2, weights) {
    const fields = ['title', 'shortTitle', 'date', 'publisher', 'place', 'journal', 'DOI', 'ISBN', 'itemType']; // Added item type to fields

    let totalWeight = 0;
    let combinedSimilarity = 0;

    fields.forEach(field => {
        const similarity = jaccardSimilarity(item1[field], item2[field]);
        combinedSimilarity += similarity * weights[field];
        totalWeight += weights[field];
    });

    const creatorSimilarity = jaccardSimilarity(item1.creators, item2.creators);
    combinedSimilarity += creatorSimilarity * weights.creators;
    totalWeight += weights.creators;

    return combinedSimilarity / totalWeight;
}

// Calculates the Jaccard similarity index between two strings
function jaccardSimilarity(str1, str2) {
    const set1 = new Set(str1.split(/\s+/));
    const set2 = new Set(str2.split(/\s+/));
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
}

// Handles the detected duplicates by prompting the user for an action
async function handleDetectedDuplicates(duplicates) {
    if (duplicates.length === 0) {
        console.log("No duplicates found.");
        return;
    }

    const actions = {
        tag: async (item1, item2, tag) => {
            item1.addTag(tag);
            item2.addTag(tag);
            await item1.saveTx();
            await item2.saveTx();
        },
        trash: async (item) => {
            await Zotero.Items.trashTx(item.id);
        }
    };

    const timestamp = Date.now();
    let stopProcessing = false;

    for (const { item1, item2, similarity } of duplicates) {
        if (stopProcessing) {
            console.log("Processing stopped by the user.");
            break;
        }
        
        const action = prompt(`Potential duplicate found with similarity ${similarity.toFixed(2)}:\n\nItem 1: ${item1.title}\nItem 2: ${item2.title}\n\nChoose an action:\n1. Add a tag to both Items (e.g., duplicate-pair-${timestamp})\n2. Move Item 2 to Trash\n3. Ignore\n4. Stop Processing\n\n(Press Cancel to skip)`);

        // Sanitize the user input
        const sanitizedAction = action ? action.trim() : null;

        if (sanitizedAction === '1') {
            await actions.tag(item1, item2, `duplicate-pair-${timestamp}`);
        } else if (sanitizedAction === '2') {
            await actions.trash(item2);
        } else if (sanitizedAction === '4') {
            stopProcessing = true;
        } else {
            console.log(`Ignored potential duplicate:\nItem 1: ${item1.title}\nItem 2: ${item2.title}`);
        }
    }
}

// Retrieves items based on user selection
async function getItemsToEdit() {
    try {
        const zoteroPane = Zotero.getActiveZoteroPane();
        const editOption = prompt("Enter '1' to search selected items, '2' for items in the current collection, or '3' for items in a saved search:");

        // Sanitize the user input
        const sanitizedEditOption = editOption ? editOption.trim() : null;

        let items = [];
        let searchOption = "";

        if (sanitizedEditOption === '2') {
            const collection = zoteroPane.getSelectedCollection();
            if (!collection) {
                alert("No collection selected.");
                return null;
            }
            items = await collection.getChildItems();
            searchOption = "Current Collection";
        } else if (sanitizedEditOption === '3') {
            const savedSearch = zoteroPane.getSelectedSavedSearch();
            if (!savedSearch) {
                alert("No saved search selected.");
                return null;
            }
            const search = new Zotero.Search();
            search.libraryID = savedSearch.libraryID;
            search.addCondition('savedSearchID', 'is', savedSearch.id);
            const itemIDs = await search.search();
            if (itemIDs.length === 0) {
                alert("No items found in the saved search.");
                return null;
            }
            items = await Zotero.Items.getAsync(itemIDs);
            searchOption = "Saved Search";
        } else {
            const selectedItems = zoteroPane.getSelectedItems();
            if (!selectedItems.length) {
                alert("No items selected.");
                return null;
            }
            items = selectedItems;
            searchOption = "Selected Items";
        }

        console.log(`User selected search option: ${searchOption}`);
        return items;
    } catch (error) {
        console.error(`Error getting items to edit: ${error.message}`);
        alert(`An error occurred while retrieving items: ${error.message}`);
        return null;
    }
}
