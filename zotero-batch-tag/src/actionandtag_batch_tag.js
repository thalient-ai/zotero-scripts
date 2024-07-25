const Zotero = require("Zotero");
const window = require("window");

(async function () {
    const startTime = new Date();

    // Prevent duplicate execution
    if (window.batchTagRunning) return;
    window.batchTagRunning = true;

    // Utility functions for text case conversion
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
                const userResponse = window.confirm(`Do you want to convert "${p1}" to uppercase in the title "${title}"? Your response will be applied to all future occurrences of "${p1}". (Prompt ${currentIndex} of ${totalCount})`);
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

    /**
     * Escapes special characters for use in regular expressions
     * @param {string} string - The input string to escape
     * @return {string} The escaped string
     */
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Gets the items to edit based on user selection
     * @param {string} triggerType - The type of trigger (menu or other)
     * @param {object} item - The selected item
     * @param {array} items - Array of selected items
     * @return {array|null} Array of items to edit or null if none selected
     */
    async function getItemsToEdit(triggerType, item, items) {
        const zoteroPane = Zotero.getActiveZoteroPane();
        if (triggerType === 'menu') {
            if (items && items.length > 0) {
                return items;
            } else if (item) {
                return [item];
            } else {
                window.alert("No items selected.");
                return null;
            }
        } else {
            let selectedItems = zoteroPane.getSelectedItems();
            if (!selectedItems.length) {
                window.alert("No items selected.");
                return null;
            }
            return selectedItems;
        }
    }

    /**
     * Gets all unique tags from the given items
     * @param {array} items - Array of items
     * @return {array} Array of unique tags
     */
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

    /**
     * Searches for tags using the provided search terms
     * @param {array} allTags - Array of all unique tags
     * @param {string} searchTerms - Comma-separated search terms
     * @return {array} Array of matching tags
     */
    function searchTags(allTags, searchTerms) {
        const terms = searchTerms.split(',').map(term => term.trim());
        const regexes = terms.map(term => new RegExp(escapeRegExp(term), 'i'));
        return allTags.filter(tag => regexes.some(regex => regex.test(tag)));
    }

    /**
     * Prompts the user to select tags from search results
     * @param {array} tags - Array of matching tags
     * @return {array|null} Array of selected tags or null if none selected
     */
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
        const selectedTags = selectedIndices
            .filter(index => !isNaN(index) && index >= 0 && index < tags.length)
            .map(index => tags[index]);

        if (selectedTags.length === 0) {
            window.alert("No valid tags selected.");
            return null;
        }

        return selectedTags;
    }

    /**
     * Adds a tag to the given items
     * @param {string} tag - The tag to add
     * @param {array} items - Array of items
     */
    async function addTagToItems(tag, items) {
        if (!tag) {
            window.alert("Invalid tag.");
            return;
        }

        Zotero.logError(`Adding tag "${tag}" to ${items.length} item(s).`);

        const promises = items.map(async item => {
            try {
                item.addTag(tag);
                await item.saveTx();
                Zotero.logError(`Tag "${tag}" added to item ${item.id}.`);
            } catch (error) {
                Zotero.logError(`Error adding tag to item ${item.id}: ${error.message}`);
            }
        });

        await Promise.all(promises);
        window.alert(`Successfully added the tag "${tag}" to ${items.length} item(s).`);
    }

    /**
     * Removes a tag from the given items
     * @param {string} tag - The tag to remove
     * @param {array} items - Array of items
     */
    async function removeTagFromItems(tag, items) {
        if (!tag) {
            window.alert("Invalid tag.");
            return;
        }

        const itemsToRemoveTag = items.filter(item => {
            const tags = item.getTags().map(t => t.tag);
            return tags.includes(tag);
        });

        if (itemsToRemoveTag.length === 0) {
            window.alert(`No items found with the tag "${tag}".`);
            return;
        }

        const confirmation = window.confirm(`You are about to remove the tag "${tag}" from ${itemsToRemoveTag.length} item(s). Do you want to proceed?`);
        if (!confirmation) {
            window.alert("Operation canceled.");
            return;
        }

        Zotero.logError(`Removing tag "${tag}" from ${itemsToRemoveTag.length} item(s).`);

        const promises = itemsToRemoveTag.map(async item => {
            try {
                item.removeTag(tag);
                await item.saveTx();
                Zotero.logError(`Tag "${tag}" removed from item ${item.id}.`);
            } catch (error) {
                Zotero.logError(`Error removing tag from item ${item.id}: ${error.message}`);
            }
        });

        await Promise.all(promises);
        window.alert(`Tag "${tag}" removed from ${itemsToRemoveTag.length} item(s).`);
    }

    /**
     * Replaces multiple tags with a new tag in the given items
     * @param {array} oldTags - Array of old tags to replace
     * @param {string} newTag - The new tag
     * @param {array} items - Array of items
     */
    async function replaceTagsInItems(oldTags, newTag, items) {
        if (!oldTags || oldTags.length === 0 || !newTag) {
            window.alert("Invalid tags or new tag.");
            return;
        }

        const itemsToReplaceTags = items.filter(item => {
            const itemTags = item.getTags().map(t => t.tag);
            return oldTags.some(tag => itemTags.includes(tag));
        });

        if (itemsToReplaceTags.length === 0) {
            window.alert(`No items found with the tags "${oldTags.join(', ')}".`);
            return;
        }

        Zotero.logError(`Replacing tags "${oldTags.join(', ')}" with "${newTag}" in ${itemsToReplaceTags.length} item(s).`);

        const promises = itemsToReplaceTags.map(async item => {
            try {
                for (const tag of oldTags) {
                    item.removeTag(tag);
                }
                item.addTag(newTag);
                await item.saveTx();
                Zotero.logError(`Tags "${oldTags.join(', ')}" replaced with "${newTag}" in item ${item.id}.`);
            } catch (error) {
                Zotero.logError(`Error replacing tags in item ${item.id}: ${error.message}`);
            }
        });

        await Promise.all(promises);
        window.alert(`Tags "${oldTags.join(', ')}" replaced with "${newTag}" in ${itemsToReplaceTags.length} item(s).`);
    }

    /**
     * Removes all tags from the given items
     * @param {array} items - Array of items
     */
    async function removeAllTagsFromItems(items) {
        const promises = items.map(async item => {
            try {
                const tags = item.getTags().map(t => t.tag);
                for (const tag of tags) {
                    item.removeTag(tag);
                }
                await item.saveTx();
                Zotero.logError(`All tags removed from item ${item.id}.`);
            } catch (error) {
                Zotero.logError(`Error removing all tags from item ${item.id}: ${error.message}`);
            }
        });

        await Promise.all(promises);
        window.alert(`All tags removed from ${items.length} item(s).`);
    }

    /**
     * Removes all tags except specified ones from the given items
     * @param {array} tagsToKeep - Array of tags to keep
     * @param {array} items - Array of items
     */
    async function removeAllExceptTagsFromItems(tagsToKeep, items) {
        const promises = items.map(async item => {
            try {
                const tags = item.getTags().map(t => t.tag);
                for (const tag of tags) {
                    if (!tagsToKeep.includes(tag)) {
                        item.removeTag(tag);
                    }
                }
                await item.saveTx();
                Zotero.logError(`All tags except specified ones removed from item ${item.id}.`);
            } catch (error) {
                Zotero.logError(`Error removing all except specified tags from item ${item.id}: ${error.message}`);
            }
        });

        await Promise.all(promises);
        window.alert(`All tags except specified ones removed from ${items.length} item(s).`);
    }

    /**
     * Removes selected tags from the given items
     * @param {array} selectedTags - Array of selected tags to remove
     * @param {array} items - Array of items
     */
    async function removeSelectedTagsFromItems(selectedTags, items) {
        const promises = items.map(async item => {
            try {
                for (const tag of selectedTags) {
                    item.removeTag(tag);
                }
                await item.saveTx();
                Zotero.logError(`Selected tags removed from item ${item.id}.`);
            } catch (error) {
                Zotero.logError(`Error removing selected tags from item ${item.id}: ${error.message}`);
            }
        });

        await Promise.all(promises);
        window.alert(`Selected tags removed from ${items.length} item(s).`);
    }

    /**
     * Combines two tags into a new tag for the given items
     * @param {string} baseTag - The base tag
     * @param {string} tagToCombineRegex - Regex to match tags to combine with the base tag
     * @param {string} separator - Separator to join the tags
     * @param {array} items - Array of items
     */
    async function combineTagsIntoNewTag(baseTag, tagToCombineRegex, separator, items) {
        if (!baseTag || !tagToCombineRegex || !separator) {
            window.alert("Invalid tags or separator.");
            return;
        }

        const regex = new RegExp(tagToCombineRegex, 'i');
        const tagsToCombine = items.flatMap(item => item.getTags())
            .map(tag => tag.tag)
            .filter(tag => regex.test(tag) && tag !== baseTag)
            .filter((value, index, self) => self.indexOf(value) === index); // unique tags

        if (tagsToCombine.length === 0) {
            window.alert(`No tags matching the pattern "${tagToCombineRegex}" found.`);
            return;
        }

        const summary = tagsToCombine.map(tag => `${baseTag}${separator}${tag}`).join("\n");
        const confirmation = window.confirm(`The following tag combinations will be created:\n\n${summary}\n\nDo you want to proceed?`);
        if (!confirmation) {
            window.alert("Operation canceled.");
            return;
        }

        for (const tag of tagsToCombine) {
            const combinedTag = `${baseTag}${separator}${tag}`;

            const itemsToCombineTags = items.filter(item => {
                const itemTags = item.getTags().map(t => t.tag);
                return itemTags.includes(baseTag) && itemTags.includes(tag);
            });

            if (itemsToCombineTags.length === 0) {
                Zotero.logError(`No items found with both tags "${baseTag}" and "${tag}".`);
                continue;
            }

            Zotero.logError(`Combining tags "${baseTag}" and "${tag}" into "${combinedTag}" in ${itemsToCombineTags.length} item(s).`);

            const promises = itemsToCombineTags.map(async item => {
                try {
                    item.removeTag(baseTag);
                    item.removeTag(tag);
                    item.addTag(combinedTag);
                    await item.saveTx();
                    Zotero.logError(`Tags "${baseTag}" and "${tag}" combined into "${combinedTag}" in item ${item.id}.`);
                } catch (error) {
                    Zotero.logError(`Error combining tags in item ${item.id}: ${error.message}`);
                }
            });

            await Promise.all(promises);
        }

        window.alert(`Tags combined successfully.`);
    }

    /**
     * Splits tags into multiple tags using regex and delimiter for the given items
     * @param {string} tagRegex - Regex to match tags to split
     * @param {string} delimiter - Delimiter to split the tags
     * @param {array} items - Array of items
     */
    async function splitTagInItems(tagRegex, delimiter, items) {
        if (!tagRegex || !delimiter) {
            window.alert("Invalid tag regex or delimiter.");
            return;
        }

        const regex = new RegExp(tagRegex, 'i');
        const tagsToSplit = items.flatMap(item => item.getTags())
            .map(tag => tag.tag)
            .filter(tag => regex.test(tag))
            .filter((value, index, self) => self.indexOf(value) === index); // unique tags

        if (tagsToSplit.length === 0) {
            window.alert(`No tags matching the pattern "${tagRegex}" found.`);
            return;
        }

        const summary = tagsToSplit.map(tag => tag.split(delimiter).join(", ")).join("\n");
        const confirmation = window.confirm(`The following tag splits will be performed:\n\n${summary}\n\nDo you want to proceed?`);
        if (!confirmation) {
            window.alert("Operation canceled.");
            return;
        }

        for (const tag of tagsToSplit) {
            const itemsToSplitTag = items.filter(item => {
                const itemTags = item.getTags().map(t => t.tag);
                return itemTags.includes(tag);
            });

            if (itemsToSplitTag.length === 0) {
                Zotero.logError(`No items found with the tag "${tag}".`);
                continue;
            }

            Zotero.logError(`Splitting tag "${tag}" into multiple tags using delimiter "${delimiter}" in ${itemsToSplitTag.length} item(s).`);

            const promises = itemsToSplitTag.map(async item => {
                try {
                    item.removeTag(tag);
                    const newTags = tag.split(delimiter).map(t => t.trim());
                    for (const newTag of newTags) {
                        item.addTag(newTag);
                    }
                    await item.saveTx();
                    Zotero.logError(`Tag "${tag}" split into "${newTags.join(', ')}" in item ${item.id}.`);
                } catch (error) {
                    Zotero.logError(`Error splitting tag in item ${item.id}: ${error.message}`);
                }
            });

            await Promise.all(promises);
        }

        window.alert(`Tags split successfully.`);
    }

    /**
     * Applies case conversion to tags
     * @param {function} caseFunction - The case conversion function
     * @param {array} items - Array of items
     */
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

    /**
     * Logs the elapsed time for a given operation
     * @param {string} label - Description of the operation
     * @param {number} time - Elapsed time in milliseconds
     */
    function logTime(label, time) {
        try {
            Zotero.logError(`${label}: ${(time / 1000).toFixed(2)} seconds`);
        } catch (error) {
            Zotero.logError(`Failed to log time for ${label}: ${error.message}`);
        }
    }

    /**
     * Prompts the user for valid input
     * @param {string} promptMessage - The prompt message to display
     * @param {array} validOptions - Array of valid options
     * @return {string|null} The valid user input or null if canceled
     */
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

    try {
        if (!items && !item) {
            window.alert("Bulk Edit", "No item or items array provided.");
            window.batchTagRunning = false;
            return;
        }

        let itemsToEdit = await getItemsToEdit(triggerType, item, items);
        if (!itemsToEdit) {
            window.batchTagRunning = false;
            return;
        }

        Zotero.logError(`Total items to edit: ${itemsToEdit.length}`);

        const action = window.prompt(
            `Choose an action:
            1. Add a tag
            2. Remove tags (multiple options)
            3. Replace tags
            4. Split a tag
            5. Combine tags
            6. Apply case conversion to tags`
        );

        switch (action) {
            case '1':
                const tagToAdd = window.prompt("Enter the tag to add:");
                if (tagToAdd) {
                    await addTagToItems(tagToAdd, itemsToEdit);
                } else {
                    window.alert("No tag entered.");
                }
                break;
            case '2':
                const removeAction = window.prompt(
                    `Choose a remove option:
                    1. Remove a single tag
                    2. Remove multiple tags by search
                    3. Remove all tags
                    4. Remove all tags except specified ones`
                );
                switch (removeAction) {
                    case '1':
                        const allTags1 = getAllTags(itemsToEdit);
                        const searchTerm1 = window.prompt("Enter the tag to search for:");
                        const matchingTags1 = searchTags(allTags1, searchTerm1);
                        const tag1 = selectTagsFromSearchResults(matchingTags1);
                        if (tag1) {
                            await removeTagFromItems(tag1[0], itemsToEdit);
                        }
                        break;
                    case '2':
                        const allTags2 = getAllTags(itemsToEdit);
                        const searchTerm2 = window.prompt("Enter the tag search term (e.g., 'temp*' to match 'temp', 'temporary', etc.):");
                        const matchingTags2 = searchTags(allTags2, searchTerm2);
                        const selectedTags2 = selectTagsFromSearchResults(matchingTags2);
                        if (selectedTags2) {
                            await removeSelectedTagsFromItems(selectedTags2, itemsToEdit);
                        }
                        break;
                    case '3':
                        await removeAllTagsFromItems(itemsToEdit);
                        break;
                    case '4':
                        const allTags3 = getAllTags(itemsToEdit);
                        const searchTerm3 = window.prompt("Enter the tag search term to keep (e.g., 'temp*' to match 'temp', 'temporary', etc.):");
                        const matchingTags3 = searchTags(allTags3, searchTerm3);
                        const tagsToKeep = selectTagsFromSearchResults(matchingTags3);
                        if (tagsToKeep) {
                            await removeAllExceptTagsFromItems(tagsToKeep, itemsToEdit);
                        }
                        break;
                    default:
                        window.alert("Invalid remove action.");
                        break;
                }
                break;
            case '3':
                const allTags3 = getAllTags(itemsToEdit);
                const searchTerm3 = window.prompt("Enter the tags to search for (separated by commas):");
                const matchingTags3 = searchTags(allTags3, searchTerm3);
                const oldTags = selectTagsFromSearchResults(matchingTags3);
                if (oldTags) {
                    const newTag = window.prompt("Enter the new tag:");
                    if (newTag) {
                        await replaceTagsInItems(oldTags, newTag, itemsToEdit);
                    } else {
                        window.alert("No new tag entered.");
                    }
                }
                break;
            case '4':
                const allTags4 = getAllTags(itemsToEdit);
                const tagRegex = window.prompt("Enter the regex for the tags to split:");
                const delimiter = window.prompt("Enter the delimiter to split the tags:");
                if (tagRegex && delimiter) {
                    await splitTagInItems(tagRegex, delimiter, itemsToEdit);
                } else {
                    window.alert("Invalid input for regex or delimiter.");
                }
                break;
            case '5':
                const allTags5 = getAllTags(itemsToEdit);
                const baseTag = window.prompt("Enter the base tag to combine:");
                const tagToCombineRegex = window.prompt("Enter the regex for the tags to combine:");
                const separator = window.prompt("Enter the separator to join the tags (e.g., '-'):");
                if (baseTag && tagToCombineRegex && separator) {
                    await combineTagsIntoNewTag(baseTag, tagToCombineRegex, separator, itemsToEdit);
                } else {
                    window.alert("Invalid input for base tag, regex, or separator.");
                }
                break;
            case '6':
                const caseOption = await getValidInput(
                    "Enter '1' for Title Case, '2' for Sentence Case, '3' for Upper Case, '4' for Lower Case:",
                    ['1', '2', '3', '4']
                );
                if (!caseOption) return;

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
