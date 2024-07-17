const Zotero = require('Zotero');
const window = require('window');

(async function() {
    if (window.deletingAttachmentsRunning) return;
    window.deletingAttachmentsRunning = true;

    // Unified logging function to handle both console and alert logs consistently
    function logMessage(message, type = "info") {
        if (type === "error") {
            Zotero.logError(message);
        } else {
            Zotero.debug(message);
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

    try {
        logMessage("Script started");
        const zoteroPane = Zotero.getActiveZoteroPane();
        let itemsToDelete = [];

        // Get selected items or items from the selected collection
        let selectedItems = zoteroPane.getSelectedItems();
        if (selectedItems.length) {
            logMessage("Selected items");
            itemsToDelete = selectedItems;
        } else {
            let selectedCollection = zoteroPane.getSelectedCollection();
            if (selectedCollection) {
                logMessage(`Items from collection: ${selectedCollection.name}`);
                itemsToDelete = await selectedCollection.getChildItems();
            } else {
                window.alert("No items or collection selected.");
                logMessage("No items or collection selected.");
                window.deletingAttachmentsRunning = false;
                return;
            }
        }

        if (!itemsToDelete.length) {
            window.alert("No items found to delete.");
            logMessage("No items found to delete.");
            window.deletingAttachmentsRunning = false;
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
        const confirmationMessage = `You have chosen to delete attachment files for the selected scope. This scope includes:\n\n` +
                                    `Number of items: ${countObj.itemCount}\n` +
                                    `Number of attachments: ${countObj.attachmentCount}\n` +
                                    `Number of attachment files that will be deleted: ${countObj.fileCount}\n` +
                                    `Number of linked attachments that will be skipped: ${linkedAttachments.size}\n\n` +
                                    "Do you want to proceed?";
        const confirmation = window.confirm(confirmationMessage);
        if (!confirmation) {
            logMessage("User cancelled the deletion process.");
            window.deletingAttachmentsRunning = false;
            return;
        }
        logMessage(confirmationMessage);

        const deleteCount = { fileCount: 0, attachmentCount: 0 };
        const skippedAttachments = [];
        const deletionPromises = [];
        for (const item of itemsToDelete) {
            deletionPromises.push(...await deleteAttachments(item, deleteCount, skippedAttachments, linkedAttachments));
        }

        await Promise.allSettled(deletionPromises);
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

        window.alert(summaryMessage);
        logMessage(summaryMessage, "info");

    } catch (error) {
        logMessage(`Error in deleting local attachment files: ${error.message}`, "error");
    } finally {
        logMessage("Script ended");
        window.deletingAttachmentsRunning = false;
    }
})();
