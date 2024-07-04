(async function() {
    // Unified logging function to handle both console and alert logs consistently
    function logMessage(message, type = "info") {
        if (type === "error") {
            console.error(message);
            Zotero.alert(null, "Error", message);
        } else {
            console.log(message);
        }
    }

    // Function to get a valid input for the scope of items to delete
    async function getValidDeleteOption() {
        while (true) {
            const deleteOption = prompt("Enter '1' to delete attachments for selected items, '2' for all items in the current collection, '3' for all items in a saved search, or '4' for all items in the library:");
            if (deleteOption === null) {
                logMessage("User cancelled the deletion process.");
                return null;
            }
            if (['1', '2', '3', '4'].includes(deleteOption)) {
                return deleteOption;
            } else {
                alert(`Invalid option: "${deleteOption}". Please enter '1', '2', '3', or '4'.`);
            }
        }
    }

    // Function to get items to delete based on user selection
    async function getItemsToDelete(deleteOption, zoteroPane) {
        try {
            if (deleteOption === '2') {
                let collection = zoteroPane.getSelectedCollection();
                if (!collection) {
                    alert("No collection selected.");
                    return null;
                }
                logMessage(`Items from collection: ${collection.name}`);
                return await collection.getChildItems();
            } else if (deleteOption === '3') {
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

                logMessage(`Items from saved search: ${savedSearch.name}`);
                return await Zotero.Items.getAsync(itemIDs);
            } else if (deleteOption === '4') {
                const libraryID = Zotero.Libraries.userLibraryID;
                logMessage("Items from entire library");
                return await Zotero.Items.getAll(libraryID);
            } else {
                let selectedItems = zoteroPane.getSelectedItems();
                if (!selectedItems.length) {
                    alert("No items selected.");
                    return null;
                }
                logMessage("Selected items");
                return selectedItems;
            }
        } catch (error) {
            logMessage(`Error retrieving items: ${error.message}`, "error");
            return null;
        }
    }

    // Function to check file access permissions
    async function checkFileAccess(filePath) {
        try {
            const file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);
            file.initWithPath(filePath);
            if (file.exists() && file.isWritable()) {
                logMessage(`File access check passed for: ${filePath}`);
                return true;
            }
            logMessage(`File access check failed for: ${filePath}`);
            return false;
        } catch (error) {
            logMessage(`Error checking file access for ${filePath}: ${error.message}`, "error");
            return false;
        }
    }

    // Function to delete a single file
    async function deleteFile(filePath) {
        if (await checkFileAccess(filePath)) {
            try {
                const file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);
                file.initWithPath(filePath);
                if (file.exists()) {
                    file.remove(false);
                    logMessage(`Successfully deleted: ${filePath}`);
                    return true;
                } else {
                    logMessage(`File does not exist: ${filePath}`, "error");
                    return false;
                }
            } catch (error) {
                logMessage(`Failed to delete: ${filePath} - ${error.message}`, "error");
                return false;
            }
        }
        return false;
    }

    // Function to delete attachments for a given item
    async function deleteAttachments(item, deleteCount) {
        const deletionPromises = [];

        // If the item is an attachment, delete it
        if (item.isAttachment()) {
            const filePath = item.getFilePath();
            if (filePath) {
                logMessage(`Deleting local file: ${filePath}`);
                const deleted = await deleteFile(filePath);
                if (deleted) deleteCount.fileCount++;
                deleteCount.attachmentCount++;
            } else {
                logMessage("No file path found for attachment", "error");
            }
        } else {
            // If the item is not an attachment, check its child attachments
            const attachments = await item.getAttachments();
            for (const attachment of attachments) {
                const attachmentItem = await Zotero.Items.getAsync(attachment);
                deletionPromises.push(...await deleteAttachments(attachmentItem, deleteCount));
            }
            deleteCount.itemCount++;
        }

        return deletionPromises;
    }

    // Function to count attachments for a given item
    async function countAttachments(item, countObj) {
        // If the item is an attachment, count it if it exists
        if (item.isAttachment()) {
            const filePath = item.getFilePath();
            if (filePath) {
                const file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);
                file.initWithPath(filePath);
                if (file.exists()) {
                    countObj.fileCount++;
                }
                countObj.attachmentCount++;
            }
        } else {
            // If the item is not an attachment, check its child attachments
            const attachments = await item.getAttachments();
            for (const attachment of attachments) {
                const attachmentItem = await Zotero.Items.getAsync(attachment);
                await countAttachments(attachmentItem, countObj);
            }
            countObj.itemCount++;
        }
    }

    // Main function
    try {
        logMessage("Script started");
        const zoteroPane = Zotero.getActiveZoteroPane();

        const deleteOption = await getValidDeleteOption();
        if (deleteOption === null) {
            return;
        }

        const itemsToDelete = await getItemsToDelete(deleteOption, zoteroPane);
        if (!itemsToDelete || !itemsToDelete.length) {
            Zotero.alert(null, "No items found", "No items found to delete based on your selection.");
            logMessage("No items found to delete based on user selection.");
            return;
        }

        // Count the number of attachments and files
        const countObj = { itemCount: 0, attachmentCount: 0, fileCount: 0 };
        for (const item of itemsToDelete) {
            await countAttachments(item, countObj);
        }

        // Confirm the deletion with the user
        let selectionScope = "items";
        if (deleteOption === '2') selectionScope = "the collection";
        if (deleteOption === '3') selectionScope = "the saved search";
        if (deleteOption === '4') selectionScope = "the entire library";

        const confirmationMessage = `You have chosen to delete attachment files for ${selectionScope}. This includes:\n\n` +
                                    `Number of items: ${countObj.itemCount}\n` +
                                    `Number of attachments: ${countObj.attachmentCount}\n` +
                                    `Number of attachment files: ${countObj.fileCount}\n\n` +
                                    "Do you want to proceed?";
        const confirmation = confirm(confirmationMessage);
        if (!confirmation) {
            logMessage("User cancelled the deletion process.");
            return;
        }
        logMessage(confirmationMessage);

        const deleteCount = { fileCount: 0, attachmentCount: 0 };
        const deletionPromises = [];
        for (const item of itemsToDelete) {
            deletionPromises.push(...await deleteAttachments(item, deleteCount));
        }

        await Promise.all(deletionPromises);
        Zotero.alert(null, "Local Attachment Deletion Complete", `${deleteCount.fileCount} local attachment files have been deleted.`);
        logMessage(`${deleteCount.fileCount} local attachment files have been deleted.`);

    } catch (error) {
        logMessage(`Error in deleting local attachment files: ${error.message}`, "error");
    } finally {
        logMessage("Script ended");
    }
})();