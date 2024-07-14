const Zotero = require('Zotero');
const window = require('window');

// Field definitions
const fields = [
    { "field": "abstractNote", "localized": "Abstract" },
    { "field": "accessDate", "localized": "Accessed Date" },
    { "field": "applicationNumber", "localized": "Application Number" },
    { "field": "archive", "localized": "Archive" },
    { "field": "archiveID", "localized": "Archive ID" },
    { "field": "archiveLocation", "localized": "Location in Archive" },
    { "field": "artworkMedium", "localized": "Artwork Medium" },
    { "field": "artworkSize", "localized": "Artwork Size" },
    { "field": "assignee", "localized": "Assignee" },
    { "field": "audioFileType", "localized": "Audio File Type" },
    { "field": "audioRecordingFormat", "localized": "Audio Format" },
    { "field": "billNumber", "localized": "Bill Number" },
    { "field": "blogTitle", "localized": "Blog Title" },
    { "field": "bookTitle", "localized": "Book Title" },
    { "field": "callNumber", "localized": "Call Number" },
    { "field": "caseName", "localized": "Case Name" },
    { "field": "citationKey", "localized": "Citation Key" },
    { "field": "code", "localized": "Code" },
    { "field": "codeNumber", "localized": "Code Number" },
    { "field": "codePages", "localized": "Code Pages" },
    { "field": "codeVolume", "localized": "Code Volume" },
    { "field": "committee", "localized": "Committee" },
    { "field": "company", "localized": "Company" },
    { "field": "conferenceName", "localized": "Conference Name" },
    { "field": "country", "localized": "Country" },
    { "field": "court", "localized": "Court" },
    { "field": "creatorFirstName", "localized": "First Name" },
    { "field": "creatorLastName", "localized": "Last Name" },
    { "field": "date", "localized": "Date" },
    { "field": "dateDecided", "localized": "Date Decided" },
    { "field": "dateEnacted", "localized": "Date Enacted" },
    { "field": "dictionaryTitle", "localized": "Dictionary Title" },
    { "field": "distributor", "localized": "Distributor" },
    { "field": "docketNumber", "localized": "Docket Number" },
    { "field": "documentNumber", "localized": "Document Number" },
    { "field": "DOI", "localized": "DOI" },
    { "field": "edition", "localized": "Edition" },
    { "field": "encyclopediaTitle", "localized": "Encyclopedia Title" },
    { "field": "episodeNumber", "localized": "Episode Number" },
    { "field": "extra", "localized": "Extra" },
    { "field": "filingDate", "localized": "Filing Date" },
    { "field": "firstPage", "localized": "First Page" },
    { "field": "format", "localized": "Format" },
    { "field": "forumTitle", "localized": "Forum Title" },
    { "field": "genre", "localized": "Genre" },
    { "field": "history", "localized": "History" },
    { "field": "identifier", "localized": "Identifier" },
    { "field": "institution", "localized": "Institution" },
    { "field": "interviewMedium", "localized": "Interview Medium" },
    { "field": "ISBN", "localized": "ISBN" },
    { "field": "ISSN", "localized": "ISSN" },
    { "field": "issue", "localized": "Issue" },
    { "field": "issueDate", "localized": "Issue Date" },
    { "field": "issuingAuthority", "localized": "Issuing Authority" },
    { "field": "journalAbbreviation", "localized": "Journal Abbreviation" },
    { "field": "label", "localized": "Label" },
    { "field": "language", "localized": "Language" },
    { "field": "legalStatus", "localized": "Legal Status" },
    { "field": "legislativeBody", "localized": "Legislative Body" },
    { "field": "libraryCatalog", "localized": "Library Catalog" },
    { "field": "mapType", "localized": "Map Type" },
    { "field": "manuscriptType", "localized": "Manuscript Type" },
    { "field": "meetingName", "localized": "Meeting Name" },
    { "field": "nameOfAct", "localized": "Name of Act" },
    { "field": "network", "localized": "Network" },
    { "field": "note", "localized": "Note" },
    { "field": "numPages", "localized": "Number of Pages" },
    { "field": "number", "localized": "Number" },
    { "field": "numberOfVolumes", "localized": "Number of Volumes" },
    { "field": "organization", "localized": "Organization" },
    { "field": "pages", "localized": "Pages" },
    { "field": "patentNumber", "localized": "Patent Number" },
    { "field": "place", "localized": "Place" },
    { "field": "postType", "localized": "Post Type" },
    { "field": "presentationType", "localized": "Presentation Type" },
    { "field": "priorityNumbers", "localized": "Priority Numbers" },
    { "field": "proceedingsTitle", "localized": "Proceedings Title" },
    { "field": "programmingLanguage", "localized": "Programming Language" },
    { "field": "programTitle", "localized": "Program Title" },
    { "field": "publicLawNumber", "localized": "Public Law Number" },
    { "field": "publicationTitle", "localized": "Publication Title" },
    { "field": "publisher", "localized": "Publisher" },
    { "field": "references", "localized": "References" },
    { "field": "reportNumber", "localized": "Report Number" },
    { "field": "reportType", "localized": "Report Type" },
    { "field": "reporter", "localized": "Reporter" },
    { "field": "reporterVolume", "localized": "Reporter Volume" },
    { "field": "repository", "localized": "Repository" },
    { "field": "repositoryLocation", "localized": "Repository Location" },
    { "field": "rights", "localized": "Rights" },
    { "field": "runningTime", "localized": "Running Time" },
    { "field": "scale", "localized": "Scale" },
    { "field": "section", "localized": "Section" },
    { "field": "series", "localized": "Series" },
    { "field": "seriesNumber", "localized": "Series Number" },
    { "field": "seriesText", "localized": "Series Text" },
    { "field": "seriesTitle", "localized": "Series Title" },
    { "field": "session", "localized": "Session" },
    { "field": "shortTitle", "localized": "Short Title" },
    { "field": "status", "localized": "Status" },
    { "field": "studio", "localized": "Studio" },
    { "field": "subject", "localized": "Subject" },
    { "field": "system", "localized": "System" },
    { "field": "thesisType", "localized": "Thesis Type" },
    { "field": "title", "localized": "Title" },
    { "field": "type", "localized": "Type" },
    { "field": "university", "localized": "University" },
    { "field": "url", "localized": "URL" },
    { "field": "versionNumber", "localized": "Version" },
    { "field": "videoRecordingFormat", "localized": "Video Recording Format" },
    { "field": "volume", "localized": "Volume" },
    { "field": "websiteTitle", "localized": "Website Title" },
    { "field": "websiteType", "localized": "Website Type" }
];

