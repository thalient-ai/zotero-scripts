(async function() {
    const startTime = performance.now();

    // Function to update the "Date Added" field of parent items
    async function updateParentDateAdded(items) {
        for (const parentItem of items) {
            try {
                if (!parentItem.isRegularItem()) {
                    console.log(`Skipping non-regular item with ID ${parentItem.id}`);
                    continue;
                }

                const childItems = await Zotero.Items.getAsync(parentItem.getAttachments());
                if (childItems.length === 0) {
                    console.log(`No attachments found for item with ID ${parentItem.id}`);
                    continue;
                }

                // Convert parent date to UTC
                let parentDateAdded = new Date(parentItem.getField('dateAdded') + 'Z');
                if (isNaN(parentDateAdded)) {
                    console.warn(`Invalid date for parent item with ID ${parentItem.id}`);
                    continue;
                }

                console.log(`Parent item ID ${parentItem.id}, current "Date Added" (UTC): ${parentDateAdded.toISOString()}`);
                console.log(`Parent item ID ${parentItem.id}, current "Date Added" (Local): ${parentDateAdded.toLocaleString()}`);

                let earliestDateAdded = parentDateAdded;

                for (const childItem of childItems) {
                    // Convert child date to UTC
                    const childDateAdded = new Date(childItem.getField('dateAdded') + 'Z');
                    if (isNaN(childDateAdded)) {
                        console.warn(`Invalid date for child item with ID ${childItem.id}`);
                        continue;
                    }
                    console.log(`Child item ID ${childItem.id}, "Date Added" (UTC): ${childDateAdded.toISOString()}`);
                    console.log(`Child item ID ${childItem.id}, "Date Added" (Local): ${childDateAdded.toLocaleString()}`);
                    if (childDateAdded < earliestDateAdded) {
                        earliestDateAdded = childDateAdded;
                    }
                }

                if (earliestDateAdded < parentDateAdded) {
                    console.log(`Updating "Date Added" for parent item ID ${parentItem.id} to ${earliestDateAdded.toISOString()}`);
                    parentItem.setField('dateAdded', earliestDateAdded.toISOString());
                    await parentItem.saveTx();
                } else {
                    console.log(`No update needed for parent item ID ${parentItem.id}`);
                }
            } catch (error) {
                console.error(`Error processing item with ID ${parentItem.id}: ${error.message}`);
            }
        }

        alert("Date Added fields updated successfully.");
    }

    // Function to get items based on user selection
    async function getItemsToEdit() {
        const zoteroPane = Zotero.getActiveZoteroPane();
        const editOption = prompt("Enter '1' to edit selected items, '2' to edit items in the current collection, or '3' to edit items in a saved search:");
        
        if (editOption === null) {
            alert("Operation canceled.");
            return null;
        }

        let items;
        if (editOption === '2') {
            let collection = zoteroPane.getSelectedCollection();
            if (!collection) {
                alert("No collection selected.");
                return null;
            }
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
            items = await Zotero.Items.getAsync(itemIDs);
        } else if (editOption === '1') {
            items = zoteroPane.getSelectedItems();
            if (!items.length) {
                alert("No items selected.");
                return null;
            }
        } else {
            alert("Invalid option selected.");
            return null;
        }

        return items;
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

        console.log(`Total items to process: ${items.length}`);
        await updateParentDateAdded(items);
    } catch (error) {
        console.error(`Error in updating "Date Added" script: ${error.message}`);
        alert(`An error occurred: ${error.message}`);
    } finally {
        const endTime = performance.now();
        logTime("Total time", endTime - startTime);
    }
})();
