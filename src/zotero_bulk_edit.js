var fields = [
    { "field": "abstractNote", "localized": "Abstract" },
    { "field": "accessDate", "localized": "Accessed" },
    { "field": "applicationNumber", "localized": "Application Number" },
    { "field": "archive", "localized": "Archive" },
    { "field": "archiveID", "localized": "Archive ID" },
    { "field": "archiveLocation", "localized": "Loc. in Archive" },
    { "field": "artworkMedium", "localized": "Medium" },
    { "field": "artworkSize", "localized": "Artwork Size" },
    { "field": "assignee", "localized": "Assignee" },
    { "field": "audioFileType", "localized": "File Type" },
    { "field": "audioRecordingFormat", "localized": "Format" },
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
    { "field": "forumTitle", "localized": "Forum/Listserv Title" },
    { "field": "genre", "localized": "Genre" },
    { "field": "history", "localized": "History" },
    { "field": "identifier", "localized": "Identifier" },
    { "field": "institution", "localized": "Institution" },
    { "field": "interviewMedium", "localized": "Medium" },
    { "field": "ISBN", "localized": "ISBN" },
    { "field": "ISSN", "localized": "ISSN" },
    { "field": "issue", "localized": "Issue" },
    { "field": "issueDate", "localized": "Issue Date" },
    { "field": "issuingAuthority", "localized": "Issuing Authority" },
    { "field": "journalAbbreviation", "localized": "Journal Abbr" },
    { "field": "label", "localized": "Label" },
    { "field": "language", "localized": "Language" },
    { "field": "legalStatus", "localized": "Legal Status" },
    { "field": "legislativeBody", "localized": "Legislative Body" },
    { "field": "libraryCatalog", "localized": "Library Catalog" },
    { "field": "mapType", "localized": "Type" },
    { "field": "manuscriptType", "localized": "Type" },
    { "field": "meetingName", "localized": "Meeting Name" },
    { "field": "nameOfAct", "localized": "Name of Act" },
    { "field": "network", "localized": "Network" },
    { "field": "numPages", "localized": "# of Pages" },
    { "field": "number", "localized": "Number" },
    { "field": "numberOfVolumes", "localized": "# of Volumes" },
    { "field": "organization", "localized": "Organization" },
    { "field": "pages", "localized": "Pages" },
    { "field": "patentNumber", "localized": "Patent Number" },
    { "field": "place", "localized": "Place" },
    { "field": "postType", "localized": "Post Type" },
    { "field": "presentationType", "localized": "Type" },
    { "field": "priorityNumbers", "localized": "Priority Numbers" },
    { "field": "proceedingsTitle", "localized": "Proceedings Title" },
    { "field": "programmingLanguage", "localized": "Prog. Language" },
    { "field": "programTitle", "localized": "Program Title" },
    { "field": "publicLawNumber", "localized": "Public Law Number" },
    { "field": "publicationTitle", "localized": "Publication" },
    { "field": "publisher", "localized": "Publisher" },
    { "field": "references", "localized": "References" },
    { "field": "reportNumber", "localized": "Report Number" },
    { "field": "reportType", "localized": "Report Type" },
    { "field": "reporter", "localized": "Reporter" },
    { "field": "reporterVolume", "localized": "Reporter Volume" },
    { "field": "repository", "localized": "Repository" },
    { "field": "repositoryLocation", "localized": "Repo. Location" },
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
    { "field": "videoRecordingFormat", "localized": "Format" },
    { "field": "volume", "localized": "Volume" },
    { "field": "websiteTitle", "localized": "Website Title" },
    { "field": "websiteType", "localized": "Website Type" }
];

fields.sort((a, b) => a.localized.localeCompare(b.localized));

function autocompletePrompt(promptText, suggestions) {
    let input = "";
    while (true) {
        input = prompt(promptText + "\n\nCurrent input: " + input);
        if (!input) return null;

        let matches = suggestions.filter(suggestion => suggestion.localized.toLowerCase().startsWith(input.toLowerCase()));
        if (matches.length === 0) {
            alert("No matches found. Please try again.");
            continue;
        } else if (matches.length === 1) {
            return matches[0];
        } else {
            let suggestionText = matches.map((match, index) => `${index + 1}. ${match.localized}`).join("\n");
            let additionalInput = prompt(`Multiple matches found:\n\n${suggestionText}\n\nCurrent input: ${input}\n\nType more characters to refine or select a number:`);
            if (!additionalInput) {
                alert("Input canceled. Please start over.");
                return null;
            }
            if (!isNaN(additionalInput) && additionalInput > 0 && additionalInput <= matches.length) {
                return matches[parseInt(additionalInput, 10) - 1];
            } else {
                input += additionalInput;
            }
        }
    }
}

