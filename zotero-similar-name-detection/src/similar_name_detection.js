(async function() {
    let similarityThreshold = 0.6;

    while (true) {
        const startTime = performance.now();

        try {
            const items = await getItemsToEdit();
            if (!items) {
                console.log("No items to process.");
                return;
            }

            const weights = {
                lastName: 0.4,
                firstName: 0.4,
                fullName: 0.2
            };

            const weightsConfirmedTime = performance.now();
            logTime("Time to confirm weights", weightsConfirmedTime - startTime);

            console.log(`Using similarity threshold: ${similarityThreshold}`);
            console.log(`Number of items to process: ${items.length}`);

            const potentialDuplicates = await detectPotentialDuplicatesOptimized(items, similarityThreshold, weights);

            const duplicatesDetectedTime = performance.now();
            logTime("Time to detect duplicates", duplicatesDetectedTime - weightsConfirmedTime);

            const action = await handleDetectedDuplicates(potentialDuplicates);

            if (action === '4') {
                similarityThreshold = getUserInputThreshold(weights);
                if (similarityThreshold === null) return;
            } else {
                alert("Name similarity detection process completed.");
                break;
            }
        } catch (error) {
            console.error(`Error in name similarity detection: ${error.message}`);
            alert(`An error occurred: ${error.message}`);
            break;
        } finally {
            const endTime = performance.now();
            logTime("Total time", endTime - startTime);
        }
    }
})();

function logTime(label, time) {
    try {
        console.log(`${label}: ${(time / 1000).toFixed(2)} seconds`);
    } catch (error) {
        console.error(`Failed to log time for ${label}: ${error.message}`);
    }
}

function normalizeWeights(weights) {
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    for (let key in weights) {
        weights[key] /= totalWeight;
    }
}

function getUserInputThreshold(weights) {
    const weightsInfo = `Weights used in the similarity calculation:\nLast Name: ${weights.lastName.toFixed(2)}\nFirst Name: ${weights.firstName.toFixed(2)}\nFull Name: ${weights.fullName.toFixed(2)}\n\n`;
    const thresholdInput = prompt(weightsInfo + "Enter the similarity threshold for detecting similar names (a number between 0 and 1, e.g., 0.6 for 60% similarity):", "0.6");

    const sanitizedThresholdInput = thresholdInput ? thresholdInput.trim() : null;
    const threshold = parseFloat(sanitizedThresholdInput);

    if (isNaN(threshold) || threshold < 0 || threshold > 1) {
        alert("Invalid threshold value. Please enter a number between 0 and 1.");
        return null;
    }

    console.log(`User input similarity threshold: ${threshold}`);
    return threshold;
}

async function detectPotentialDuplicatesOptimized(items, threshold, weights) {
    const potentialDuplicates = [];
    const creatorsList = [];

    for (const item of items) {
        const creators = item.getCreators();
        creators.forEach(creator => {
            const normalizedCreator = normalizeCreator(creator);
            creatorsList.push({ item, creator: normalizedCreator });
        });
    }

    for (let i = 0; i < creatorsList.length; i++) {
        const { item: item1, creator: creator1 } = creatorsList[i];
        for (let j = i + 1; j < creatorsList.length; j++) {
            const { item: item2, creator: creator2 } = creatorsList[j];
            const similarity = calculateCombinedSimilarity(creator1, creator2, weights);
            if (similarity > threshold) {
                potentialDuplicates.push({ item1, creator1, item2, creator2, similarity });
                console.log(`Potential similar names found:\nItem 1: ${creator1.fullName}\nItem 2: ${creator2.fullName}\nSimilarity: ${similarity}`);
            }
        }
    }

    return potentialDuplicates;
}

function normalizeCreator(creator) {
    const firstName = (creator.firstName || "").trim().normalize().toLowerCase();
    const lastName = (creator.lastName || creator.name || "").trim().normalize().toLowerCase();
    const fullName = `${firstName} ${lastName}`.trim();
    return { firstName, lastName, fullName };
}

function calculateCombinedSimilarity(creator1, creator2, weights) {
    const lastNameSimilarity = levenshteinSimilarity(creator1.lastName, creator2.lastName);
    const firstNameSimilarity = levenshteinSimilarity(creator1.firstName, creator2.firstName);
    const fullNameSimilarity = levenshteinSimilarity(creator1.fullName, creator2.fullName);
    return (lastNameSimilarity * weights.lastName) + (firstNameSimilarity * weights.firstName) + (fullNameSimilarity * weights.fullName);
}

// Function to calculate Levenshtein distance
function levenshtein(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
            }
        }
    }

    return matrix[b.length][a.length];
}

// Function to calculate similarity based on Levenshtein distance
function levenshteinSimilarity(a, b) {
    const distance = levenshtein(a, b);
    const maxLength = Math.max(a.length, b.length);
    return (maxLength - distance) / maxLength;
}

async function handleDetectedDuplicates(duplicates) {
    if (duplicates.length === 0) {
        console.log("No similar names found.");
        return;
    }

    const duplicatePairs = duplicates.map(({ item1, creator1, item2, creator2 }) => ({ item1, creator1, item2, creator2 }));
    let action;
    do {
        const similarNames = [...new Set(duplicatePairs.flatMap(pair => [pair.creator1.fullName, pair.creator2.fullName]))];
        const sampleNames = similarNames.slice(0, 3).join('\n');
        action = prompt(`Detected ${duplicates.length} similar name pairs. Here are some examples:\n${sampleNames}\nChoose an action for all:\n1. Replace names with a new name\n2. Ignore all\n3. Show all similar names\n4. Adjust similarity threshold\n\n(Press Cancel to skip)`);

        const sanitizedAction = action ? action.trim().toLowerCase() : null;

        if (sanitizedAction === '1') {
            const newName = prompt(`Enter the new name to replace all similar names. The first part will be the first name, and the last part will be the last name:`, "");
            if (newName) {
                const nameParts = newName.trim().split(/\s+/);
                const firstName = nameParts.slice(0, -1).join(' ');
                const lastName = nameParts.slice(-1).join(' ');

                for (const pair of duplicatePairs) {
                    await updateCreatorNames(pair.item1, pair.creator1, firstName, lastName);
                    await updateCreatorNames(pair.item2, pair.creator2, firstName, lastName);
                }
            }
        } else if (sanitizedAction === '2') {
            console.log("Ignored all detected similar names.");
        } else if (sanitizedAction === '3') {
            const allSimilarNames = similarNames.join('\n');
            alert(`All similar names:\n${allSimilarNames}`);
        } else if (sanitizedAction === '4') {
            return '4'; // Return to the main loop to adjust the similarity threshold
        } else {
            console.log("Ignored all detected similar names.");
        }
    } while (action === '3');
    return action;
}

async function updateCreatorNames(item, creator, firstName, lastName) {
    try {
        const creators = item.getCreators();
        const updatedCreators = creators.map(c => {
            if (normalizeCreator(c).fullName === creator.fullName) {
                if (c.fieldMode === 1) {
                    c.firstName = "";
                    c.lastName = `${firstName} ${lastName}`.trim();
                } else {
                    c.firstName = firstName;
                    c.lastName = lastName;
                }
                console.log("Updated creator:", c);
            }
            return c;
        });

        item.setCreators(updatedCreators);
        await item.saveTx();
    } catch (error) {
        console.error(`Failed to update creators for item ${item.id}: ${error.message}`);
    }
}

async function getItemsToEdit() {
    try {
        const zoteroPane = Zotero.getActiveZoteroPane();
        const editOption = prompt("Enter '1' to search selected items, '2' for items in the current collection, or '3' for items in a saved search:");

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
