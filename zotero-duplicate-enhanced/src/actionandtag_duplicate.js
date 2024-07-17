const Zotero = require("Zotero");
const window = require("window");

(async function () {
    const startTime = new Date();

    // Prevent concurrent duplicate detection processes
    if (window.duplicateDetectionRunning) {
        return;
    }
    window.duplicateDetectionRunning = true;
    Zotero.logError("Starting duplicate detection process.");

    try {
        // Obtain items to edit based on user selection or collection
        const items = await getItemsToEdit();
        if (!items || items.length === 0) {
            Zotero.logError("No items to process.");
            window.duplicateDetectionRunning = false;
            return;
        }

        // Initialize and normalize weights for similarity calculation
        const weights = initializeWeights();
        normalizeWeights(weights);

        // Get user input for similarity threshold and validate it
        const threshold = getUserInputThreshold(weights);
        if (threshold === null) {
            Zotero.logError("User cancelled the threshold input.");
            window.duplicateDetectionRunning = false;
            return;
        }

        // Detect duplicates based on the specified threshold and weights
        const potentialDuplicates = await detectPotentialDuplicates(items, threshold, weights);

        // Handle any detected duplicates with user interaction
        await handleDetectedDuplicates(potentialDuplicates);

    } catch (error) {
        Zotero.logError("Error in duplicate detection: " + error.message);
    } finally {
        window.duplicateDetectionRunning = false;
        const endTime = new Date();
        logTime("Total time", endTime - startTime);
        Zotero.logError("Duplicate detection process ended.");
    }
})();

function initializeWeights() {
    return {
        title: 0.4,
        shortTitle: 0.05,
        creators: 0.2,
        date: 0.05,
        publisher: 0.05,
        place: 0.05,
        journal: 0.05,
        DOI: 0.05,
        ISBN: 0.05,
        itemType: 0.05
    };
}

function normalizeWeights(weights) {
    const totalWeight = Object.values(weights).reduce((sum, value) => sum + value, 0);
    for (let key in weights) {
        weights[key] /= totalWeight;
    }
}

function getUserInputThreshold(weights) {
    const weightsInfo = Object.entries(weights)
        .map(([key, value]) => `${key}: ${value.toFixed(2)}`)
        .join("\n");
    const promptMessage = `Weights used in the similarity calculation:\n${weightsInfo}\nEnter the similarity threshold (0-1):`;
    const thresholdInput = window.prompt(promptMessage, "0.75");
    const threshold = parseFloat(thresholdInput);

    if (isNaN(threshold) || threshold < 0 || threshold > 1) {
        window.alert("Invalid threshold value. Please enter a number between 0 and 1.");
        return null;
    }
    return threshold;
}

async function detectPotentialDuplicates(items, threshold, weights) {
    const potentialDuplicates = [];
    const itemMap = new Map(items.map(item => [item.id, normalizeItemFields(item)]));

    const compareItems = async ([id1, item1], [id2, item2]) => {
        const similarity = calculateSimilarity(item1, item2, weights);
        Zotero.logError(`Comparing items ${id1} and ${id2} with similarity: ${similarity}`);
        if (similarity > threshold) {
            return { item1: items.find(i => i.id === id1), item2: items.find(i => i.id === id2), similarity };
        }
        return null;
    };

    const comparisons = [];
    for (let [id1, item1] of itemMap) {
        for (let [id2, item2] of itemMap) {
            if (id1 !== id2 && !pairAlreadyProcessed(id1, id2)) {
                comparisons.push(compareItems([id1, item1], [id2, item2]));
                markPairAsProcessed(id1, id2);
            }
        }
    }

    const results = await Promise.all(comparisons);
    for (const result of results) {
        if (result !== null) {
            potentialDuplicates.push(result);
        }
    }

    return potentialDuplicates;
}

function normalizeItemFields(item) {
    const fields = ['title', 'shortTitle', 'date', 'publisher', 'place', 'journal', 'DOI', 'ISBN', 'itemType'];
    const normalizedItem = {};
    fields.forEach(field => {
        normalizedItem[field] = normalizeField(item.getField(field));
    });
    normalizedItem.creators = normalizeCreators(item.getCreators());
    normalizedItem.itemType = item.itemType.toLowerCase().trim();
    Zotero.logError(`Normalized fields for item ${item.id}: ${JSON.stringify(normalizedItem)}`);
    return normalizedItem;
}