let selectedField = autocompletePrompt("Start typing the field name:", fields);
if (!selectedField) {
    alert("Field selection canceled or invalid.");
    return;
}
var fieldName = selectedField.field;

var search = prompt("What characters/words should be searched for? Use * as a wildcard. Leave empty to search for blank fields.", "");
var replace = prompt("What should it be replaced with?", "");

// Convert the search term into a regular expression
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

var searchRegex;
if (search === "") {
    searchRegex = /^$/;
} else {
    var regexPattern = search.split("*").map(escapeRegExp).join(".*");
    searchRegex = new RegExp(regexPattern, "i");  // "i" for case-insensitive matching
}

// Get selected items
var selectedItems = ZoteroPane.getSelectedItems();
if (!selectedItems.length) {
    alert("No items selected.");
    return;
}

// Handle creator name fields separately
if (fieldName === "creatorFirstName" || fieldName === "creatorLastName") {
    let deletionConfirmed = false;
    await Zotero.DB.executeTransaction(async function () {
        for (let item of selectedItems) {
            let creators = item.getCreators();
            let updated = false;
            let newCreators = [];

            for (let creator of creators) {
                let nameToSearch = fieldName === "creatorFirstName" ? creator.firstName : creator.lastName;

                if (searchRegex.test(nameToSearch)) {
                    if (fieldName === "creatorFirstName") {
                        creator.firstName = nameToSearch.replace(searchRegex, replace);
                    } else {
                        creator.lastName = nameToSearch.replace(searchRegex, replace);
                    }

                    // Check if both firstName and lastName are empty after replacement
                    if (!creator.firstName && !creator.lastName) {
                        // Confirm deletion of creator entry if not already confirmed
                        if (!deletionConfirmed) {
                            deletionConfirmed = confirm("Some creator entries will be empty after the update. Do you want to delete these entries?");
                        }

                        // If deletion is confirmed, skip adding this creator to newCreators, effectively deleting it
                        if (deletionConfirmed) {
                            updated = true;
                            continue;
                        }
                    }
                    updated = true;
                }
                newCreators.push(creator);
            }

            // Ensure new creators are added if field was initially empty
            if (!updated && (fieldName === "creatorFirstName" || fieldName === "creatorLastName")) {
                if (!creators.length) {
                    if (fieldName === "creatorFirstName") {
                        newCreators.push({ creatorType: "author", firstName: replace, lastName: "" });
                    } else {
                        newCreators.push({ creatorType: "author", firstName: "", lastName: replace });
                    }
                    updated = true;
                }
            }

            if (updated) {
                item.setCreators(newCreators);
                await item.save();
            }
        }
    });
    alert("Creator names updated.");
    return;
}

// Filter items that contain the search term in the specified field or are blank if search is empty
var idsCorrect = [];
for (let item of selectedItems) {
    var fieldValue = item.getField(fieldName) || "";
    if (searchRegex.test(fieldValue)) {
        idsCorrect.push(item.id);
    }
}

if (!idsCorrect.length) {
    alert("No items found with the specified search term in the selected items.");
    return;
}

// Preview of Edit
var previewItem = await Zotero.Items.getAsync(idsCorrect[0]);
let previewOldValue = previewItem.getField(fieldName) || "";
let previewNewValue = previewOldValue.replace(searchRegex, replace);
var confirmed = confirm(idsCorrect.length + " item(s) found" + "\n\n" +
    "Old:\n" + previewItem.getField(fieldName) + "\n" + "New:\n" + previewNewValue);

// Replace
if (confirmed == true) {
    await Zotero.DB.executeTransaction(async function () {
        for (let id of idsCorrect) {
            let item = await Zotero.Items.getAsync(id);
            let mappedFieldID = Zotero.ItemFields.getFieldIDFromTypeAndBase(item.itemTypeID, fieldName);
            let oldValue = item.getField(fieldName) || "";
            let newValue = oldValue.replace(searchRegex, replace);
            item.setField(mappedFieldID ? mappedFieldID : fieldID, newValue);
            await item.save();
        }
    });
    alert(idsCorrect.length + " item(s) updated.");
}
