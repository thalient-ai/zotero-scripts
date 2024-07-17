const Zotero = require("Zotero");
const window = require("window");

(async function () {
    if (window.backupAttachmentsRunning) return;
    window.backupAttachmentsRunning = true;

    try {
        const zoteroPane = Zotero.getActiveZoteroPane();

        // Get selected items or items from the selected collection
        let selectedItems = zoteroPane.getSelectedItems();
        if (!selectedItems.length) {
            let selectedCollection = zoteroPane.getSelectedCollection();
            if (selectedCollection) {
                logMessage(`Items from collection: ${selectedCollection.name}`);
                selectedItems = await selectedCollection.getChildItems();
            } else {
                window.alert("No items or collection selected.");
                logMessage("No items or collection selected.");
                window.backupAttachmentsRunning = false;
                return;
            }
        }

        if (!selectedItems.length) {
            window.alert("No items found to backup.");
            logMessage("No items found to backup.");
            window.backupAttachmentsRunning = false;
            return;
        }

        // Separate parent items and attachments without parent items
        const parentItems = selectedItems.filter(item => !item.isAttachment());
        const orphanAttachments = selectedItems.filter(item => item.isAttachment());

        // Prompt user for backup folder
        const folderPath = await getFolderPath();
        if (!folderPath) {
            Zotero.alert(null, "Backup Attachments", "No folder selected.");
            window.backupAttachmentsRunning = false;
            return;
        }

        // Confirm the backup operation
        const totalAttachments = await countAttachments(parentItems, orphanAttachments);
        const confirmation = window.confirm(`You are about to backup ${totalAttachments} attachments to the following directory:\n\n${folderPath}\n\nDo you want to proceed?`);
        if (!confirmation) {
            Zotero.alert(null, "Backup Attachments", "Backup process cancelled.");
            window.backupAttachmentsRunning = false;
            return;
        }

        // Backup attachments
        await backupAttachments(parentItems, orphanAttachments, folderPath);
        Zotero.alert(null, "Backup Attachments", "Backup process completed.");

    } catch (error) {
        Zotero.logError(`Error: ${error.message}`);
        Zotero.alert(null, "Backup Attachments", `An error occurred: ${error.message}`);
    } finally {
        window.backupAttachmentsRunning = false;
    }

    // Function to get the folder path for backup
    async function getFolderPath() {
        return new Promise((resolve, reject) => {
            const nsIFilePicker = Components.interfaces.nsIFilePicker;
            const fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
            fp.init(Zotero.getMainWindow(), "Select Backup Folder", nsIFilePicker.modeGetFolder);
            fp.appendFilters(nsIFilePicker.filterAll);

            fp.open((result) => {
                if (result == nsIFilePicker.returnOK || result == nsIFilePicker.returnReplace) {
                    const folderPath = fp.file.path;
                    if (!folderPath || folderPath.length > 260) {
                        reject(new Error("Invalid or too long folder path selected"));
                    } else {
                        resolve(folderPath);
                    }
                } else {
                    reject(new Error("No folder selected"));
                }
            });
        });
    }

    // Function to count attachments
    async function countAttachments(parentItems, orphanAttachments) {
        let count = new Set(orphanAttachments.map(item => item.id));
        for (let item of parentItems) {
            const attachments = await item.getAttachments();
            attachments.forEach(attachmentID => count.add(attachmentID));
        }
        return count.size;
    }

    // Function to backup attachments
    async function backupAttachments(parentItems, orphanAttachments, folderPath) {
        const processedAttachmentIds = new Set();
        for (let item of parentItems) {
            const attachments = await item.getAttachments();
            await processAttachments(attachments, folderPath, processedAttachmentIds);
        }
        await processAttachments(orphanAttachments.map(attachment => attachment.id), folderPath, processedAttachmentIds);
    }

    // Function to process attachments and copy files
    async function processAttachments(attachmentIDs, folderPath, processedAttachmentIds) {
        for (let attachmentID of attachmentIDs) {
            if (processedAttachmentIds.has(attachmentID)) {
                continue; // Skip already processed attachments
            }
            const attachment = await Zotero.Items.getAsync(attachmentID);
            if (attachment.isAttachment() && attachment.attachmentLinkMode !== Zotero.Attachments.LINK_MODE_LINKED_URL) {
                const filePath = await attachment.getFilePathAsync();
                if (filePath) {
                    const fileName = filePath.replace(/^.*[\\\/]/, ''); // Extract file name from path
                    const newFilePath = normalizePath(`${folderPath}\\${fileName}`); // Use Windows path separator
                    await handleFileCopy(filePath, newFilePath);
                    processedAttachmentIds.add(attachmentID); // Mark this attachment as processed
                } else {
                    Zotero.logError(`Attachment ${attachment.id} is not available locally.`);
                }
            }
        }
    }

    // Function to handle file copying
    async function handleFileCopy(source, destination) {
        try {
            const sourceFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);
            sourceFile.initWithPath(source);

            const destinationFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);
            destinationFile.initWithPath(destination);

            if (destinationFile.exists()) {
                const newDestination = await handleDuplicateFile(destinationFile);
                sourceFile.copyToFollowingLinks(newDestination.parent, newDestination.leafName);
            } else {
                sourceFile.copyToFollowingLinks(destinationFile.parent, destinationFile.leafName);
            }
        } catch (e) {
            Zotero.logError(`Failed to copy ${source} to ${destination}: ${e.message}`);
        }
    }

    // Function to handle duplicate files by appending a counter to the filename
    async function handleDuplicateFile(file) {
        let counter = 1;
        let newFileName = file.leafName.replace(/(\.[^\.]+)$/, ` (${counter})$1`);
        let newFile = file.parent.clone();
        newFile.append(newFileName);

        while (newFile.exists()) {
            counter++;
            newFileName = file.leafName.replace(/(\.[^\.]+)$/, ` (${counter})$1`);
            newFile = file.parent.clone();
            newFile.append(newFileName);
        }
        return newFile;
    }

    // Function to normalize the file path by escaping backslashes
    function normalizePath(path) {
        return path.replace(/\\/g, '\\\\'); // Ensure all backslashes are escaped
    }

    // Utility function to log messages
    function logMessage(message, type = "info") {
        if (type === "error") {
            Zotero.logError(message);
        } else {
            Zotero.debug(message);
        }
    }
})();
