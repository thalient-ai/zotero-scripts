(async function() {
    // Utility function to sleep for a specified time (in milliseconds)
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

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
            console.log(`Selected collection: ${collection.name}`);
            return await collection.getChildItems();
        } else if (editOption === '3') {
            let savedSearch = zoteroPane.getSelectedSavedSearch();
            if (!savedSearch) {
                alert("No saved search selected.");
                return null;
            }
            console.log(`Selected saved search: ${savedSearch.name}`);

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
            console.log(`Selected items: ${selectedItems.length}`);
            return selectedItems;
        }
    }

    // Function to add a tag to items
    async function addTagToItems(tag, items) {
        if (!tag) {
            alert("Invalid tag.");
            return;
        }

        let affectedItemsCount = 0;
        for (let item of items) {
            try {
                console.log(`Adding tag "${tag}" to item: ${item.getField('title')}`);
                item.addTag(tag);
                await item.saveTx();
                affectedItemsCount++;
                await sleep(100);  // Adding a delay to avoid overwhelming the system
            } catch (error) {
                console.error(`Error adding tag to item ${item.id}: ${error}`);
            }
        }
        console.log(`Successfully added the tag "${tag}" to ${affectedItemsCount} item(s).`);
        alert(`Successfully added the tag "${tag}" to ${affectedItemsCount} item(s).`);
    }

    // Function to remove a tag from items
    async function removeTagFromItems(tag, items) {
        if (!tag) {
            alert("Invalid tag.");
            return;
        }

        let affectedItemsCount = 0;
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

        for (let item of itemsToRemoveTag) {
            try {
                console.log(`Removing tag "${tag}" from item: ${item.getField('title')}`);
                item.removeTag(tag);
                await item.saveTx();
                affectedItemsCount++;
                await sleep(100);  // Adding a delay to avoid overwhelming the system
            } catch (error) {
                console.error(`Error removing tag from item ${item.id}: ${error}`);
            }
        }
        console.log(`Tag "${tag}" removed from ${affectedItemsCount} item(s).`);
        alert(`Tag "${tag}" removed from ${affectedItemsCount} item(s).`);
    }

    // Function to replace a tag in items
    async function replaceTagInItems(oldTag, newTag, items) {
        if (!oldTag || !newTag) {
            alert("Invalid tags.");
            return;
        }

        let affectedItemsCount = 0;
        for (let item of items) {
            try {
                const tags = item.getTags().map(tag => tag.tag);
                if (tags.includes(oldTag)) {
                    console.log(`Replacing tag "${oldTag}" with "${newTag}" in item: ${item.getField('title')}`);
                    item.removeTag(oldTag);
                    item.addTag(newTag);
                    await item.saveTx();
                    affectedItemsCount++;
                    await sleep(100);  // Adding a delay to avoid overwhelming the system
                }
            } catch (error) {
                console.error(`Error replacing tag in item ${item.id}: ${error}`);
            }
        }
        console.log(`Tag "${oldTag}" replaced with "${newTag}" in ${affectedItemsCount} item(s).`);
        alert(`Tag "${oldTag}" replaced with "${newTag}" in ${affectedItemsCount} item(s).`);
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

    // Main logic
    const items = await getItemsToEdit();
    if (!items) {
        return;
    }

    const action = prompt("Enter '1' to add a tag, '2' to remove a tag, or '3' to replace a tag:");
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
    } else {
        alert("Invalid action.");
    }
})();