function normalizeField(field) {
    return (field || "").replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase().trim();
}

function normalizeCreators(creators) {
    return creators.map(creator => `${creator.firstName || ""} ${creator.lastName || creator.name || ""}`.toLowerCase().trim()).join(' ');
}

function calculateSimilarity(item1, item2, weights) {
    const fields = ['title', 'shortTitle', 'date', 'publisher', 'place', 'journal', 'DOI', 'ISBN', 'itemType'];

    let totalWeight = 0;
    let combinedSimilarity = 0;

    fields.forEach(field => {
        const similarity = jaccardSimilarity(item1[field], item2[field]);
        combinedSimilarity += similarity * weights[field];
        totalWeight += weights[field];
        Zotero.logError(`Field: ${field}, Item1: ${item1[field]}, Item2: ${item2[field]}, Similarity: ${similarity}, Weighted Similarity: ${similarity * weights[field]}`);
    });

    const creatorSimilarity = jaccardSimilarity(item1.creators, item2.creators);
    combinedSimilarity += creatorSimilarity * weights.creators;
    totalWeight += weights.creators;
    Zotero.logError(`Creators Similarity: ${creatorSimilarity}, Weighted Creators Similarity: ${creatorSimilarity * weights.creators}`);

    return combinedSimilarity / totalWeight;
}

function jaccardSimilarity(str1, str2) {
    const set1 = new Set(str1.split(/\s+/));
    const set2 = new Set(str2.split(/\s+/));
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
}

const processedPairs = new Set();

function pairAlreadyProcessed(id1, id2) {
    const pairKey = [id1, id2].sort().join("-");
    return processedPairs.has(pairKey);
}

function markPairAsProcessed(id1, id2) {
    const pairKey = [id1, id2].sort().join("-");
    processedPairs.add(pairKey);
}

async function handleDetectedDuplicates(duplicates) {
    if (duplicates.length === 0) {
        Zotero.logError("No duplicates found.");
        return;
    }

    const timestamp = Date.now();
    let stopProcessing = false;

    for (const { item1, item2, similarity } of duplicates) {
        if (stopProcessing) {
            Zotero.logError("Processing stopped by the user.");
            break;
        }

        const response = window.prompt(`Found duplicates with similarity ${similarity.toFixed(2)}:\n1: ${item1.getField('title')}\n2: ${item2.getField('title')}\nChoose action:\n1. Add a tag to both Items (e.g., duplicate-pair-${timestamp})\n2. Move Item 2 to Trash\n3. Ignore\n4. Stop Processing`);
        const sanitizedResponse = response ? response.trim() : null;

        switch (sanitizedResponse) {
            case '1':
                await addTagToItems(item1, item2, `duplicate-pair-${timestamp}`);
                break;
            case '2':
                await moveItemToTrash(item2);
                break;
            case '3':
                Zotero.logError(`Ignored items: ${item1.getField('title')} and ${item2.getField('title')}`);
                break;
            case '4':
                stopProcessing = true;
                break;
            default:
                Zotero.logError(`No valid action chosen for items: ${item1.getField('title')} and ${item2.getField('title')}`);
                break;
        }
    }
}

async function addTagToItems(item1, item2, tag) {
    item1.addTag(tag);
    item2.addTag(tag);
    await item1.save();
    await item2.save();
    Zotero.logError(`Tagged items: ${item1.getField('title')} and ${item2.getField('title')} with ${tag}`);
}

async function moveItemToTrash(item) {
    await Zotero.Items.trashTx(item.id);
    Zotero.logError(`Moved item to trash: ${item.getField('title')}`);
}

function logTime(label, milliseconds) {
    Zotero.logError(`${label}: ${(milliseconds / 1000).toFixed(2)} seconds`);
}

async function getItemsToEdit() {
    const zoteroPane = Zotero.getActiveZoteroPane();
    let selectedItems = zoteroPane.getSelectedItems();
    if (!selectedItems.length) {
        let selectedCollection = zoteroPane.getSelectedCollection();
        if (selectedCollection) {
            Zotero.logError(`Items from collection: ${selectedCollection.name}`);
            selectedItems = await selectedCollection.getChildItems();
        } else {
            window.alert("No items or collection selected.");
            return null;
        }
    }
    return selectedItems;
}
