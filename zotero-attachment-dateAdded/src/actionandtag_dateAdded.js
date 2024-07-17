const Zotero = require("Zotero");

(async function() {
    // Preventing multiple instances of the script running simultaneously
    if (Zotero.updateDateRunning) return;
    Zotero.updateDateRunning = true;

    try {
        const selectedItems = Zotero.getActiveZoteroPane().getSelectedItems();
        if (!selectedItems || !selectedItems.length) {
            Zotero.alert(null, "Update Date Added", "No items selected.");
            Zotero.updateDateRunning = false;
            return;
        }

        let totalUpdated = 0;

        for (const item of selectedItems) {
            // Skip if item is not a regular item
            if (!item.isRegularItem()) continue;

            // Process only parent items
            if (item.isTopLevelItem()) {
                const attachments = await Zotero.Items.getAsync(item.getAttachments());
                let parentDateAdded = new Date(item.getField('dateAdded') + 'Z');
                let earliestDateAdded = parentDateAdded;

                for (const attachment of attachments) {
                    const attachmentDateAdded = new Date(attachment.getField('dateAdded') + 'Z');
                    if (attachmentDateAdded < earliestDateAdded) {
                        earliestDateAdded = attachmentDateAdded;
                    }
                }

                if (earliestDateAdded < parentDateAdded) {
                    item.setField('dateAdded', earliestDateAdded.toISOString());
                    await item.saveTx();
                    totalUpdated++;
                }
            }
        }

        Zotero.alert(null, "Update Date Added", `${totalUpdated} item(s) date updated.`);
    } catch (error) {
        Zotero.logError(`Error updating "Date Added": ${error.message}`);
        Zotero.alert(null, "Error", `An error occurred: ${error.message}`);
    } finally {
        Zotero.updateDateRunning = false;
    }
})();
