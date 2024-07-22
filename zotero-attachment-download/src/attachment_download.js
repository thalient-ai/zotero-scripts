(async function() {
    const zoteroPane = Zotero.getActiveZoteroPane();

    /**
     * Function to get items based on user selection.
     * @param {string} processScope - The scope of the items to process: '1' for selected items, '2' for the active collection, '3' for a saved search.
     * @returns {Array} - Array of items to process.
     */
    async function getItemsToProcess(processScope) {
        if (processScope === '2') {
            let collection = zoteroPane.getSelectedCollection();
            if (!collection) {
                alert("No collection selected.");
                return null;
            }
            return await collection.getChildItems();
        } else if (processScope === '3') {
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

    /**
     * Function to download attachments for the given items.
     * @param {Array} items - Array of items to process.
     */
    async function downloadAttachments(items) {
        let processedCount = 0;
        let skippedCount = 0;

        for (let item of items) {
            let attachments;
            if (item.isAttachment()) {
                attachments = [item];
            } else {
                attachments = await item.getAttachments();
            }

            for (let attachmentID of attachments) {
                let attachment = await Zotero.Items.getAsync(attachmentID);
                if (attachment.isAttachment() && !attachment.isTopLevelItem()) {
                    let fileExists = await attachment.fileExists();
                    if (!fileExists) {
                        console.log(`Starting download for attachment: ${attachment.getField('title')} (ID: ${attachment.id})`);
                        await Zotero.Sync.Runner.downloadFile(attachment);
                        console.log(`Completed download for attachment: ${attachment.getField('title')} (ID: ${attachment.id})`);
                        processedCount++;
                    } else {
                        console.log(`Attachment already local: ${attachment.getField('title')} (ID: ${attachment.id})`);
                        skippedCount++;
                    }
                }
            }
        }
        alert(`${processedCount} attachment(s) downloaded.\n${skippedCount} attachment(s) were already local.`);
    }

    try {
        const processScope = prompt("Enter '1' to process selected items, '2' for the active collection, or '3' for a saved search:");
        if (!['1', '2', '3'].includes(processScope)) {
            alert("Invalid selection. Please enter '1', '2', or '3'.");
            return;
        }

        let itemsToProcess = await getItemsToProcess(processScope);
        if (!itemsToProcess) {
            return;
        }

        await downloadAttachments(itemsToProcess);
    } catch (error) {
        console.error(`Error in the script: ${error.message}`);
    }
})();
