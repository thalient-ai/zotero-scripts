const Zotero = require("Zotero");

if (!item) {
    return "[Update Titles] No item selected";
}

let attachments = [];

// Check if the selected item is an attachment
if (item.itemType === 'attachment') {
    attachments = [item];
} else {
    // Get all attachments of the parent item if it's not an attachment
    attachments = await Zotero.Items.getAsync(item.getAttachments());
}

if (!attachments.length) {
    return "[Update Titles] No attachments to update";
}

let updatedCount = 0;
for (const attachment of attachments) {
    if (attachment.itemType === 'attachment') {
        const currentPath = await attachment.getFilePathAsync();
        
        // Check if currentPath is valid
        if (!currentPath) {
            Zotero.logError(`[Update Titles] No local file path available for attachment ${attachment.id}. This attachment might be a linked URL or stored in cloud.`);
            continue; // Skip to the next attachment
        }

        const currentName = currentPath.split(/(\\|\/)/g).pop();
        const baseName = currentName.replace(/\.[^\.]+$/, ''); // Remove extension

        if (attachment.getField('title') !== baseName) {
            try {
                attachment.setField('title', baseName);
                await attachment.saveTx();
                updatedCount++;
            } catch (error) {
                Zotero.logError(`Error updating title for attachment ${attachment.id}: ${error}`);
                continue; // Proceed with next attachment even if one fails
            }
        }
    }
}

if (updatedCount > 0) {
    return `[Update Titles] Successfully updated ${updatedCount} attachment titles based on their file names.`;
} else {
    return "[Update Titles] No attachment titles were updated, possibly due to matching names or attachments without a local file.";
}