// Item type definitions
const itemTypes = [
    { "type": "artwork", "localized": "Artwork" },
    { "type": "audioRecording", "localized": "Audio Recording" },
    { "type": "bill", "localized": "Bill" },
    { "type": "blogPost", "localized": "Blog Post" },
    { "type": "book", "localized": "Book" },
    { "type": "bookSection", "localized": "Book Section" },
    { "type": "case", "localized": "Case" },
    { "type": "computerProgram", "localized": "Software" },
    { "type": "conferencePaper", "localized": "Conference Paper" },
    { "type": "dataset", "localized": "Dataset" },
    { "type": "dictionaryEntry", "localized": "Dictionary Entry" },
    { "type": "document", "localized": "Document" },
    { "type": "email", "localized": "Email" },
    { "type": "encyclopediaArticle", "localized": "Encyclopedia Article" },
    { "type": "film", "localized": "Film" },
    { "type": "forumPost", "localized": "Forum Post" },
    { "type": "hearing", "localized": "Hearing" },
    { "type": "instantMessage", "localized": "Instant Message" },
    { "type": "interview", "localized": "Interview" },
    { "type": "journalArticle", "localized": "Journal Article" },
    { "type": "letter", "localized": "Letter" },
    { "type": "magazineArticle", "localized": "Magazine Article" },
    { "type": "manuscript", "localized": "Manuscript" },
    { "type": "map", "localized": "Map" },
    { "type": "newspaperArticle", "localized": "Newspaper Article" },
    { "type": "patent", "localized": "Patent" },
    { "type": "podcast", "localized": "Podcast" },
    { "type": "preprint", "localized": "Preprint" },
    { "type": "presentation", "localized": "Presentation" },
    { "type": "radioBroadcast", "localized": "Radio Broadcast" },
    { "type": "report", "localized": "Report" },
    { "type": "standard", "localized": "Standard" },
    { "type": "statute", "localized": "Statute" },
    { "type": "thesis", "localized": "Thesis" },
    { "type": "tvBroadcast", "localized": "TV Broadcast" },
    { "type": "videoRecording", "localized": "Video Recording" },
    { "type": "webpage", "localized": "Web Page" }
];

