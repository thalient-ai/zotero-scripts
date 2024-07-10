(async function() {
    const startTime = performance.now();

    // Function to get items to edit based on user selection
    async function getItemsToEdit() {
        const zoteroPane = Zotero.getActiveZoteroPane();
        const editOption = prompt("Enter '1' to edit selected items, '2' to edit items in the current collection, or '3' to edit items in a saved search:");

        let contextDescription = '';
        let items;

        if (editOption === '2') {
            let collection = zoteroPane.getSelectedCollection();
            if (!collection) {
                alert("No collection selected.");
                return null;
            }
            contextDescription = `items in the collection "${collection.name}"`;
            items = await collection.getChildItems();
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
            contextDescription = `items in the saved search "${savedSearch.name}"`;
            items = await Zotero.Items.getAsync(itemIDs);
        } else {
            let selectedItems = zoteroPane.getSelectedItems();
            if (!selectedItems.length) {
                alert("No items selected.");
                return null;
            }
            contextDescription = 'selected items';
            items = selectedItems;
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
        let regex;
        if (searchTerm === "*") {
            regex = new RegExp(".*", 'i');  // match all tags
        } else {
            regex = new RegExp(escapeRegExp(searchTerm), 'i');  // 'i' for case-insensitive search
        }
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
        const selectedTags = selectedIndices
            .filter(index => !isNaN(index) && index >= 0 && index < tags.length)
            .map(index => tags[index]);

        if (selectedTags.length === 0) {
            alert("No valid tags selected.");
            return null;
        }

        return selectedTags;
    }

    // Function to add a tag to items
    async function addTagToItems(tag, items) {
        if (!tag) {
            alert("Invalid tag.");
            return;
        }

        console.log(`Adding tag "${tag}" to ${items.length} item(s).`);

        const promises = items.map(async item => {
            try {
                item.addTag(tag);
                await item.saveTx();
                console.log(`Tag "${tag}" added to item ${item.id}.`);
            } catch (error) {
                console.error(`Error adding tag to item ${item.id}: ${error.message}`);
            }
        });

        await Promise.all(promises);
        alert(`Successfully added the tag "${tag}" to ${items.length} item(s).`);
    }

    // Function to remove a tag from items
    async function removeTagFromItems(tag, items) {
        if (!tag) {
            alert("Invalid tag.");
            return;
        }

        const itemsToRemoveTag = items.filter(item => {
            const tags = item.getTags().map(t => t.tag);
            return tags.includes(tag);
        });

        if (itemsToRemoveTag.length === 0) {
            alert(`No items found with the tag "${tag}".`);
            return;
        }

        const confirmation = confirm(`You are about to remove the tag "${tag}" from ${itemsToRemoveTag.length} item(s). Do you want to proceed?`);
        if (!confirmation) {
            alert("Operation canceled.");
            return;
        }

        console.log(`Removing tag "${tag}" from ${itemsToRemoveTag.length} item(s).`);

        const promises = itemsToRemoveTag.map(async item => {
            try {
                item.removeTag(tag);
                await item.saveTx();
                console.log(`Tag "${tag}" removed from item ${item.id}.`);
            } catch (error) {
                console.error(`Error removing tag from item ${item.id}: ${error.message}`);
            }
        });

        await Promise.all(promises);
        alert(`Tag "${tag}" removed from ${itemsToRemoveTag.length} item(s).`);
    }

    // Function to replace a tag in items
    async function replaceTagInItems(oldTag, newTag, items) {
        if (!oldTag || !newTag) {
            alert("Invalid tags.");
            return;
        }

        const itemsToReplaceTag = items.filter(item => {
            const tags = item.getTags().map(t => t.tag);
            return tags.includes(oldTag);
        });

        if (itemsToReplaceTag.length === 0) {
            alert(`No items found with the tag "${oldTag}".`);
            return;
        }

        console.log(`Replacing tag "${oldTag}" with "${newTag}" in ${itemsToReplaceTag.length} item(s).`);

        const promises = itemsToReplaceTag.map(async item => {
            try {
                item.removeTag(oldTag);
                item.addTag(newTag);
                await item.saveTx();
                console.log(`Tag "${oldTag}" replaced with "${newTag}" in item ${item.id}.`);
            } catch (error) {
                console.error(`Error replacing tag in item ${item.id}: ${error.message}`);
            }
        });

        await Promise.all(promises);
        alert(`Tag "${oldTag}" replaced with "${newTag}" in ${itemsToReplaceTag.length} item(s).`);
    }

    // Function to remove all tags from items
    async function removeAllTagsFromItems(items) {
        const confirmation = confirm(`You are about to remove all tags from ${items.length} item(s). Do you want to proceed?`);
        if (!confirmation) {
            alert("Operation canceled.");
            return;
        }

        console.log(`Removing all tags from ${items.length} item(s).`);

        const promises = items.map(async item => {
            try {
                const tags = item.getTags().map(tag => tag.tag);
                for (const tag of tags) {
                    item.removeTag(tag);
                }
                await item.saveTx();
                console.log(`All tags removed from item ${item.id}.`);
            } catch (error) {
                console.error(`Error removing tags from item ${item.id}: ${error.message}`);
            }
        });

        await Promise.all(promises);
        alert(`All tags removed from ${items.length} item(s).`);
    }

    // Function to remove selected tags from items
    async function removeSelectedTagsFromItems(tags, items, contextDescription) {
        if (!tags || tags.length === 0) {
            alert("No tags selected.");
            return;
        }

        const confirmation = confirm(`You are about to remove the following tags from ${contextDescription}: ${tags.join(', ')}. Do you want to proceed?`);
        if (!confirmation) {
            alert("Operation canceled.");
            return;
        }

        console.log(`Removing tags "${tags.join(', ')}" from ${contextDescription}.`);

        const promises = items.map(async item => {
            try {
                const itemTags = item.getTags().map(tag => tag.tag);
                for (const tag of tags) {
                    if (itemTags.includes(tag)) {
                        item.removeTag(tag);
                    }
                }
                await item.saveTx();
                console.log(`Tags "${tags.join(', ')}" removed from item ${item.id}.`);
            } catch (error) {
                console.error(`Error removing tags from item ${item.id}: ${error.message}`);
            }
        });

        await Promise.all(promises);
        alert(`Tags "${tags.join(', ')}" removed from ${contextDescription}.`);
    }

    // Function to remove all tags except specified ones
    async function removeAllExceptTagsFromItems(tagsToKeep, items, contextDescription) {
        if (!tagsToKeep || tagsToKeep.length === 0) {
            alert("No tags specified to keep.");
            return;
        }

        const confirmation = confirm(`You are about to remove all tags except the following from ${contextDescription}: ${tagsToKeep.join(', ')}. Do you want to proceed?`);
        if (!confirmation) {
            alert("Operation canceled.");
            return;
        }

        console.log(`Removing all tags except "${tagsToKeep.join(', ')}" from ${contextDescription}.`);

        const promises = items.map(async item => {
            try {
                const itemTags = item.getTags().map(tag => tag.tag);
                for (const tag of itemTags) {
                    if (!tagsToKeep.includes(tag)) {
                        item.removeTag(tag);
                    }
                }
                await item.saveTx();
                console.log(`Tags except "${tagsToKeep.join(', ')}" removed from item ${item.id}.`);
            } catch (error) {
                console.error(`Error removing tags from item ${item.id}: ${error.message}`);
            }
        });

        await Promise.all(promises);
        alert(`All tags except "${tagsToKeep.join(', ')}" removed from ${contextDescription}.`);
    }

    function logTime(label, time) {
        try {
            console.log(`${label}: ${(time / 1000).toFixed(2)} seconds`);
        } catch (error) {
            console.error(`Failed to log time for ${label}: ${error.message}`);
        }
    }

    try {
        const { items, contextDescription } = await getItemsToEdit();
        if (!items) {
            return;
        }

        console.log(`Total items to edit: ${items.length}`);

        const action = prompt("Enter '1' to add a tag, '2' to remove a tag, '3' to replace a tag, '4' to remove all tags, '5' to remove multiple tags by search, or '6' to remove all tags except specified ones:");
        if (action === '1') {
            const tag = prompt("Enter the tag to add:");
            if (tag) {
                await addTagToItems(tag, items);
            } else {
                alert("No tag entered.");
            }
        } else if (action === '2') {
            const allTags = getAllTags(items);
            const searchTerm = prompt("Enter the tag to search for:");
            const matchingTags = searchTags(allTags, searchTerm);
            const tag = selectTagsFromSearchResults(matchingTags);
            if (tag) {
                await removeTagFromItems(tag[0], items);
            }
        } else if (action === '3') {
            const allTags = getAllTags(items);
            const searchTerm = prompt("Enter the tag to search for:");
            const matchingTags = searchTags(allTags, searchTerm);
            const oldTag = selectTagsFromSearchResults(matchingTags);
            if (oldTag) {
                const newTag = prompt("Enter the new tag:");
                if (newTag) {
                    await replaceTagInItems(oldTag[0], newTag, items);
                } else {
                    alert("No new tag entered.");
                }
            }
        } else if (action === '4') {
            await removeAllTagsFromItems(items);
        } else if (action === '5') {
            const allTags = getAllTags(items);
            const searchTerm = prompt("Enter the tag search term (e.g., 'temp*' to match 'temp', 'temporary', etc.):");
            const matchingTags = searchTags(allTags, searchTerm);
            const selectedTags = selectTagsFromSearchResults(matchingTags);
            if (selectedTags) {
                await removeSelectedTagsFromItems(selectedTags, items, contextDescription);
            }
        } else if (action === '6') {
            const allTags = getAllTags(items);
            const searchTerm = prompt("Enter the tag search term to keep (e.g., 'temp*' to match 'temp', 'temporary', etc.):");
            const matchingTags = searchTags(allTags, searchTerm);
            const tagsToKeep = selectTagsFromSearchResults(matchingTags);
            if (tagsToKeep) {
                await removeAllExceptTagsFromItems(tagsToKeep, items, contextDescription);
            }
        } else {
            alert("Invalid action.");
        }
    } catch (error) {
        console.error(`Error in batch tag script: ${error.message}`);
        alert(`An error occurred: ${error.message}`);
    } finally {
        const endTime = performance.now();
        logTime("Total time", endTime - startTime);
    }
})();
