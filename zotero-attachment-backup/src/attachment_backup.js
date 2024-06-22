(async function() {
    const startTime = performance.now();

    try {
        const zoteroPane = Zotero.getActiveZoteroPane();

        // Prompt user for items scope
        const editOption = await getValidEditOption();
        if (!editOption) return;

        // Retrieve items based on user selection
        const items = await getItemsToEdit(editOption, zoteroPane);
        if (!items || !items.length) {
            alert("No items found.");
            return;
        }

        // Separate parent items and attachments without parent items
        const parentItems = items.filter(item => !item.isAttachment());
        const orphanAttachments = items.filter(item => item.isAttachment());

        // Prompt user for backup folder
        const folderPath = await getFolderPath();
        if (!folderPath) {
            alert("No folder selected.");
            return;
        }

        // Confirm the backup operation
        const totalAttachments = await countAttachments(parentItems, orphanAttachments);
        const confirmation = confirm(`You are about to backup ${totalAttachments} attachments to the following directory:\n\n${folderPath}\n\nDo you want to proceed?`);
        if (!confirmation) {
            alert("Backup process cancelled.");
            return;
        }

        // Backup attachments
        await backupAttachments(parentItems, orphanAttachments, folderPath);
        alert("Backup process completed.");

    } catch (error) {
        console.error(`Error: ${error.message}`);
        alert(`An error occurred: ${error.message}`);
    } finally {
        const endTime = performance.now();
        logTime("Total time", endTime - startTime);
    }

    function logTime(label, time) {
        try {
            console.log(`${label}: ${(time / 1000).toFixed(2)} seconds`);
        } catch (error) {
            console.error(`Failed to log time for ${label}: ${error.message}`);
        }
    }

    async function getValidEditOption() {
        while (true) {
            const editOption = prompt("Enter '1' to process selected items, '2' for items in the current collection, or '3' for items in a saved search:");
            if (['1', '2', '3'].includes(editOption)) {
                return editOption;
            } else {
                alert(`Invalid option: "${editOption}". Please enter '1', '2', or '3'.`);
            }
        }
    }

    async function getItemsToEdit(editOption, zoteroPane) {
        if (editOption === '2') {
            let collection = zoteroPane.getSelectedCollection();
            if (!collection) {
                alert("No collection selected.");
                return null;
            }
            return await collection.getChildItems();
        } else if (editOption === '3') {
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

    async function getFolderPath() {
        return new Promise((resolve, reject) => {
            const nsIFilePicker = Components.interfaces.nsIFilePicker;
            const fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
            fp.init(window, "Select Backup Folder", nsIFilePicker.modeGetFolder);
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

    async function countAttachments(parentItems, orphanAttachments) {
        let count = orphanAttachments.length;
        for (let item of parentItems) {
            const attachments = await item.getAttachments();
            count += attachments.length;
        }
        return count;
    }

    async function backupAttachments(parentItems, orphanAttachments, folderPath) {
        for (let item of parentItems) {
            const attachments = await item.getAttachments();
            await processAttachments(attachments, folderPath);
        }
        await processAttachments(orphanAttachments.map(attachment => attachment.id), folderPath);
    }

    async function processAttachments(attachmentIDs, folderPath) {
        for (let attachmentID of attachmentIDs) {
            const attachment = await Zotero.Items.getAsync(attachmentID);
            if (attachment.isAttachment() && attachment.attachmentLinkMode !== Zotero.Attachments.LINK_MODE_LINKED_URL) {
                const filePath = await attachment.getFilePathAsync();
                if (filePath) {
                    const fileName = filePath.replace(/^.*[\\\/]/, ''); // Extract file name from path
                    const newFilePath = normalizePath(`${folderPath}\\${fileName}`); // Use Windows path separator
                    await handleFileCopy(filePath, newFilePath);
                } else {
                    console.warn(`Attachment ${attachment.id} is not available locally.`);
                }
            }
        }
    }

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
            console.error(`Failed to copy ${source} to ${destination}: ${e.message}`);
        }
    }

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

    function normalizePath(path) {
        return path.replace(/\\/g, '\\\\'); // Ensure all backslashes are escaped
    }
})();