// Sort fields and item types alphabetically by localized name
fields.sort((a, b) => a.localized.localeCompare(b.localized));
itemTypes.sort((a, b) => a.localized.localeCompare(b.localized));

// Function to escape special characters for regular expressions
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Function to prompt user to select a field or item type with autocomplete suggestions
async function autocompletePrompt(promptText, suggestions) {
    while (true) {
        let input = { value: "" };
        let result = window.prompt(promptText, input.value);
        if (result === null) return null;

        let matches = suggestions.filter(suggestion => suggestion.localized.toLowerCase().includes(result.toLowerCase()));
        if (matches.length === 0) {
            window.alert("No matches found. Please try again.");
            continue;
        }

        if (matches.length === 1) {
            return matches[0];
        }

        let suggestionText = matches.map((match, index) => `${index + 1}. ${match.localized}`).join("\n");
        let choice = window.prompt(`Multiple matches found:\n\n${suggestionText}\n\nType the number to select the field or item type:`);
        if (choice === null) return null;
        
        let selectedIndex = parseInt(choice, 10);
        if (!isNaN(selectedIndex) && selectedIndex > 0 && selectedIndex <= matches.length) {
            return matches[selectedIndex - 1];
        } else {
            window.alert(`Invalid selection. Please enter a number between 1 and ${matches.length}.`);
        }
    }
}

// Function to get items to edit based on user selection
async function getItemsToEdit(triggerType, item, items) {
    const zoteroPane = Zotero.getActiveZoteroPane();
    if (triggerType === 'menu') {
        if (items && items.length > 0) {
            return items;
        } else if (item) {
            return [item];
        } else {
            window.alert("No items selected.");
            return null;
        }
    } else {
        if (triggerType === 'savedSearch') {
            let savedSearch = zoteroPane.getSelectedSavedSearch();
            if (!savedSearch) {
                window.alert("No saved search selected.");
                return null;
            }
            let search = new Zotero.Search();
            search.addCondition('savedSearchID', 'is', savedSearch.id);
            let itemIDs = await search.search();
            return await Zotero.Items.getAsync(itemIDs);
        } else {
            let selectedItems = zoteroPane.getSelectedItems();
            if (!selectedItems.length) {
                window.alert("No items selected.");
                return null;
            }
            return selectedItems;
        }
    }
}

// Function to update item type
async function updateItemType(itemsToEdit, newTypeLocalized) {
    const newType = itemTypes.find(type => type.localized === newTypeLocalized).type;
    const typeID = Zotero.ItemTypes.getID(newType);
    if (!typeID) {
        window.alert(`Invalid item type: ${newTypeLocalized}`);
        return;
    }
    let processedCount = 0;
    let skippedCount = 0;
    await Zotero.DB.executeTransaction(async function() {
        for (let item of itemsToEdit) {
            if (!item.isAttachment() || item.getField('parentItemID')) {
                item.setType(typeID);
                await item.save();
                processedCount++;
            } else {
                skippedCount++;
            }
        }
    });
    window.alert(`Item types updated to "${newTypeLocalized}" for selected items.\n\n${processedCount} item(s) processed,\n${skippedCount} item(s) skipped.`);
}

