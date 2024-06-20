(async function() {
  const zoteroPane = Zotero.getActiveZoteroPane();

  // Function to get a valid input for the scope of items to rename
  async function getValidEditOption() {
    while (true) {
      const editOption = prompt("Enter '1' to rename only selected items, '2' to rename all items in the current collection, or '3' to rename all items in a saved search:");
      if (['1', '2', '3'].includes(editOption)) {
        return editOption;
      } else {
        alert(`Invalid option: "${editOption}". Please enter '1', '2', or '3'.`);
      }
    }
  }

  // Function to get a valid input for rename option
  async function getValidRenameOption() {
    while (true) {
      const renameOption = prompt("Enter '1' to rename attachment filenames, '2' to rename attachment titles, '3' to rename both filenames and titles:");
      if (['1', '2', '3'].includes(renameOption)) {
        return renameOption;
      } else {
        alert(`Invalid option: "${renameOption}". Please enter '1', '2', or '3'.`);
      }
    }
  }

  const editOption = await getValidEditOption();

  let itemsToRename;

  try {
    itemsToRename = await getItemsToEdit(editOption, zoteroPane);
    if (!itemsToRename || !itemsToRename.length) {
      Zotero.alert(null, "No items found", "No items found to rename based on your selection.");
      return;
    }
  } catch (error) {
    Zotero.alert(null, "Error retrieving items", `An error occurred while retrieving items: ${error.message}`);
    return;
  }

  const renameOption = await getValidRenameOption();

  // Filter out only the parent items (not attachments)
  const parentItems = itemsToRename.filter(item => !item.isAttachment());
  if (!parentItems.length) {
    Zotero.alert(null, "No parent items found", "No parent items found to rename based on your selection.");
    return;
  }

  const originalNames = new Map();
  const failedItems = [];
  const batchRenamePromises = [];

  for (const item of parentItems) {
    const childItems = await item.getAttachments();
    const selectedAttachments = childItems.length > 1 ? await promptUserForAttachments(item, childItems) : childItems;

    for (const childItemID of selectedAttachments) {
      const childItem = await Zotero.Items.getAsync(childItemID);
      if (childItem.isAttachment() && !childItem.isTopLevelItem() && childItem.attachmentLinkMode !== Zotero.Attachments.LINK_MODE_LINKED_URL) {
        originalNames.set(childItem.id, await childItem.getFilePathAsync());
        batchRenamePromises.push(renameAttachment(childItem, originalNames, failedItems, renameOption));
      }
    }
  }

  try {
    await Promise.all(batchRenamePromises);
    Zotero.alert(null, "Renaming complete", "Renaming of selected files from parent metadata is complete.");
  } catch (error) {
    const rollbackConfirmed = confirm("An error occurred during renaming. Do you want to rollback changes? Click 'OK' for full rollback or 'Cancel' for partial rollback.");
    if (rollbackConfirmed) {
      await rollbackRenaming(originalNames);
    } else {
      await partialRollbackRenaming(failedItems, originalNames);
    }
  }
})();

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

    console.log(`Saved search found: ${savedSearch.name} (ID: ${savedSearch.id})`);
    
    let search = new Zotero.Search();
    search.libraryID = savedSearch.libraryID;
    search.addCondition('savedSearchID', 'is', savedSearch.id);

    let itemIDs = await search.search();
    console.log(`Number of items found in saved search: ${itemIDs.length}`);
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

async function promptUserForAttachments(item, childItems) {
  while (true) {
    const childItemOptions = childItems.map((childItemID, index) => {
      const childItem = Zotero.Items.get(childItemID);
      const file = childItem.getFilePath();
      return `${index + 1}. ${file.replace(/^.*[\\\/]/, '')}`; // Display file name
    }).join('\n');
    
    const selectedIndexes = prompt(`Item "${item.getField('title')}" has multiple attachments. Enter the numbers of the attachments you wish to rename, separated by commas, or type "all" to rename all attachments:\n${childItemOptions}`);
    
    if (!selectedIndexes) return [];

    if (selectedIndexes.toLowerCase() === 'all') {
      return childItems;
    }

    const indexes = selectedIndexes.split(',').map(Number).filter(index => !isNaN(index) && index > 0 && index <= childItems.length);
    if (indexes.length > 0) {
      return indexes.map(index => childItems[index - 1]);
    } else {
      alert(`Invalid input: "${selectedIndexes}". Please enter valid attachment numbers separated by commas, or type "all".`);
    }
  }
}

