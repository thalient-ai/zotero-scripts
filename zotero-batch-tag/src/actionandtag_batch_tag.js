const Zotero = require("Zotero");
const window = require("window");

(async function () {
    const startTime = new Date();

    // Prevent duplicate execution
    if (window.batchTagRunning) return;
    window.batchTagRunning = true;

    // Custom capitalization dictionary
    const customCapitalization = {
        'nist': 'NIST',
        'nerc': 'NERC',
    };

    // Convert a string to title case based on specified rules
    function toTitleCase(str, title, currentIndex, totalCount) {
        const lowerCaseWords = ["a", "an", "and", "as", "at", "but", "by", "for", "if", "nor", "of", "on", "or", "so", "the", "to", "up", "yet"];
        const separators = ['-', ':', '–', '/', '"', '“', '”'];

        let words = str.split(' ');

        for (let i = 0; i < words.length; i++) {
            let word = words[i];
            const lowerWord = word.toLowerCase();

            // Handle custom capitalization
            if (customCapitalization[lowerWord]) {
                words[i] = customCapitalization[lowerWord];
                continue;
            }

            // Capitalize the first and last word, words following a special character, and major words
            if (i === 0 || i === words.length - 1 || !lowerCaseWords.includes(lowerWord) || isFollowingSpecialChar(words, i, separators) || word.length >= 4) {
                words[i] = capitalizeHyphenatedAndSlashed(word);
            } else {
                words[i] = lowerWord;
            }
        }

        // Ensure words following quotation marks are capitalized
        for (let i = 0; i < words.length; i++) {
            if (words[i].startsWith('"') && words[i].length > 1) {
                words[i] = '"' + capitalizeFirstLetter(words[i].slice(1));
            }
        }

        // Handle text within parentheses
        return words.join(' ').replace(/\(([^)]+)\)/g, function (match, p1) {
            const lowerP1 = p1.toLowerCase();
            if (customCapitalization[lowerP1]) {
                return `(${customCapitalization[lowerP1]})`;
            }
            if (promptedValues.has(lowerP1)) {
                return `(${promptedValues.get(lowerP1)})`;
            }
            if (p1 !== p1.toUpperCase()) {
                const userResponse = window.confirm(`Do you want to convert "${p1}" to uppercase in the title "${title}"? Your response will be applied to all future occurrences of "${p1}". (Prompt ${currentIndex} of ${totalCount})`);
                const userResponseValue = userResponse ? p1.toUpperCase() : p1;
                promptedValues.set(lowerP1, userResponseValue);
                return `(${userResponseValue})`;
            }
            return match;
        });
    }

    // Capitalize both parts of a hyphenated or slashed word
    function capitalizeHyphenatedAndSlashed(word) {
        const separators = ['-', '/'];
        return word.split(new RegExp(`(${separators.join('|')})`)).map(part => capitalizeFirstLetter(part)).join('');
    }

    // Capitalize the first letter of a word
    function capitalizeFirstLetter(word) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }

    // Check if the word follows a special character (-, :, –, /, ")
    function isFollowingSpecialChar(arr, index, separators) {
        if (index > 0) {
            const prevWord = arr[index - 1];
            return separators.some(separator => prevWord.endsWith(separator));
        }
        return false;
    }

    // Convert a string to sentence case
    function toSentenceCase(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase().replace(/(\.\s*\w)/g, function (c) {
            return c.toUpperCase();
        });
    }

    // Convert a string to upper case
    function toUpperCase(str) {
        return str.toUpperCase();
    }

    // Convert a string to lower case
    function toLowerCase(str) {
        return str.toLowerCase();
    }


    // Escape special characters for use in regular expressions
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Get items to edit based on user selection using the Actions and Tags plugin environment
    async function getItemsToEdit(triggerType, item, items) {
        if (items && items.length > 0) {
            // Return multiple items if selected
            return items;
        } else if (item) {
            // Return single item if selected
            return [item];
        } else {
            window.alert("No items selected.");
            return null;
        }
    }

    // Get all unique tags from items
    function getAllTags(items) {
        const tagSet = new Set();
        for (const item of items) {
            const tags = item.getTags();
            for (const tag of tags) {
                tagSet.add(tag.tag);
            }
        }
        return Array.from(tagSet);
    }

    // Function to search tags based on search term (with optional wildcard '*')
    function searchTags(allTags, searchTerm) {
        let regex;
        if (searchTerm.includes('*')) {
            regex = new RegExp(searchTerm.replace(/\*/g, '.*'), 'i');  // Replace all occurrences of '*' with '.*'
        } else {
            regex = new RegExp(escapeRegExp(searchTerm), 'i');
        }
        return allTags.filter(tag => regex.test(tag));
    }

    // Prompt user to select tags from search results
    function selectTagsFromSearchResults(tags) {
        if (tags.length === 0) {
            window.alert("No matching tags found.");
            return null;
        }

        const choices = tags.map((tag, index) => `${index + 1}. ${tag}`).join("\n");
        const choice = window.prompt(`Select tags by numbers separated by commas or enter a new search term:\n\n${choices}`);

        if (choice === null) {
            window.alert("Operation canceled.");
            return null;
        }

        const selectedIndices = choice.split(',').map(str => parseInt(str.trim(), 10) - 1);
        const selectedTags = selectedIndices.filter(index => !isNaN(index) && index >= 0 && index < tags.length).map(index => tags[index]);

        if (selectedTags.length === 0) {
            window.alert("No valid tags selected.");
            return null;
        }

        return selectedTags;
    }

    // Get valid input from the user based on predefined options
    async function getValidInput(promptMessage, validOptions) {
        while (true) {
            const userInput = window.prompt(promptMessage);
            const sanitizedInput = userInput ? userInput.trim() : null;
            if (sanitizedInput === null) {
                window.alert("Operation canceled.");
                return null;
            }
            if (validOptions.includes(sanitizedInput)) {
                return sanitizedInput;
            } else {
                window.alert(`Invalid option: "${sanitizedInput}". Please enter one of the following: ${validOptions.join(', ')}.`);
            }
        }
    }

    // Perform tag operations (add, remove, replace, split, combine, prefix, suffix)
    async function performTagOperation(operation, tags, items, newTags = [], delimiter = null) {
        const promises = items.map(async item => {
            try {
                if (operation === 'add') {
                    item.addTag(tags[0]);
                } else if (operation === 'remove') {
                    for (const tag of tags) {
                        item.removeTag(tag);
                    }
                } else if (operation === 'removeAll') {
                    item.setTags([]);
                } else if (operation === 'replace') {
                    for (const tag of tags) {
                        item.removeTag(tag);
                    }
                    item.addTag(newTags[0]);
                } else if (operation === 'split') {
                    for (const tag of tags) {
                        const itemTags = item.getTags().map(t => t.tag);
                        if (itemTags.includes(tag)) {
                            item.removeTag(tag);
                            const splitTags = tag.split(delimiter).map(t => t.trim());
                            for (const newTag of splitTags) {
                                item.addTag(newTag);
                            }
                        }
                    }
                } else if (operation === 'combine') {
                    for (const tag of tags) {
                        item.removeTag(tag);
                    }
                    for (const newTag of newTags) {
                        item.addTag(newTag);
                    }
                } else if (operation === 'prefix' || operation === 'suffix') {
                    for (const tag of tags) {
                        item.removeTag(tag);
                    }
                    for (const newTag of newTags) {
                        item.addTag(newTag);
                    }
                }
                await item.saveTx();
            } catch (error) {
                Zotero.logError(`Error during ${operation} tag operation on item ${item.id}: ${error.message}`);
            }
        });

        await Promise.all(promises);
        window.alert(`Tag operation "${operation}" completed on ${items.length} item(s).`);
    }

 // Apply case conversion to tags
    async function performTagCaseOperation(caseFunction, items) {
        const allTags = getAllTags(items);
        const tagMap = new Map();

        for (let tag of allTags) {
            const newTag = caseFunction(tag, allTags.indexOf(tag) + 1, allTags.length);
            tagMap.set(tag, newTag);
        }

        const promises = items.map(async item => {
            const tags = item.getTags();
            const newTags = tags.map(t => {
                return { tag: tagMap.get(t.tag) || t.tag };
            });
            item.setTags(newTags);
            await item.saveTx();
        });

        await Promise.all(promises);
        window.alert(`Tags have been updated for ${items.length} item(s).`);
    }

    // Log the elapsed time for a given operation
    function logTime(label, time) {
        try {
            Zotero.logError(`${label}: ${(time / 1000).toFixed(2)} seconds`);
        } catch (error) {
            Zotero.logError(`Failed to log time for ${label}: ${error.message}`);
        }
    }

    // Get valid input from the user based on predefined options
    async function getValidInput(promptMessage, validOptions) {
        while (true) {
            const userInput = window.prompt(promptMessage);
            const sanitizedInput = userInput ? userInput.trim() : null;
            if (sanitizedInput === null) {
                window.alert("Operation canceled.");
                return null;
            }
            if (validOptions.includes(sanitizedInput)) {
                return sanitizedInput;
            } else {
                window.alert(`Invalid option: "${sanitizedInput}". Please enter one of the following: ${validOptions.join(', ')}.`);
            }
        }
    }

    // Select a base tag from search results
    async function selectBaseTag(allTags) {
        let baseTagChoices = searchTags(allTags, window.prompt("Enter a search term for the base tag:"));
        baseTagChoices = baseTagChoices.map((tag, index) => `${index + 1}. ${tag}`).join("\n");
        const baseTagChoice = window.prompt(`Select a base tag by number or enter a new search term:\n\n${baseTagChoices}`);

        if (baseTagChoice === null) {
            window.alert("Operation canceled.");
            return null;
        }

        const baseTagIndex = parseInt(baseTagChoice.trim(), 10) - 1;
        if (isNaN(baseTagIndex) || baseTagIndex < 0 || baseTagIndex >= baseTagChoices.length) {
            window.alert("Invalid choice.");
            return null;
        }

        return baseTagChoices.split("\n")[baseTagIndex].split(". ")[1];
    }

    // Search and select tags from search results
    async function searchAndSelectTags(allTags) {
        const searchTerm = window.prompt("Enter the regex or tag to search for:");
        const matchingTags = searchTags(allTags, searchTerm);
        if (matchingTags.length === 0) {
            window.alert("No matching tags found.");
            return null;
        }

        return matchingTags;
    }

    try {
        // Ensure items and item are provided
        if (!items && !item) {
            window.alert("Batch Tag Operation", "No item or items array provided.");
            window.batchTagRunning = false;
            return;
        }

        // Get items to edit based on user selection
        let itemsToEdit = await getItemsToEdit(triggerType, item, items);
        if (!itemsToEdit) {
            window.batchTagRunning = false;
            return;
        }

        Zotero.logError(`Total items to edit: ${itemsToEdit.length}`);

        // Get the action to perform from the user
        const action = await getValidInput(
            `Choose an action:
            1. Add a tag
            2. Remove tags (multiple options)
            3. Replace tags
            4. Split a tag
            5. Combine tags
            6. Apply case conversion to tags
            7. Add prefix or suffix to tags`,
            ['1', '2', '3', '4', '5', '6', '7']
        );

        let searchTerm, matchingTags, selectedTags, newTag, delimiter;

        switch (action) {
            case '1':
                const tagToAdd = window.prompt("Enter the tag to add:");
                if (tagToAdd) await performTagOperation('add', [tagToAdd], itemsToEdit);
                else window.alert("No tag entered.");
                break;
            case '2':
                const removeAction = await getValidInput(
                    `Choose a remove option:
                    1. Remove a single tag
                    2. Remove multiple tags by search
                    3. Remove all tags
                    4. Remove all tags except specified ones`,
                    ['1', '2', '3', '4']
                );
                switch (removeAction) {
                    case '1':
                        searchTerm = window.prompt("Enter the tag to search for:");
                        matchingTags = searchTags(getAllTags(itemsToEdit), searchTerm);
                        selectedTags = selectTagsFromSearchResults(matchingTags);
                        if (selectedTags) await performTagOperation('remove', selectedTags, itemsToEdit);
                        break;
                    case '2':
                        searchTerm = window.prompt("Enter the tag search term (e.g., 'temp*' to match 'temp', 'temporary', etc.):");
                        matchingTags = searchTags(getAllTags(itemsToEdit), searchTerm);
                        selectedTags = selectTagsFromSearchResults(matchingTags);
                        if (selectedTags) await performTagOperation('remove', selectedTags, itemsToEdit);
                        break;
                    case '3':
                        await performTagOperation('removeAll', [], itemsToEdit);
                        break;
                    case '4':
                        searchTerm = window.prompt("Enter the tag search term to keep (e.g., 'temp*' to match 'temp', 'temporary', etc.):");
                        matchingTags = searchTags(getAllTags(itemsToEdit), searchTerm);
                        selectedTags = selectTagsFromSearchResults(matchingTags);
                        if (selectedTags) {
                            const tagsToKeep = new Set(selectedTags);
                            await performTagOperation('remove', getAllTags(itemsToEdit).filter(tag => !tagsToKeep.has(tag)), itemsToEdit);
                        }
                        break;
                }
                break;
            case '3':
                searchTerm = window.prompt("Enter the tags to search for (separated by commas):");
                matchingTags = searchTags(getAllTags(itemsToEdit), searchTerm);
                selectedTags = selectTagsFromSearchResults(matchingTags);
                if (selectedTags) {
                    newTag = window.prompt("Enter the new tag:");
                    if (newTag) await performTagOperation('replace', selectedTags, itemsToEdit, [newTag]);
                    else window.alert("No new tag entered.");
                }
                break;
            case '4':
                const splitAction = await getValidInput(
                    `Choose a split option:
                    1. Split a single tag
                    2. Split all tags by a specified delimiter`,
                    ['1', '2']
                );
                if (splitAction === '1') {
                    searchTerm = window.prompt("Enter the tag to search for:");
                    matchingTags = searchTags(getAllTags(itemsToEdit), searchTerm);
                    selectedTags = selectTagsFromSearchResults(matchingTags);
                    if (selectedTags) {
                        delimiter = window.prompt("Enter the delimiter to split the tag:");
                        if (delimiter) await performTagOperation('split', selectedTags, itemsToEdit, null, delimiter);
                        else window.alert("No delimiter entered.");
                    }
                } else if (splitAction === '2') {
                    delimiter = window.prompt("Enter the delimiter to split all tags:");
                    if (delimiter) await performTagOperation('split', getAllTags(itemsToEdit), itemsToEdit, null, delimiter);
                    else window.alert("No delimiter entered.");
                }
                break;
            case '5':
                const allTags = getAllTags(itemsToEdit);
                const baseTag = await selectBaseTag(allTags);
                if (baseTag) {
                    delimiter = window.prompt("Enter the separator to join the tags (optional):");
                    const tagToCombineRegex = window.prompt("Enter the regex or tag to combine with:");
                    if (tagToCombineRegex !== null) {
                        const tagsToCombine = searchTags(allTags, tagToCombineRegex);
                        if (tagsToCombine.length > 0) {
                            const newTags = tagsToCombine.map(tag => `${baseTag}${delimiter || ''}${tag}`);
                            await performTagOperation('combine', tagsToCombine.concat(baseTag), itemsToEdit, newTags);
                        } else {
                            window.alert(`No tags matching the pattern "${tagToCombineRegex}" found.`);
                        }
                    } else {
                        window.alert("Invalid input for regex.");
                    }
                }
                break;
            case '6':
                const caseOption = await getValidInput(
                    "Enter '1' for Title Case, '2' for Sentence Case, '3' for Upper Case, '4' for Lower Case:",
                    ['1', '2', '3', '4']
                );

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

                await performTagCaseOperation(caseFunction, itemsToEdit);
                break;
            case '7':
                const prefixOrSuffix = await getValidInput(
                    "Enter '1' to add a prefix or '2' to add a suffix:",
                    ['1', '2']
                );

                newTag = window.prompt(`Enter the ${prefixOrSuffix === '1' ? 'prefix' : 'suffix'} to add:`);
                if (!newTag) {
                    window.alert("No prefix or suffix entered.");
                    break;
                }

                matchingTags = await searchAndSelectTags(getAllTags(itemsToEdit));

                if (matchingTags) {
                    const newTags = matchingTags.map(tag =>
                        prefixOrSuffix === '1' ? `${newTag}${tag}` : `${tag}${newTag}`
                    );
                    await performTagOperation(prefixOrSuffix === '1' ? 'prefix' : 'suffix', matchingTags, itemsToEdit, newTags);
                } else {
                    window.alert("No tags matching the pattern found.");
                }
                break;
            default:
                window.alert("Invalid action.");
                break;
        }
    } catch (error) {
        Zotero.logError(`Error in batch tag script: ${error.message}`);
        window.alert(`An error occurred: ${error.message}`);
    } finally {
        window.batchTagRunning = false;
        const endTime = new Date();
        logTime("Total time", endTime - startTime);
    }
})();
