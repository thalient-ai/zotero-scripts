const Zotero = require("Zotero");

if (!item) {
    return "[Rename Attachments] No item selected";
}

let parentItem;
let attachments = [];

// Check if the selected item is an attachment and get its parent
if (item.itemType === 'attachment') {
    if (item.attachmentLinkMode === Zotero.Attachments.LINK_MODE_LINKED_URL) {
        return "[Rename Attachments] Cannot rename linked URL attachments.";
    }
    parentItem = await Zotero.Items.getAsync(item.parentItemID);
    if (!parentItem) {
        return "[Rename Attachments] No parent item found for this attachment";
    }
    attachments = [item];
} else if (item.itemType !== 'attachment') {
    parentItem = item;
    attachments = await Zotero.Items.getAsync(item.getAttachments());
}

if (!attachments.length) {
    return "[Rename Attachments] No attachments to rename";
}

let renamedCount = 0;
for (const attachment of attachments) {
    if (attachment.itemType === 'attachment' && attachment.attachmentLinkMode !== Zotero.Attachments.LINK_MODE_LINKED_URL) {
        const currentPath = await attachment.getFilePathAsync();
        
        // Check if the current path is valid before proceeding
        if (!currentPath) {
            Zotero.logError(`[Rename Attachments] No local file path available for attachment ${attachment.id}. This attachment might be a linked URL or stored in cloud.`);
            continue; // Skip to the next attachment
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
                renamedCount++;
            } catch (error) {
                Zotero.logError(`Error renaming attachment ${attachment.id}: ${error}`);
                continue; // Proceed with next attachment even if one fails
            }
        }
    }
}

if (renamedCount > 0) {
    return `[Rename Attachments] Successfully renamed ${renamedCount} attachments and updated their titles based on their parent's metadata.`;
} else {
    return "[Rename Attachments] No attachments were renamed, possibly due to matching names or attachments without a local file.";
}