async function renameAttachment(item, originalNames, failedItems, renameOption) {
  try {
    const file = await item.getFilePathAsync();
    if (!file) {
      Zotero.debug(`No file path found for item ${item.id}`);
      return;
    }

    const parentItem = await Zotero.Items.getAsync(item.parentItemID);
    let newName = Zotero.Attachments.getFileBaseNameFromItem(parentItem);
    Zotero.debug(`New file base name for item ${item.id} is ${newName}`);

    const extRE = /\.[^\.]+$/;
    const origFilename = file.replace(/^.*[\\\/]/, ''); // Extracts the file name from the full path
    const ext = origFilename.match(extRE);
    if (ext) {
      newName += ext[0];
    }

    // Handle duplicates by appending a counter
    let finalNewName = newName;
    let counter = 1;
    while (await fileExists(item, finalNewName)) {
      finalNewName = `${newName} (${counter++})${ext[0]}`;
    }

    if (renameOption !== '2') { // Rename filename if the option is not '2'
      const renamed = await item.renameAttachmentFile(finalNewName, false, true);
      if (renamed !== true) {
        Zotero.debug(`Could not rename file (${renamed}) for item ${item.id}`);
        throw new Error(`Could not rename file (${renamed}) for item ${item.id}`);
      }
    }

    if (renameOption !== '1') { // Rename title if the option is not '1'
      const origTitle = item.getField('title');
      if (origTitle === origFilename || origTitle === origFilename.replace(extRE, '')) {
        item.setField('title', finalNewName);
      } else if (renameOption === '3') { // Always update the title if both are selected
        item.setField('title', finalNewName);
      }
    }

    await item.saveTx();
    Zotero.debug(`Successfully renamed item ${item.id} to ${finalNewName}`);
  } catch (error) {
    Zotero.debug(`Error renaming file for item ${item.id}: ${error.message}`);
    failedItems.push(item.id);
    throw error; // Ensure the error is propagated to trigger rollback
  }
}

async function fileExists(item, filename) {
  const parentDir = item.libraryID ? Zotero.DataDirectory.path + "/storage/" + item.libraryID : Zotero.DataDirectory.path + "/storage";
  const path = `${parentDir}/${filename}`;
  try {
    return Zotero.File.exists(path);
  } catch {
    return false;
  }
}

async function rollbackRenaming(originalNames) {
  const rollbackPromises = [];
  for (const [itemId, originalPath] of originalNames) {
    const item = await Zotero.Items.getAsync(itemId);
    const origFilename = originalPath.replace(/^.*[\\\/]/, '');
    rollbackPromises.push(renameAttachmentToOriginal(item, origFilename));
  }
  try {
    await Promise.all(rollbackPromises);
    Zotero.alert(null, "Rollback complete", "Renaming rollback is complete.");
  } catch (error) {
    Zotero.alert(null, "Rollback error", "Some files could not be rolled back. Please check the debug logs for details.");
  }
}

async function partialRollbackRenaming(failedItems, originalNames) {
  const rollbackPromises = [];
  for (const itemId of failedItems) {
    const originalPath = originalNames.get(itemId);
    if (originalPath) {
      const item = await Zotero.Items.getAsync(itemId);
      const origFilename = originalPath.replace(/^.*[\\\/]/, '');
      rollbackPromises.push(renameAttachmentToOriginal(item, origFilename));
    }
  }
  try {
    await Promise.all(rollbackPromises);
    Zotero.alert(null, "Partial rollback complete", "Partial renaming rollback is complete.");
  } catch (error) {
    Zotero.alert(null, "Partial rollback error", "Some files could not be rolled back. Please check the debug logs for details.");
  }
}

async function renameAttachmentToOriginal(item, origFilename) {
  try {
    const renamed = await item.renameAttachmentFile(origFilename, false, true);
    if (renamed !== true) {
      Zotero.debug(`Could not rename file (${renamed}) for item ${item.id}`);
      return;
    }

    const origTitle = item.getField('title');
    if (origTitle !== origFilename) {
      item.setField('title', origFilename);
    }

    await item.saveTx();
    Zotero.debug(`Successfully rolled back item ${item.id} to ${origFilename}`);
  } catch (error) {
    Zotero.debug(`Error rolling back file for item ${item.id}: ${error.message}`);
    Zotero.alert(null, "Error rolling back file", `An error occurred while rolling back the file for item ${item.id}: ${error.message}`);
  }
}
