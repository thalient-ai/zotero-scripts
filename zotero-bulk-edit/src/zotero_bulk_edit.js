(async function () {
  const startTime = performance.now();

  // ---------------------------------------------------------------------------
  // Field definitions
  // ---------------------------------------------------------------------------
  const fields = [
    { field: "abstractNote", localized: "Abstract" },
    { field: "accessDate", localized: "Accessed Date" },
    { field: "applicationNumber", localized: "Application Number" },
    { field: "archive", localized: "Archive" },
    { field: "archiveID", localized: "Archive ID" },
    { field: "archiveLocation", localized: "Location in Archive" },
    { field: "artworkMedium", localized: "Artwork Medium" },
    { field: "artworkSize", localized: "Artwork Size" },
    { field: "assignee", localized: "Assignee" },
    { field: "audioFileType", localized: "Audio File Type" },
    { field: "audioRecordingFormat", localized: "Audio Format" },
    { field: "billNumber", localized: "Bill Number" },
    { field: "blogTitle", localized: "Blog Title" },
    { field: "bookTitle", localized: "Book Title" },
    { field: "callNumber", localized: "Call Number" },
    { field: "caseName", localized: "Case Name" },
    { field: "citationKey", localized: "Citation Key" },
    { field: "code", localized: "Code" },
    { field: "codeNumber", localized: "Code Number" },
    { field: "codePages", localized: "Code Pages" },
    { field: "codeVolume", localized: "Code Volume" },
    { field: "committee", localized: "Committee" },
    { field: "company", localized: "Company" },
    { field: "conferenceName", localized: "Conference Name" },
    { field: "country", localized: "Country" },
    { field: "court", localized: "Court" },
    { field: "creatorFirstName", localized: "First Name" },
    { field: "creatorLastName", localized: "Last Name" },
    { field: "date", localized: "Date" },
    { field: "dateDecided", localized: "Date Decided" },
    { field: "dateEnacted", localized: "Date Enacted" },
    { field: "dictionaryTitle", localized: "Dictionary Title" },
    { field: "distributor", localized: "Distributor" },
    { field: "docketNumber", localized: "Docket Number" },
    { field: "documentNumber", localized: "Document Number" },
    { field: "DOI", localized: "DOI" },
    { field: "edition", localized: "Edition" },
    { field: "encyclopediaTitle", localized: "Encyclopedia Title" },
    { field: "episodeNumber", localized: "Episode Number" },
    { field: "extra", localized: "Extra" },
    { field: "filingDate", localized: "Filing Date" },
    { field: "firstPage", localized: "First Page" },
    { field: "format", localized: "Format" },
    { field: "forumTitle", localized: "Forum Title" },
    { field: "genre", localized: "Genre" },
    { field: "history", localized: "History" },
    { field: "identifier", localized: "Identifier" },
    { field: "institution", localized: "Institution" },
    { field: "interviewMedium", localized: "Interview Medium" },
    { field: "ISBN", localized: "ISBN" },
    { field: "ISSN", localized: "ISSN" },
    { field: "issue", localized: "Issue" },
    { field: "issueDate", localized: "Issue Date" },
    { field: "issuingAuthority", localized: "Issuing Authority" },
    { field: "journalAbbreviation", localized: "Journal Abbreviation" },
    { field: "label", localized: "Label" },
    { field: "language", localized: "Language" },
    { field: "legalStatus", localized: "Legal Status" },
    { field: "legislativeBody", localized: "Legislative Body" },
    { field: "libraryCatalog", localized: "Library Catalog" },
    { field: "mapType", localized: "Map Type" },
    { field: "manuscriptType", localized: "Manuscript Type" },
    { field: "meetingName", localized: "Meeting Name" },
    { field: "nameOfAct", localized: "Name of Act" },
    { field: "network", localized: "Network" },
    { field: "note", localized: "Note" },
    { field: "numPages", localized: "Number of Pages" },
    { field: "number", localized: "Number" },
    { field: "numberOfVolumes", localized: "Number of Volumes" },
    { field: "organization", localized: "Organization" },
    { field: "pages", localized: "Pages" },
    { field: "patentNumber", localized: "Patent Number" },
    { field: "place", localized: "Place" },
    { field: "postType", localized: "Post Type" },
    { field: "presentationType", localized: "Presentation Type" },
    { field: "priorityNumbers", localized: "Priority Numbers" },
    { field: "proceedingsTitle", localized: "Proceedings Title" },
    { field: "programmingLanguage", localized: "Programming Language" },
    { field: "programTitle", localized: "Program Title" },
    { field: "publicLawNumber", localized: "Public Law Number" },
    { field: "publicationTitle", localized: "Publication Title" },
    { field: "publisher", localized: "Publisher" },
    { field: "references", localized: "References" },
    { field: "reportNumber", localized: "Report Number" },
    { field: "reportType", localized: "Report Type" },
    { field: "reporter", localized: "Reporter" },
    { field: "reporterVolume", localized: "Reporter Volume" },
    { field: "repository", localized: "Repository" },
    { field: "repositoryLocation", localized: "Repository Location" },
    { field: "rights", localized: "Rights" },
    { field: "runningTime", localized: "Running Time" },
    { field: "scale", localized: "Scale" },
    { field: "section", localized: "Section" },
    { field: "series", localized: "Series" },
    { field: "seriesNumber", localized: "Series Number" },
    { field: "seriesText", localized: "Series Text" },
    { field: "seriesTitle", localized: "Series Title" },
    { field: "session", localized: "Session" },
    { field: "shortTitle", localized: "Short Title" },
    { field: "status", localized: "Status" },
    { field: "studio", localized: "Studio" },
    { field: "subject", localized: "Subject" },
    { field: "system", localized: "System" },
    { field: "thesisType", localized: "Thesis Type" },
    { field: "title", localized: "Title" },
    { field: "type", localized: "Type" },
    { field: "university", localized: "University" },
    { field: "url", localized: "URL" },
    { field: "versionNumber", localized: "Version" },
    { field: "videoRecordingFormat", localized: "Video Recording Format" },
    { field: "volume", localized: "Volume" },
    { field: "websiteTitle", localized: "Website Title" },
    { field: "websiteType", localized: "Website Type" }
  ];

  // ---------------------------------------------------------------------------
  // Item type definitions
  // ---------------------------------------------------------------------------
  const itemTypes = [
    { type: "artwork", localized: "Artwork" },
    { type: "audioRecording", localized: "Audio Recording" },
    { type: "bill", localized: "Bill" },
    { type: "blogPost", localized: "Blog Post" },
    { type: "book", localized: "Book" },
    { type: "bookSection", localized: "Book Section" },
    { type: "case", localized: "Case" },
    { type: "computerProgram", localized: "Software" },
    { type: "conferencePaper", localized: "Conference Paper" },
    { type: "dataset", localized: "Dataset" },
    { type: "dictionaryEntry", localized: "Dictionary Entry" },
    { type: "document", localized: "Document" },
    { type: "email", localized: "Email" },
    { type: "encyclopediaArticle", localized: "Encyclopedia Article" },
    { type: "film", localized: "Film" },
    { type: "forumPost", localized: "Forum Post" },
    { type: "hearing", localized: "Hearing" },
    { type: "instantMessage", localized: "Instant Message" },
    { type: "interview", localized: "Interview" },
    { type: "journalArticle", localized: "Journal Article" },
    { type: "letter", localized: "Letter" },
    { type: "magazineArticle", localized: "Magazine Article" },
    { type: "manuscript", localized: "Manuscript" },
    { type: "map", localized: "Map" },
    { type: "newspaperArticle", localized: "Newspaper Article" },
    { type: "patent", localized: "Patent" },
    { type: "podcast", localized: "Podcast" },
    { type: "preprint", localized: "Preprint" },
    { type: "presentation", localized: "Presentation" },
    { type: "radioBroadcast", localized: "Radio Broadcast" },
    { type: "report", localized: "Report" },
    { type: "standard", localized: "Standard" },
    { type: "statute", localized: "Statute" },
    { type: "thesis", localized: "Thesis" },
    { type: "tvBroadcast", localized: "TV Broadcast" },
    { type: "videoRecording", localized: "Video Recording" },
    { type: "webpage", localized: "Web Page" }
  ];

  // Sort fields and item types alphabetically by localized name
  fields.sort((a, b) => a.localized.localeCompare(b.localized));
  itemTypes.sort((a, b) => a.localized.localeCompare(b.localized));

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function logTime(label, timeMs) {
    try {
      console.log(`${label}: ${(timeMs / 1000).toFixed(2)} seconds`);
    } catch (e) {
      console.error(`Failed to log time for ${label}: ${e && e.message ? e.message : e}`);
    }
  }

  function filterTopLevelBibItems(items) {
    // Only keep parent bibliographic items
    return (items || []).filter((item) => {
      try {
        if (!item) return false;
        if (item.isAttachment && item.isAttachment()) return false;
        if (item.isNote && item.isNote()) return false;
        if (item.parentItemID) return false;
        return true;
      } catch (e) {
        return false;
      }
    });
  }

  // Prompt user to select a field or item type with simple autocomplete behavior
  function autocompletePrompt(promptText, suggestions) {
    let input = "";
    while (true) {
      input = prompt(
        promptText +
          "\n\nCurrent input: " +
          input +
          "\n\nStart typing the name of the item field (e.g., 'Title', 'Publisher', 'Date') or item type (e.g., 'Document', 'Journal Article', 'Book') you want to edit."
      );

      if (input === null) return null;

      const matches = suggestions.filter((s) =>
        s.localized.toLowerCase().includes(input.toLowerCase())
      );

      if (matches.length === 0) {
        alert("No matches found. Please try again.");
        continue;
      }

      const suggestionText = matches
        .map((m, i) => `${i + 1}. ${m.localized}`)
        .join("\n");

      const choice = prompt(
        `Multiple matches found:\n\n${suggestionText}\n\nType the number to select:`
      );

      if (choice === null || choice === "") {
        alert("Input canceled. Please start over.");
        return null;
      }

      const idx = parseInt(choice, 10);
      if (!isNaN(idx) && idx > 0 && idx <= matches.length) {
        return matches[idx - 1];
      }

      alert("Invalid selection. Please enter a number between 1 and " + matches.length + ".");
    }
  }

  // ---------------------------------------------------------------------------
  // Item retrieval by scope
  // ---------------------------------------------------------------------------
  async function getItemsToEdit(editScope) {
    const zoteroPane = Zotero.getActiveZoteroPane();

    if (editScope === "2") {
      const collection = zoteroPane.getSelectedCollection();
      if (!collection) {
        alert("No collection selected.");
        return null;
      }
      const items = await collection.getChildItems();
      return items;
    }

    if (editScope === "3") {
      const savedSearch = zoteroPane.getSelectedSavedSearch();
      if (!savedSearch) {
        alert("No saved search selected.");
        return null;
      }

      console.log(`Saved search found: ${savedSearch.name} (ID: ${savedSearch.id})`);

      const search = new Zotero.Search();
      search.libraryID = savedSearch.libraryID;
      search.addCondition("savedSearchID", "is", savedSearch.id);

      const itemIDs = await search.search();
      console.log(`Number of items found in saved search: ${itemIDs.length}`);

      if (!itemIDs.length) {
        alert("No items found in the saved search.");
        return null;
      }

      return await Zotero.Items.getAsync(itemIDs);
    }

    // Default: selected items
    const selectedItems = zoteroPane.getSelectedItems();
    if (!selectedItems || !selectedItems.length) {
      alert("No items selected.");
      return null;
    }
    return selectedItems;
  }

  // ---------------------------------------------------------------------------
  // Update operations
  // ---------------------------------------------------------------------------

  async function updateItemType(itemsToEditRaw, newTypeLocalized) {
    const itemsToEdit = filterTopLevelBibItems(itemsToEditRaw);

    if (!itemsToEdit.length) {
      alert("No top-level items to edit. Your selection may be attachments or notes.");
      return;
    }

    const typeEntry = itemTypes.find((t) => t.localized === newTypeLocalized);
    if (!typeEntry) {
      alert(`Invalid item type: ${newTypeLocalized}`);
      return;
    }

    const typeID = Zotero.ItemTypes.getID(typeEntry.type);
    if (!typeID) {
      alert(`Invalid item type ID for: ${newTypeLocalized}`);
      return;
    }

    let processedCount = 0;
    let skippedCount = 0;

    for (const item of itemsToEdit) {
      try {
        item.setType(typeID);
        await item.saveTx();
        processedCount++;
      } catch (e) {
        skippedCount++;
        console.error(e);
      }
    }

    alert(
      `Item types updated to "${newTypeLocalized}".\n\n` +
        `${processedCount} item(s) processed,\n` +
        `${skippedCount} item(s) skipped.`
    );
  }

  async function updateCreators(fieldName, itemsToEditRaw, searchRegex, replace) {
    const itemsToEdit = filterTopLevelBibItems(itemsToEditRaw);

    if (!itemsToEdit.length) {
      alert("No top-level items to edit. Your selection may be attachments or notes.");
      return;
    }

    const toBeDeletedItemIDs = new Set();
    const originalCreatorsMap = new Map();
    let updatedItemCount = 0;

    // First pass: apply replacements, track items that would end up with blank creators
    for (const item of itemsToEdit) {
      try {
        const creators = item.getCreators();
        originalCreatorsMap.set(item.id, JSON.parse(JSON.stringify(creators)));

        let updated = false;
        let newCreators = [];

        for (let creator of creators) {
          const isSingleField = creator.fieldMode === 1;

          const nameToSearch =
            isSingleField
              ? creator.lastName
              : fieldName === "creatorFirstName"
              ? creator.firstName
              : creator.lastName;

          if (searchRegex.test(nameToSearch || "")) {
            if (isSingleField || fieldName === "creatorLastName") {
              creator.lastName = (nameToSearch || "").replace(searchRegex, replace);
            } else {
              creator.firstName = (nameToSearch || "").replace(searchRegex, replace);
            }
            updated = true;
          }

          // Keep creator for now, later we filter empties
          newCreators.push(creator);
        }

        // Filter out creators that have no name (unless single-field creator)
        newCreators = newCreators.filter(
          (c) => c.fieldMode === 1 || (c.firstName && c.firstName.trim()) || (c.lastName && c.lastName.trim())
        );

        if (updated) {
          item.setCreators(newCreators);
          await item.saveTx();
          updatedItemCount++;

          // Track if any creator entries were blanked out in a way that would remove them
          // This is conservative, it just offers deletion/undo behavior if you want it.
          // If you do not want this UX at all, you can delete everything below related to deletionConfirmed.
          // Here, we only flag for deletion if original had creators and newCreators got smaller.
          const original = originalCreatorsMap.get(item.id) || [];
          if (newCreators.length < original.length) {
            toBeDeletedItemIDs.add(item.id);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (toBeDeletedItemIDs.size) {
      const deletionConfirmed = confirm(
        "Some author names may have been removed because they became blank. Do you want to keep them removed?\n\n" +
          "OK = keep removed\n" +
          "Cancel = revert those items back to their original creator lists"
      );

      if (!deletionConfirmed) {
        for (const itemID of toBeDeletedItemIDs) {
          try {
            const item = await Zotero.Items.getAsync(itemID);
            const originalCreators = originalCreatorsMap.get(itemID);
            if (originalCreators) {
              item.setCreators(originalCreators);
              await item.saveTx();
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
    }

    alert(`Creators updated.\n\nItems updated: ${updatedItemCount}`);
  }

  async function updateNotes(itemsToEdit, searchRegex, replace) {
    // This updates only standalone note items that are selected, not child notes of bib items
    let updatedCount = 0;

    for (const item of itemsToEdit || []) {
      try {
        if (item.isNote && item.isNote()) {
          const noteContent = item.getNote();
          const newNoteContent = (noteContent || "").replace(searchRegex, replace);
          if (newNoteContent !== noteContent) {
            item.setNote(newNoteContent);
            await item.saveTx();
            updatedCount++;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    alert(`Notes updated.\n\nNotes updated: ${updatedCount}`);
  }

  async function updateFieldValues(fieldName, selectedField, itemsToEditRaw, searchRegex, replace, searchRaw) {
    const itemsToEdit = filterTopLevelBibItems(itemsToEditRaw);

    if (!itemsToEdit.length) {
      alert("No top-level items to edit. Your selection may be attachments or notes.");
      return;
    }

    const searchIsAll = (searchRaw || "").trim() === "*";

    let invalidFieldCount = 0;
    let matchedCount = 0;
    let changedCount = 0;

    // Preview selection
    let previewOldValue = "";
    let previewNewValue = "";
    let previewFound = false;

    // Apply directly, no explicit DB transaction for reliability in Run JavaScript
    for (const item of itemsToEdit) {
      try {
        const oldValue = item.getField(fieldName) || "";
        const isMatch = searchIsAll || searchRegex.test(oldValue);

        if (!isMatch) continue;

        matchedCount++;

        const newValue = searchIsAll ? replace : oldValue.replace(searchRegex, replace);

        if (!previewFound) {
          previewOldValue = oldValue;
          previewNewValue = newValue;
          previewFound = true;

          const confirmed = confirm(
            `${matchedCount} item(s) matched so far (final count may be larger).\n\n` +
              `Field: ${selectedField.localized}\n\n` +
              `Example:\nOld: ${previewOldValue}\nNew: ${previewNewValue}\n\n` +
              `Apply to all matched items?`
          );

          if (!confirmed) {
            alert("Update operation canceled.");
            return;
          }
        }

        if (newValue !== oldValue) {
          item.setField(fieldName, newValue);
          await item.saveTx();
          changedCount++;
        }
      } catch (e) {
        invalidFieldCount++;
        console.error(e);
      }
    }

    if (!matchedCount && !invalidFieldCount) {
      alert("No items found with the specified search term.");
      return;
    }

    alert(
      `Done.\n\n` +
        `Matched: ${matchedCount}\n` +
        `Changed: ${changedCount}\n` +
        `Invalid field for item type: ${invalidFieldCount}`
    );
  }

  // ---------------------------------------------------------------------------
  // Main
  // ---------------------------------------------------------------------------
  try {
    const editScope = prompt(
      "Enter '1' to edit only selected items, '2' to edit all items in the current collection, or '3' to edit all items in a saved search:"
    );
    if (!["1", "2", "3"].includes(editScope)) {
      alert("Invalid selection. Please enter '1', '2', or '3'.");
      return;
    }

    let itemsToEdit = await getItemsToEdit(editScope);
    if (!itemsToEdit) return;

    const editOption = prompt(
      "Do you want to modify fields or item types?\n\nEnter '1' to modify fields or '2' to modify item types:"
    );
    if (editOption !== "1" && editOption !== "2") {
      alert("Invalid selection. Please enter '1' or '2'.");
      return;
    }

    if (editOption === "1") {
      const selectedField = autocompletePrompt("Start typing the field name:", fields);
      if (!selectedField) {
        alert("Field selection canceled or invalid.");
        return;
      }

      const fieldName = selectedField.field;

      const search = prompt(
        `Enter the characters or words to search for in the "${selectedField.localized}" field.\n\n` +
          `Use * as a wildcard.\n` +
          `Use a single * (just an asterisk) to match all values and overwrite the field.\n` +
          `Leave empty to search for blank fields.\n` +
          `Use \\ to escape special characters (e.g., C++ becomes C\\+\\+).`,
        ""
      );
      if (search === null) {
        alert("Search operation canceled.");
        return;
      }

      const replace = prompt(`Enter the replacement term for the "${selectedField.localized}" field:`, "");
      if (replace === null) {
        alert("Replace operation canceled.");
        return;
      }

      let searchRegex;
      if (search === "") {
        searchRegex = /^$/;
      } else if (search.trim() === "*") {
        // Overwrite mode, regex not used for replacement, but keep a harmless one
        searchRegex = /[\s\S]*/;
      } else {
        const regexPattern = search.split("*").map(escapeRegExp).join(".*");
        searchRegex = new RegExp(regexPattern, "i");
      }

      const confirmationMessage =
        `You have chosen to edit ${itemsToEdit.length} record(s) (raw selection).\n\n` +
        `Field: ${selectedField.localized}\n` +
        `Search term: ${search}\n` +
        `Replace term: ${replace}\n\n` +
        `Proceed?`;

      const confirmation = confirm(confirmationMessage);
      if (!confirmation) {
        console.log("User canceled the editing process.");
        return;
      }

      console.log(confirmationMessage);

      try {
        if (fieldName === "creatorFirstName" || fieldName === "creatorLastName") {
          await updateCreators(fieldName, itemsToEdit, searchRegex, replace);
        } else if (fieldName === "note") {
          await updateNotes(itemsToEdit, searchRegex, replace);
        } else {
          await updateFieldValues(fieldName, selectedField, itemsToEdit, searchRegex, replace, search);
        }
      } catch (e) {
        console.error(e);
        alert(`Error in bulk edit script: ${e && e.message ? e.message : e}`);
      }
    } else {
      const selectedType = autocompletePrompt("Start typing the item type:", itemTypes);
      if (!selectedType) {
        alert("Item type selection canceled or invalid.");
        return;
      }

      const confirmationMessage =
        `You have chosen to edit ${itemsToEdit.length} record(s) (raw selection).\n\n` +
        `New Item Type: ${selectedType.localized}\n\n` +
        `Proceed?`;

      const confirmation = confirm(confirmationMessage);
      if (!confirmation) {
        console.log("User canceled the editing process.");
        return;
      }

      console.log(confirmationMessage);

      try {
        await updateItemType(itemsToEdit, selectedType.localized);
      } catch (e) {
        console.error(e);
        alert(`Error in bulk edit script: ${e && e.message ? e.message : e}`);
      }
    }
  } catch (e) {
    console.error(e);
    alert(`Error in bulk edit script: ${e && e.message ? e.message : e}`);
  } finally {
    const endTime = performance.now();
    logTime("Total time", endTime - startTime);
  }
})();
