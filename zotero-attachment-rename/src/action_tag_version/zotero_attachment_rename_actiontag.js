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

    if (!attachment.parentItemID) {
        Zotero.logError(`Attachment ${attachment.id} does not have a parent item.`);
        return { renamed: 0, errors: 1 };
    }

    const parentItem = await Zotero.Items.getAsync(attachment.parentItemID);
    if (!parentItem) {
        Zotero.logError(`No parent item found for attachment ${attachment.id}.`);
        return { renamed: 0, errors: 1 };
    }

    const currentPath = await attachment.getFilePathAsync();
    if (!currentPath) {
        Zotero.logError(`No local file path available for attachment ${attachment.id}.`);
        return { renamed: 0, errors: 1 };
    }

    const newName = Zotero.Attachments.getFileBaseNameFromItem(parentItem);
    const currentName = currentPath.split(/(\\|\/)/g).pop();
    const extension = currentName.includes('.') ? currentName.split('.').pop() : '';
    const finalName = extension ? `${newName}.${extension}` : newName;

    if (newName !== currentName) {
        try {
            await attachment.renameAttachmentFile(finalName);
            attachment.setField('title', finalName);
            await attachment.saveTx();
            processedAttachmentIds.add(attachment.id);
            return { renamed: 1, errors: 0 };
        } catch (error) {
            Zotero.logError(`Error renaming attachment ${attachment.id}: ${error}`);
            return { renamed: 0, errors: 1 };
        }
    }

    return { renamed: 0, errors: 0 };
}

// Main execution block
(async () => {
    if (!items && !item) {
        Zotero.alert(null, "Rename Attachments", "[Rename Attachments] No item or items array provided.");
        return;
    }

    let targetItems = items || (item ? [item] : []);
    let totalRenamed = 0;
    let totalErrors = 0;
    let processedAttachmentIds = new Set();

    for (const currentItem of targetItems) {
        const attachments = currentItem.itemType === 'attachment' ? [currentItem] : await Zotero.Items.getAsync(currentItem.getAttachments());
        for (const attachment of attachments) {
            const result = await processRenaming(attachment, processedAttachmentIds);
            totalRenamed += result.renamed;
            totalErrors += result.errors;
        }
    }

    // Display a summary alert only if there are significant outcomes to report
    if (totalRenamed > 0 || totalErrors > 0) {
        Zotero.alert(null, "Rename Attachments", `[Rename Attachments] Successfully renamed ${totalRenamed} attachments. Errors: ${totalErrors}`);
    }
})();
