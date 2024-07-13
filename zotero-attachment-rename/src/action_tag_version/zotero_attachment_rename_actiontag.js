const Zotero = require("Zotero");

/**
 * Process the renaming of an individual attachment.
 * @param {Object} attachment - The attachment to process.
 * @returns {Object} An object indicating the number of successful renames and errors.
 */
async function processRenaming(attachment) {
    // Ensure the attachment is defined before processing.
    if (!attachment) {
        Zotero.logError("Attempted to process an undefined attachment.");
        return { renamed: 0, errors: 1 };
    }

    // Do not process attachments that are linked URLs because they cannot be renamed.
    if (attachment.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_URL) {
        Zotero.logError(`Cannot rename linked URL attachment ${attachment.id}.`);
        return { renamed: 0, errors: 1 };
    }

    // Check for a valid parent ID, essential for renaming based on parent item metadata.
    if (!attachment.parentItemID) {
        Zotero.logError(`Attachment ${attachment.id} does not have a parent item.`);
        return { renamed: 0, errors: 1 };
    }

    // Attempt to retrieve the parent item to use its metadata for renaming.
    const parentItem = await Zotero.Items.getAsync(attachment.parentItemID);
    if (!parentItem) {
        Zotero.logError(`No parent item found for attachment ${attachment.id}.`);
        return { renamed: 0, errors: 1 };
    }

    // Retrieve and validate the file path of the attachment.
    const currentPath = await attachment.getFilePathAsync();
    if (!currentPath) {
        Zotero.logError(`No local file path available for attachment ${attachment.id}.`);
        return { renamed: 0, errors: 1 };
    }

    // Construct the new file name using the parent item's title and existing extension.
    const newName = Zotero.Attachments.getFileBaseNameFromItem(parentItem);
    const currentName = currentPath.split(/(\\|\/)/g).pop();
    const extension = currentName.includes('.') ? currentName.split('.').pop() : '';
    const finalName = extension ? `${newName}.${extension}` : newName;

    // Rename the attachment file if the new name differs from the current name.
    if (newName !== currentName) {
        try {
            await attachment.renameAttachmentFile(finalName);
            attachment.setField('title', finalName);
            await attachment.saveTx();
            return { renamed: 1, errors: 0 };
        } catch (error) {
            Zotero.logError(`Error renaming attachment ${attachment.id}: ${error}`);
            return { renamed: 0, errors: 1 };
        }
    }

    return { renamed: 0, errors: 0 };
}

/**
 * Main execution function that processes either single or multiple items.
 */
(async () => {
    // Guard against missing input.
    if (!items && !item) {
        Zotero.alert(null, "Rename Attachments", "[Rename Attachments] No item or items array provided.");
        return;
    }

    // Determine the target items based on whether a single item or multiple items are selected.
    let targetItems = items ? items : (item ? [item] : []);
    let totalRenamed = 0;
    let totalErrors = 0;

    // Process each item, handling attachments directly or fetching attachments from items.
    for (const currentItem of targetItems) {
        let attachments = currentItem.itemType === 'attachment' ? [currentItem] : await Zotero.Items.getAsync(currentItem.getAttachments());
        for (const attachment of attachments) {
            const result = await processRenaming(attachment);
            totalRenamed += result.renamed;
            totalErrors += result.errors;
        }
    }

    // Display a summary alert only if there are changes or errors to report.
    if (totalRenamed > 0 || totalErrors > 0) {
        Zotero.alert(null, "Rename Attachments", `[Rename Attachments] Successfully renamed ${totalRenamed} attachments. Errors: ${totalErrors}`);
    }
})();