// Function to update creators
async function updateCreators(fieldName, itemsToEdit, searchRegex, replace) {
    let deletionConfirmed = false;
    let toBeDeletedItems = [];
    let originalCreatorsMap = new Map();

    await Zotero.DB.executeTransaction(async function() {
        for (let item of itemsToEdit) {
            let creators = item.getCreators();
            originalCreatorsMap.set(item.id, JSON.parse(JSON.stringify(creators)));
            let updated = false;
            let newCreators = [];

            for (let creator of creators) {
                let nameToSearch = (creator.fieldMode === 1) ? creator.lastName : (fieldName === "creatorFirstName") ? creator.firstName : creator.lastName;

                if (searchRegex.test(nameToSearch)) {
                    if (creator.fieldMode === 1 || fieldName === "creatorLastName") {
                        creator.lastName = nameToSearch.replace(searchRegex, replace);
                    } else if (fieldName === "creatorFirstName") {
                        creator.firstName = nameToSearch.replace(searchRegex, replace);
                    }

                    if (creator.fieldMode === 0 && !creator.firstName && !creator.lastName) {
                        toBeDeletedItems.push(item);
                    } else {
                        newCreators.push(creator);
                    }
                    updated = true;
                } else {
                    newCreators.push(creator);
                }
            }

            newCreators = newCreators.filter(creator => (creator.fieldMode === 1) || (creator.firstName || creator.lastName));

            if (updated) {
                item.setCreators(newCreators);
                await item.save();
            }
        }
    });

    if (toBeDeletedItems.length && !deletionConfirmed) {
        deletionConfirmed = window.confirm("Some author names (first and last names) will be blank after this update. Do you want to delete these author entries? Note: This will not delete the entire item or attached files, only the blank author names.");
        if (deletionConfirmed) {
            await Zotero.DB.executeTransaction(async function() {
                for (let item of toBeDeletedItems) {
                    let creators = item.getCreators().filter(creator => creator.fieldMode === 1 || creator.firstName || creator.lastName);
                    item.setCreators(creators);
                    await item.save();
                }
            });
        } else {
            await Zotero.DB.executeTransaction(async function() {
                for (let item of toBeDeletedItems) {
                    let originalCreators = originalCreatorsMap.get(item.id);
                    item.setCreators(originalCreators);
                    await item.save();
                }
            });
        }
    }

    window.alert("The names were successfully updated.");
}

// Function to update notes
async function updateNotes(itemsToEdit, searchRegex, replace) {
    await Zotero.DB.executeTransaction(async function() {
        for (let item of itemsToEdit) {
            if (item.isNote()) {
                let noteContent = item.getNote();
                let newNoteContent = noteContent.replace(searchRegex, replace);
                if (newNoteContent !== noteContent) {
                    await item.setNote(newNoteContent);
                    await item.save();
                }
            }
        }
    });
    window.alert("Notes updated.");
}

// Function to update field values
async function updateFieldValues(fieldName, selectedField, itemsToEdit, searchRegex, replace) {
    let idsCorrect = [];
    let invalidFieldCount = 0;

    for (let item of itemsToEdit) {
        try {
            let fieldValue = item.getField(fieldName) || "";
            if (searchRegex.test(fieldValue)) {
                idsCorrect.push(item.id);
            }
        } catch (error) {
            Zotero.logError(`Error in bulk edit script: '${fieldName}' is not a valid field for type '${item.itemType}'. Skipping this item.`);
            invalidFieldCount++;
        }
    }

    if (!idsCorrect.length && invalidFieldCount === 0) {
        window.alert("No items found with the specified search term.");
        return;
    }

    // Preview of Edit
    if (idsCorrect.length > 0) {
        let previewItem = await Zotero.Items.getAsync(idsCorrect[0]);
        let previewOldValue = previewItem.getField(fieldName) || "";
        let previewNewValue = previewOldValue.replace(searchRegex, replace);
        let confirmed = window.confirm(`Confirm update: ${idsCorrect.length} item(s) found with the specified search term in the field "${selectedField.localized}".\n\nExample of change:\nOld: ${previewOldValue}\nNew: ${previewNewValue}\n\nDo you want to apply these changes to all items?`);

        if (!confirmed) {
            window.alert("Update operation canceled.");
            return;
        }
    }

    // Replace values in selected items
    await Zotero.DB.executeTransaction(async function() {
        for (let id of idsCorrect) {
            let item = await Zotero.Items.getAsync(id);
            let oldValue = item.getField(fieldName) || "";
            let newValue = oldValue.replace(searchRegex, replace);
            item.setField(fieldName, newValue);
            await item.save();
        }
    });

    window.alert(`${idsCorrect.length} item(s) updated successfully.\n\nThe specified search term was replaced in the "${selectedField.localized}" field.\n\n${invalidFieldCount} item(s) were not updated due to invalid fields.`);
}

