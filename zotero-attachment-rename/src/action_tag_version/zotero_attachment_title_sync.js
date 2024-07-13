const Zotero = require("Zotero");

// Function to process renaming of each attachment
async function processRenaming(attachment, processedAttachmentIds) {
    if (!attachment || processedAttachmentIds.has(attachment.id)) {
        // Skip processing if attachment is undefined or already processed
        return { renamed: 0, errors: 0 };
    }

    if (attachment.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_URL) {
        Zotero.logError(`Cannot rename linked URL attachment ${attachment.id}.`);
        return { renamed: 0, errors: 1 };
    }

    const currentPath = await attachment.getFilePathAsync();
    if (!currentPath) {
        Zotero.logError(`No local file path available for attachment ${attachment.id}.`);
        return { renamed: 0, errors: 1 };
    }

    const currentName = currentPath.split(/(\\|\/)/g).pop();

    try {
        attachment.setField('title', currentName);
        await attachment.saveTx();
        processedAttachmentIds.add(attachment.id);
        return { renamed: 1, errors: 0 };
    } catch (error) {
        Zotero.logError(`Error updating title for attachment ${attachment.id}: ${error}`);
        return { renamed: 0, errors: 1 };
    }
}

// Main execution block
(async () => {
    if (!items && !item) {
        Zotero.alert(null, "Update Attachment Titles", "[Update Attachment Titles] No item or items array provided.");
        return;
    }

    let targetItems = items || (item ? [item] : []);
    let totalUpdated = 0;
    let totalErrors = 0;
    let processedAttachmentIds = new Set();

    for (const currentItem of targetItems) {
        const attachments = currentItem.itemType === 'attachment' ? [currentItem] : await Zotero.Items.getAsync(currentItem.getAttachments());
        for (const attachment of attachments) {
            const result = await processRenaming(attachment, processedAttachmentIds);
            totalUpdated += result.renamed;
            totalErrors += result.errors;
        }
    }

    // Display a summary alert only if there are significant outcomes to report
    if (totalUpdated > 0 || totalErrors > 0) {
        Zotero.alert(null, "Update Attachment Titles", `[Update Attachment Titles] Successfully updated titles for ${totalUpdated} attachments. Errors: ${totalErrors}`);
    }
})();
