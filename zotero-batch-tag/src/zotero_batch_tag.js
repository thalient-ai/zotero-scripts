(async function () {
    const startTime = performance.now();
    const promptedValues = new Map();

    // Function to escape special characters for regex
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    // Function to get items based on user selection
    async function getItemsToEdit() {
        const zoteroPane = Zotero.getActiveZoteroPane();
        const editOption = prompt("Enter '1' to edit selected items, '2' to edit items in the current collection, or '3' to edit items in a saved search:");

        let contextDescription = '';
        let items;

        switch (editOption) {
            case '2':
                const collection = zoteroPane.getSelectedCollection();
                if (!collection) {
                    alert("No collection selected.");
                    return null;
                }
                contextDescription = `items in the collection "${collection.name}"`;
                items = await collection.getChildItems();
                break;
            case '3':
                const savedSearch = zoteroPane.getSelectedSavedSearch();
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
                contextDescription = `items in the saved search "${savedSearch.name}"`;
                items = await Zotero.Items.getAsync(itemIDs);
                break;
            default:
                let selectedItems = zoteroPane.getSelectedItems();
                if (!selectedItems.length) {
                    alert("No items selected.");
                    return null;
                }
                contextDescription = 'selected items';
                items = selectedItems;
                break;
        }

        return { items, contextDescription };
    }

    // Function to get all unique tags from items
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

    // Function to search for tags using regex
    function searchTags(allTags, searchTerm) {
        let regex = searchTerm === "*" ? new RegExp(".*", 'i') : new RegExp(escapeRegExp(searchTerm), 'i');  // 'i' for case-insensitive search
        return allTags.filter(tag => regex.test(tag));
    }

    // Function to prompt user to select tags from search results
    function selectTagsFromSearchResults(tags) {
        if (tags.length === 0) {
            alert("No matching tags found.");
            return null;
        }

        const choices = tags.map((tag, index) => `${index + 1}. ${tag}`).join("\n");
        const choice = prompt(`Select tags by numbers separated by commas or enter a new search term:\n\n${choices}`);

        if (choice === null) {
            alert("Operation canceled.");
            return null;
        }

        const selectedIndices = choice.split(',').map(str => parseInt(str.trim(), 10) - 1);
        const selectedTags = selectedIndices.filter(index => !isNaN(index) && index >= 0 && index < tags.length).map(index => tags[index]);

        if (selectedTags.length === 0) {
            alert("No valid tags selected.");
            return null;
        }

        return selectedTags;
    }

    // Function to perform tag operations
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
                console.error(`Error during ${operation} tag operation on item ${item.id}: ${error.message}`);
            }
        });

        await Promise.all(promises);
        alert(`Tag operation "${operation}" completed on ${items.length} item(s).`);
    }

    // Function to apply case conversion to tags
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
        alert(`Tags have been updated for ${items.length} item(s).`);
    }

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

    // Main script execution
    try {
        const { items, contextDescription } = await getItemsToEdit();
        if (!items) return;

        console.log(`Total items to edit: ${items.length}`);

        const action = prompt("Enter '1' to add a tag, '2' to remove tags (multiple options), '3' to replace a tag, '4' to split a tag, '5' to combine tags, '6' to apply case conversion to tags, or '7' to add a prefix or suffix to tags:");
        const allTags = getAllTags(items);
        let searchTerm, matchingTags, selectedTags, newTag, delimiter;

        switch (action) {
            case '1':
                tag = prompt("Enter the tag to add:");
                if (tag) await performTagOperation('add', [tag], items);
                else alert("No tag entered.");
                break;
            case '2':
                const removeAction = prompt("Enter '1' to remove a single tag, '2' to remove multiple tags by search, '3' to remove all tags, or '4' to remove all tags except specified ones:");
                switch (removeAction) {
                    case '1':
                        searchTerm = prompt("Enter the tag to search for:");
                        matchingTags = searchTags(allTags, searchTerm);
                        selectedTags = selectTagsFromSearchResults(matchingTags);
                        if (selectedTags) await performTagOperation('remove', selectedTags, items);
                        break;
                    case '2':
                        searchTerm = prompt("Enter the tag search term (e.g., 'temp*' to match 'temp', 'temporary', etc.):");
                        matchingTags = searchTags(allTags, searchTerm);
                        selectedTags = selectTagsFromSearchResults(matchingTags);
                        if (selectedTags) await performTagOperation('remove', selectedTags, items);
                        break;
                    case '3':
                        await performTagOperation('removeAll', [], items);
                        break;
                    case '4':
                        searchTerm = prompt("Enter the tag search term to keep (e.g., 'temp*' to match 'temp', 'temporary', etc.):");
                        matchingTags = searchTags(allTags, searchTerm);
                        selectedTags = selectTagsFromSearchResults(matchingTags);
                        if (selectedTags) {
                            const tagsToKeep = new Set(selectedTags);
                            await performTagOperation('remove', allTags.filter(tag => !tagsToKeep.has(tag)), items);
                        }
                        break;
                    default:
                        alert("Invalid remove action.");
                        break;
                }
                break;
            case '3':
                searchTerm = prompt("Enter the tag to search for:");
                matchingTags = searchTags(allTags, searchTerm);
                selectedTags = selectTagsFromSearchResults(matchingTags);
                if (selectedTags) {
                    newTag = prompt("Enter the new tag:");
                    if (newTag) await performTagOperation('replace', selectedTags, items, [newTag]);
                    else alert("No new tag entered.");
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
                    searchTerm = prompt("Enter the tag to search for:");
                    matchingTags = searchTags(allTags, searchTerm);
                    selectedTags = selectTagsFromSearchResults(matchingTags);
                    if (selectedTags) {
                        delimiter = prompt("Enter the delimiter to split the tag:");
                        if (delimiter) await performTagOperation('split', selectedTags, items, null, delimiter);
                        else alert("No delimiter entered.");
                    }
                } else if (splitAction === '2') {
                    delimiter = prompt("Enter the delimiter to split all tags:");
                    if (delimiter) await performTagOperation('split', allTags, items, null, delimiter);
                    else alert("No delimiter entered.");
                }
                break;
            case '5':
                const baseTag = await selectBaseTag(allTags);
                if (baseTag) {
                    delimiter = prompt("Enter the separator to join the tags (optional):");
                    const tagToCombineRegex = prompt("Enter the regex or tag to combine with:");
                    if (tagToCombineRegex !== null) {
                        const tagsToCombine = searchTags(allTags, tagToCombineRegex);
                        if (tagsToCombine.length > 0) {
                            const newTags = tagsToCombine.map(tag => `${baseTag}${delimiter || ''}${tag}`);
                            await performTagOperation('combine', tagsToCombine.concat(baseTag), items, newTags);
                        } else {
                            alert(`No tags matching the pattern "${tagToCombineRegex}" found.`);
                        }
                    } else {
                        alert("Invalid input for regex.");
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

                await performTagCaseOperation(caseFunction, items);
                break;
            case '7':
                const prefixOrSuffix = await getValidInput(
                    "Enter '1' to add a prefix or '2' to add a suffix:",
                    ['1', '2']
                );

                newTag = prompt(`Enter the ${prefixOrSuffix === '1' ? 'prefix' : 'suffix'} to add:`);
                if (!newTag) {
                    alert("No prefix or suffix entered.");
                    break;
                }

                matchingTags = await searchAndSelectTags(allTags);

                if (matchingTags) {
                    const newTags = matchingTags.map(tag =>
                        prefixOrSuffix === '1' ? `${newTag}${tag}` : `${tag}${newTag}`
                    );
                    await performTagOperation(prefixOrSuffix === '1' ? 'prefix' : 'suffix', matchingTags, items, newTags);
                } else {
                    alert("No tags matching the pattern found.");
                }
                break;
            default:
                alert("Invalid action.");
                break;
        }
    } catch (error) {
        console.error(`Error in batch tag script: ${error.message}`);
        alert(`An error occurred: ${error.message}`);
    } finally {
        const endTime = performance.now();
        console.log(`Total time: ${(endTime - startTime) / 1000} seconds`);
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

    async function selectBaseTag(allTags) {
        let baseTagChoices = searchTags(allTags, prompt("Enter a search term for the base tag:"));
        baseTagChoices = baseTagChoices.map((tag, index) => `${index + 1}. ${tag}`).join("\n");
        const baseTagChoice = prompt(`Select a base tag by number or enter a new search term:\n\n${baseTagChoices}`);

        if (baseTagChoice === null) {
            alert("Operation canceled.");
            return null;
        }

        const baseTagIndex = parseInt(baseTagChoice.trim(), 10) - 1;
        if (isNaN(baseTagIndex) || baseTagIndex < 0 || baseTagIndex >= baseTagChoices.length) {
            alert("Invalid choice.");
            return null;
        }

        return baseTagChoices.split("\n")[baseTagIndex].split(". ")[1];
    }

    async function searchAndSelectTags(allTags) {
        const searchTerm = prompt("Enter the regex or tag to search for:");
        const matchingTags = searchTags(allTags, searchTerm);
        if (matchingTags.length === 0) {
            alert("No matching tags found.");
            return null;
        }

        return matchingTags;
    }
})();