(async function () {
    try {
        // Prevent duplicate execution
        if (window.bulkEditRunning) return;
        window.bulkEditRunning = true;

        if (!items && !item) {
            window.alert("Bulk Edit", "No item or items array provided.");
            window.bulkEditRunning = false;
            return;
        }

        let itemsToEdit = await getItemsToEdit(triggerType, item, items);
        if (!itemsToEdit) {
            window.bulkEditRunning = false;
            return;
        }

        // Prompt the user to choose between modifying fields or item types
        let editOption;
        while (true) {
            editOption = window.prompt("Do you want to modify fields or item types?\n\nEnter '1' to modify fields or '2' to modify item types:");
            if (editOption === null) {
                window.bulkEditRunning = false;
                return;
            }
            if (editOption === '1' || editOption === '2') {
                break;
            } else {
                window.alert("Invalid selection. Please enter '1' or '2'.");
            }
        }

        let selectedField;
        if (editOption === '1') {
            // Field selection process
            selectedField = await autocompletePrompt("Start typing the field name.", fields);
            if (!selectedField) {
                window.bulkEditRunning = false;
                return;
            }
            const fieldName = selectedField.field;

            let search;
            while (true) {
                search = window.prompt(`Enter the characters or words to search for in the "${selectedField.localized}" field. Use * as a wildcard. Leave empty to search for blank fields. Use \\ to escape special characters (e.g., C++ becomes C\\+\\+).`);
                if (search !== null) {
                    break;
                } else {
                    window.alert("Invalid input. Please enter a valid search term.");
                }
            }

            let replace;
            while (true) {
                replace = window.prompt(`Enter the replacement term for the "${selectedField.localized}" field:`);
                if (replace !== null) {
                    break;
                } else {
                    window.alert("Invalid input. Please enter a valid replacement term.");
                }
            }

            let searchRegex;
            if (search === "") {
                searchRegex = /^$/;
            } else {
                const regexPattern = search.split("*").map(escapeRegExp).join(".*");
                searchRegex = new RegExp(regexPattern, "i");
            }

            const confirmationMessage = `You have chosen to edit ${itemsToEdit.length} records.\n\nField: ${selectedField.localized}\nSearch term: ${search}\nReplace term: ${replace}\n\nDo you want to proceed?`;
            if (!window.confirm(confirmationMessage)) {
                window.bulkEditRunning = false;
                return;
            }

            try {
                if (fieldName === "creatorFirstName" || fieldName === "creatorLastName") {
                    await updateCreators(fieldName, itemsToEdit, searchRegex, replace);
                } else if (fieldName === "note") {
                    await updateNotes(itemsToEdit, searchRegex, replace);
                } else {
                    await updateFieldValues(fieldName, selectedField, itemsToEdit, searchRegex, replace);
                }
            } catch (error) {
                Zotero.logError(`Error in bulk edit script: ${error.message}`);
            }
        } else if (editOption === '2') {
            // Item type selection process
            const selectedType = await autocompletePrompt("Start typing the item type.", itemTypes);
            if (!selectedType) {
                window.bulkEditRunning = false;
                return;
            }

            const confirmationMessage = `You have chosen to edit ${itemsToEdit.length} records.\n\nNew Item Type: ${selectedType.localized}\n\nDo you want to proceed?`;
            if (!window.confirm(confirmationMessage)) {
                window.bulkEditRunning = false;
                return;
            }

            try {
                await updateItemType(itemsToEdit, selectedType.localized);
            } catch (error) {
                Zotero.logError(`Error in bulk edit script: ${error.message}`);
            }
        }

        window.bulkEditRunning = false;
    } catch (error) {
        window.bulkEditRunning = false;
        Zotero.logError(`Error in bulk edit script: ${error.message}`);
    }
})();
