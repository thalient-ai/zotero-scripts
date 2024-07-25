(async function () {
    const startTime = performance.now();
    const promptedValues = new Map(); // Map to keep track of prompted values and user responses

    try {
        const zoteroPane = Zotero.getActiveZoteroPane();

        const customCapitalization = {
            'nist': 'NIST',
            'nerc': 'NERC',
            // ... (additional custom capitalizations)
        };

        function toTitleCase(str, title, currentIndex, totalCount) {
            const lowerCaseWords = ["a", "an", "and", "as", "at", "but", "by", "for", "if", "nor", "of", "on", "or", "so", "the", "to", "up", "yet"];
            const separators = ['-', ':', '–', '/', '"', '“', '”'];

            let words = str.split(' ');

            for (let i = 0; i < words.length; i++) {
                let word = words[i];
                const lowerWord = word.toLowerCase();

                if (customCapitalization[lowerWord]) {
                    words[i] = customCapitalization[lowerWord];
                    continue;
                }

                if (i === 0 || i === words.length - 1 || !lowerCaseWords.includes(lowerWord) || isFollowingSpecialChar(words, i, separators) || word.length >= 4) {
                    words[i] = capitalizeHyphenatedAndSlashed(word);
                } else {
                    words[i] = lowerWord;
                }
            }

            for (let i = 0; i < words.length; i++) {
                if (words[i].startsWith('"') && words[i].length > 1) {
                    words[i] = '"' + capitalizeFirstLetter(words[i].slice(1));
                }
            }

            return words.join(' ').replace(/\(([^)]+)\)/g, function (match, p1) {
                const lowerP1 = p1.toLowerCase();
                if (customCapitalization[lowerP1]) {
                    return `(${customCapitalization[lowerP1]})`;
                }
                if (promptedValues.has(lowerP1)) {
                    return `(${promptedValues.get(lowerP1)})`;
                }
                if (p1 !== p1.toUpperCase()) {
                    const userResponse = confirm(`Do you want to convert "${p1}" to uppercase in the title "${title}"? Your response will be applied to all future occurrences of "${p1}". (Prompt ${currentIndex} of ${totalCount})`);
                    const userResponseValue = userResponse ? p1.toUpperCase() : p1;
                    promptedValues.set(lowerP1, userResponseValue);
                    return `(${userResponseValue})`;
                }
                return match;
            });
        }

        function capitalizeHyphenatedAndSlashed(word) {
            const separators = ['-', '/'];
            return word.split(new RegExp(`(${separators.join('|')})`)).map(part => capitalizeFirstLetter(part)).join('');
        }

        function capitalizeFirstLetter(word) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }

        function isFollowingSpecialChar(arr, index, separators) {
            if (index > 0) {
                const prevWord = arr[index - 1];
                return separators.some(separator => prevWord.endsWith(separator));
            }
            return false;
        }

        function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        function toSentenceCase(str) {
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase().replace(/(\.\s*\w)/g, function (c) {
                return c.toUpperCase();
            });
        }

        function toUpperCase(str) {
            return str.toUpperCase();
        }

        function toLowerCase(str) {
            return str.toLowerCase();
        }

        async function getValidInput(promptMessage, validOptions) {
            while (true) {
                const userInput = prompt(promptMessage);
                const sanitizedInput = userInput ? userInput.trim() : null;
                if (sanitizedInput === null) {
                    alert("Operation canceled.");
                    return null;
                }
                if (validOptions.includes(sanitizedInput)) {
                    return sanitizedInput;
                } else {
                    alert(`Invalid option: "${sanitizedInput}". Please enter one of the following: ${validOptions.join(', ')}.`);
                }
            }
        }

        const editOption = await getValidInput(
            "Enter '1' to edit only selected items, '2' to edit all items in the current collection, or '3' to edit all items in a saved search:",
            ['1', '2', '3']
        );
        logTime("Time to get valid edit option", performance.now() - startTime);

        const itemsToEdit = await getItemsToEdit(editOption, zoteroPane);
        if (!itemsToEdit || !itemsToEdit.length) {
            Zotero.alert(null, "No items found", "No items found to edit based on your selection.");
            return;
        }
        logTime("Time to retrieve items", performance.now() - startTime);

        const caseOption = await getValidInput(
            "Enter '1' for Title Case, '2' for Sentence Case, '3' for Upper Case, '4' for Lower Case:",
            ['1', '2', '3', '4']
        );
        logTime("Time to get valid case option", performance.now() - startTime);

        const fieldOption = await getValidInput(
            "Enter '1' to edit Title field, '2' to edit Short Title field, '3' to edit both:",
            ['1', '2', '3']
        );
        logTime("Time to get valid field option", performance.now() - startTime);

        let caseFunction;
        switch (caseOption) {
            case '1':
                caseFunction = (str, currentIndex, totalCount) => toTitleCase(str, str, currentIndex, totalCount);
                break;
            case '2':
                caseFunction = toSentenceCase;
                break;
            case '3':
                caseFunction = toUpperCase;
                break;
            case '4':
                caseFunction = toLowerCase;
                break;
        }

        const confirmationMessage = `You have chosen to edit the titles of ${itemsToEdit.length} records.\n\nDo you want to proceed?`;
        const confirmation = confirm(confirmationMessage);
        if (!confirmation) {
            console.log("User cancelled the editing process.");
            return;
        }
        console.log(confirmationMessage);

        const batchEditPromises = [];
        for (let index = 0; index < itemsToEdit.length; index++) {
            const item = itemsToEdit[index];
            if (!item.isNote()) {
                if (fieldOption === '1' || fieldOption === '3') {
                    const oldTitle = item.getField('title');
                    const newTitle = caseFunction(oldTitle, index + 1, itemsToEdit.length);
                    item.setField('title', newTitle);
                    console.log(`Updated title of item ${item.id}: "${oldTitle}" to "${newTitle}"`);
                }
                if (fieldOption === '2' || fieldOption === '3') {
                    const oldShortTitle = item.getField('shortTitle');
                    const newShortTitle = caseFunction(oldShortTitle, index + 1, itemsToEdit.length);
                    item.setField('shortTitle', newShortTitle);
                    console.log(`Updated short title of item ${item.id}: "${oldShortTitle}" to "${newShortTitle}"`);
                }
                batchEditPromises.push(item.saveTx());
            }
        }

        await Promise.all(batchEditPromises);
        Zotero.alert(null, "Title Case Update Complete", "The titles of the selected items have been updated.");

    } catch (error) {
        console.error(`Error in title case update script: ${error.message}`);
        alert(`An error occurred: ${error.message}`);
    } finally {
        const endTime = performance.now();
        logTime("Total time", endTime - startTime);
    }

    function logTime(label, time) {
        try {
            console.log(`${label}: ${(time / 1000).toFixed(2)} seconds`);
        } catch (error) {
            console.error(`Failed to log time for ${label}: ${error.message}`);
        }
    }

    async function getItemsToEdit(editOption, zoteroPane) {
        if (editOption === '2') {
            let collection = zoteroPane.getSelectedCollection();
            if (!collection) {
                alert("No collection selected.");
                return null;
            }
            return await collection.getChildItems();
        } else if (editOption === '3') {
            let savedSearch = zoteroPane.getSelectedSavedSearch();
            if (!savedSearch) {
                alert("No saved search selected.");
                return null;
            }

            let search = new Zotero.Search();
            search.libraryID = savedSearch.libraryID;
            search.addCondition('savedSearchID', 'is', savedSearch.id);

            let itemIDs = await search.search();
            if (itemIDs.length === 0) {
                alert("No items found in the saved search.");
                return null;
            }

            return await Zotero.Items.getAsync(itemIDs);
        } else {
            let selectedItems = zoteroPane.getSelectedItems();
            if (!selectedItems.length) {
                alert("No items selected.");
                return null;
            }
            return selectedItems;
        }
    }
})();
