const Zotero = require("Zotero");

// Function to process renaming of each attachment
async function processRenaming(attachment) {
    // Check if the attachment is a linked URL, which cannot be renamed
    if (attachment.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_URL) {
        Zotero.logError(`Cannot rename linked URL attachment ${attachment.id}.`);
        return { renamed: 0, errors: 1 };
    }

    // Retrieve the current path of the attachment
    const currentPath = await attachment.getFilePathAsync();
    // Check if the current path exists (i.e., the attachment is locally stored)
    if (!currentPath) {
        Zotero.logError(`No local file path available for attachment ${attachment.id}.`);
        return { renamed: 0, errors: 1 };
    }

    // Retrieve the parent item to get its metadata for the renaming process
    const parentItem = await Zotero.Items.getAsync(attachment.parentItemID);
    // Construct the new name using the parent item's title
    const newName = Zotero.Attachments.getFileBaseNameFromItem(parentItem);
    const currentName = currentPath.split(/(\\|\/)/g).pop();
    const extension = currentName.includes('.') ? currentName.split('.').pop() : '';
    const finalName = extension ? `${newName}.${extension}` : newName;

    // Rename the file if the new name is different from the current name
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

if (items && items.length > 0) {
    // Using a Set to track processed attachment IDs to prevent processing the same attachment multiple times
    let processedAttachmentIds = new Set();
    let totalRenamed = 0;
    let totalErrors = 0;

    (async () => {
        for (const currentItem of items) {
            // Handle both attachments directly and attachments of parent items
            let attachments = currentItem.itemType === 'attachment' ? [currentItem] : await Zotero.Items.getAsync(currentItem.getAttachments());
            for (const attachment of attachments) {
                if (!processedAttachmentIds.has(attachment.id)) {
                    const result = await processRenaming(attachment);
                    totalRenamed += result.renamed;
                    totalErrors += result.errors;
                    processedAttachmentIds.add(attachment.id);
                }
            }
        }

        Zotero.alert(null, "Rename Attachments", `[Rename Attachments] Successfully renamed ${totalRenamed} attachments. Errors: ${totalErrors}`);
    })();
}
