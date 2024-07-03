(async function() {
    const startTime = performance.now();

    // Function to get items to edit based on user selection
    async function getItemsToEdit() {
        const zoteroPane = Zotero.getActiveZoteroPane();
        const editOption = prompt("Enter '1' to edit selected items, '2' to edit items in the current collection, or '3' to edit items in a saved search:");

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

    // Function to log tags for items
    function logTags(items) {
        items.forEach(item => {
            const tags = item.getTags().map(tag => tag.tag);
            console.log(`Item ${item.id} has tags: ${tags.join(', ')}`);
        });
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

    // Function to search for tags
    function searchTags(allTags, searchTerm) {
        return allTags.filter(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Function to prompt user to select a tag from search results
    function selectTagFromSearchResults(tags) {
        if (tags.length === 0) {
            alert("No matching tags found.");
            return null;
        }

        let selectedTag = null;
        while (!selectedTag) {
            const choices = tags.map((tag, index) => `${index + 1}. ${tag}`).join("\n");
            const choice = prompt(`Select a tag by number or enter a new search term:\n\n${choices}`);

            if (choice === null) {
                alert("Operation canceled.");
                return null;
            }

            const selectedIndex = parseInt(choice, 10);

            if (!isNaN(selectedIndex) && selectedIndex > 0 && selectedIndex <= tags.length) {
                selectedTag = tags[selectedIndex - 1];
            } else {
                const newTags = searchTags(tags, choice);
                if (newTags.length > 0) {
                    tags = newTags;
                } else {
                    alert("Invalid selection. Please enter a valid number or search term.");
                }
            }
        }

        return selectedTag;
    }

    function logTime(label, time) {
        try {
            console.log(`${label}: ${(time / 1000).toFixed(2)} seconds`);
        } catch (error) {
            console.error(`Failed to log time for ${label}: ${error.message}`);
        }
    }

    try {
        const items = await getItemsToEdit();
        if (!items) {
            return;
        }

        console.log(`Total items to edit: ${items.length}`);
        logTags(items);

        const action = prompt("Enter '1' to add a tag, '2' to remove a tag, '3' to replace a tag, or '4' to remove all tags:");
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
            const tag = selectTagFromSearchResults(matchingTags);
            if (tag) {
                await removeTagFromItems(tag, items);
            }
        } else if (action === '3') {
            const allTags = getAllTags(items);
            const searchTerm = prompt("Enter the tag to search for:");
            const matchingTags = searchTags(allTags, searchTerm);
            const oldTag = selectTagFromSearchResults(matchingTags);
            if (oldTag) {
                const newTag = prompt("Enter the new tag:");
                if (newTag) {
                    await replaceTagInItems(oldTag, newTag, items);
                } else {
                    alert("No new tag entered.");
                }
            }
        } else if (action === '4') {
            await removeAllTagsFromItems(items);
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
