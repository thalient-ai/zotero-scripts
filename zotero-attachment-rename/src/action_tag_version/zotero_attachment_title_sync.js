const Zotero = require("Zotero");

/**
 * Rename the title of an attachment to match its complete filename including the extension.
 * @param {Object} attachment - The attachment to process.
 * @returns {Object} An object indicating the number of successful renames and errors.
 */
async function renameAttachmentTitle(attachment) {
    if (!attachment) {
        Zotero.logError("Attempted to process an undefined attachment.");
        return { renamed: 0, errors: 1 };
    }

    if (attachment.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_URL) {
        Zotero.logError(`Cannot process linked URL attachment ${attachment.id}.`);
        return { renamed: 0, errors: 1 };
    }

    const currentPath = await attachment.getFilePathAsync();
    if (!currentPath) {
        Zotero.logError(`No local file path available for attachment ${attachment.id}.`);
        return { renamed: 0, errors: 1 };
    }

    const filename = currentPath.split(/(\\|\/)/g).pop(); // Keeps the file extension

    if (attachment.getField('title') !== filename) {
        try {
            attachment.setField('title', filename);
            await attachment.saveTx();
            return { renamed: 1, errors: 0 };
        } catch (error) {
            Zotero.logError(`Error updating title for attachment ${attachment.id}: ${error}`);
            return { renamed: 0, errors: 1 };
        }
    }

    return { renamed: 0, errors: 0 };
}

/**
 * Main execution function that processes either single or multiple items.
 * It handles both attachments directly or fetches and processes attachments of selected parent items.
 */
(async () => {
    if (!items && !item) {
        Zotero.alert(null, "Rename Attachments", "[Rename Attachments] No item or items array provided.");
        return;
    }

    let targetItems = items ? items : (item ? [item] : []);
    let totalRenamed = 0;
    let totalErrors = 0;

    for (const currentItem of targetItems) {
        let attachments = currentItem.itemType === 'attachment' ? [currentItem] : await Zotero.Items.getAsync(currentItem.getAttachments());
        for (const attachment of attachments) {
            const result = await renameAttachmentTitle(attachment);
            totalRenamed += result.renamed;
            totalErrors += result.errors;
        }
    }

    if (totalRenamed > 0 || totalErrors > 0) {
        Zotero.alert(null, "Rename Attachments", `[Rename Attachments] Successfully renamed ${totalRenamed} attachment titles. Errors: ${totalErrors}`);
    }
})();
