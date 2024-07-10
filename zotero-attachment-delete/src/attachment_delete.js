(async function() {
    // Unified logging function to handle both console and alert logs consistently
    function logMessage(message, type = "info") {
        if (type === "error") {
            console.error(message);
        } else {
            console.log(message);
        }
    }

    // Function to get a valid input for the scope of items to delete
    async function getValidDeleteOption() {
        while (true) {
            const deleteOption = prompt("Enter '1' to delete attachments for selected items, '2' for all items in the current collection, '3' for all items in a saved search, or '4' for all items in the library:");

            // Sanitize the user input
            const sanitizedDeleteOption = deleteOption ? deleteOption.trim() : null;

            if (sanitizedDeleteOption === null) {
                logMessage("User cancelled the deletion process.");
                return null;
            }

            if (['1', '2', '3', '4'].includes(sanitizedDeleteOption)) {
                return sanitizedDeleteOption;
            } else {
                alert(`Invalid option: "${sanitizedDeleteOption}". Please enter '1', '2', '3', or '4'.`);
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
    async function deleteAttachments(item, deleteCount, skippedAttachments, linkedAttachments) {
        const deletionPromises = [];

        // If the item is an attachment, delete it
        if (item.isAttachment()) {
            if (item.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_FILE || 
                item.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_URL) {
                linkedAttachments.add(item.id);
                logMessage(`Skipping linked attachment (ID: ${item.id}, Title: ${item.getField('title')})`, "info");
                return deletionPromises;  // Skip linked files and web links
            }
            const filePath = item.getFilePath();
            if (filePath) {
                logMessage(`Deleting local file: ${filePath}`);
                const deleted = await deleteFile(filePath);
                if (deleted) deleteCount.fileCount++;
                deleteCount.attachmentCount++;
            } else {
                const parentItemID = item.getField('parentItemID');
                const parentItem = parentItemID ? await Zotero.Items.getAsync(parentItemID) : null;
                skippedAttachments.push({ 
                    id: item.id, 
                    title: item.getField('title'), 
                    parentTitle: parentItem ? parentItem.getField('title') : 'No Parent' 
                });
                logMessage(`No file path found for attachment (ID: ${item.id}, Title: ${item.getField('title')}, Parent Title: ${parentItem ? parentItem.getField('title') : 'No Parent'})`, "error");
            }
        } else {
            // If the item is not an attachment, check its child attachments
            const attachments = await item.getAttachments();
            for (const attachment of attachments) {
                const attachmentItem = await Zotero.Items.getAsync(attachment);
                deletionPromises.push(...await deleteAttachments(attachmentItem, deleteCount, skippedAttachments, linkedAttachments));
            }
            deleteCount.itemCount++;
        }

        return deletionPromises;
    }

    // Function to count attachments for a given item
    async function countAttachments(item, countObj, linkedAttachments, processedItems = new Set()) {
        // Skip if item already processed
        if (processedItems.has(item.id)) return;
        processedItems.add(item.id);

        // If the item is an attachment, count it if it exists
        if (item.isAttachment()) {
            if (item.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_FILE || 
                item.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_URL) {
                linkedAttachments.add(item.id);
                logMessage(`Skipping linked attachment (ID: ${item.id}, Title: ${item.getField('title')})`, "info");
                return;
            }
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
                await countAttachments(attachmentItem, countObj, linkedAttachments, processedItems);
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
        const linkedAttachments = new Set();
        const processedItems = new Set();
        for (const item of itemsToDelete) {
            await countAttachments(item, countObj, linkedAttachments, processedItems);
        }

        // Confirm the deletion with the user
        let selectionScope = "items";
        if (deleteOption === '2') selectionScope = "the collection";
        if (deleteOption === '3') selectionScope = "the saved search";
        if (deleteOption === '4') selectionScope = "the entire library";

        const confirmationMessage = `You have chosen to delete attachment files for ${selectionScope}. This scope includes:\n\n` +
                                    `Number of items: ${countObj.itemCount}\n` +
                                    `Number of attachments: ${countObj.attachmentCount}\n` +
                                    `Number of attachment files that will be deleted: ${countObj.fileCount}\n` +
                                    `Number of linked attachments that will be skipped: ${linkedAttachments.size}\n\n` +
                                    "Do you want to proceed?";
        const confirmation = confirm(confirmationMessage);
        if (!confirmation) {
            logMessage("User cancelled the deletion process.");
            return;
        }
        logMessage(confirmationMessage);

        const deleteCount = { fileCount: 0, attachmentCount: 0 };
        const skippedAttachments = [];
        const deletionPromises = [];
        for (const item of itemsToDelete) {
            deletionPromises.push(...await deleteAttachments(item, deleteCount, skippedAttachments, linkedAttachments));
        }

        await Promise.all(deletionPromises);
        logMessage(`${deleteCount.fileCount} local attachment files have been deleted.`);

        // Summary prompt
        let summaryMessage = `Deletion Summary:\n\n` +
                             `Number of items processed: ${countObj.itemCount}\n` +
                             `Number of attachments processed: ${countObj.attachmentCount}\n` +
                             `Number of attachment files deleted: ${deleteCount.fileCount}\n` +
                             `Number of linked attachments skipped: ${linkedAttachments.size}\n`;

        if (skippedAttachments.length > 0) {
            summaryMessage += `\nThe following attachments were skipped because they had no file path:\n`;
            skippedAttachments.forEach(att => {
                summaryMessage += `ID: ${att.id}, Title: ${att.title}, Parent Title: ${att.parentTitle}\n`;
            });
        }

        Zotero.alert(null, "Deletion Summary", summaryMessage);
        logMessage(summaryMessage, "info");

    } catch (error) {
        logMessage(`Error in deleting local attachment files: ${error.message}`, "error");
    } finally {
        logMessage("Script ended");
    }
})();