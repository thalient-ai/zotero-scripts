(async function() {
    const startTime = performance.now();

    try {
        const zoteroPane = Zotero.getActiveZoteroPane();

        // Dictionary of specific words or terms that should be capitalized
        const customCapitalization = {
			// General Terms 
			'nist': 'NIST',
            'nerc': 'NERC',
            'fips': 'FIPS',
            'sha-3': 'SHA-3',
            'iscma': 'ISCMA',
            'eddsa': 'EdDSA',
            'iot': 'IoT',
            'olir': 'OLIR',
            'tcg': 'TCG',
            'tls': 'TLS',
            '5g': '5G',
            'it': 'IT',
            'sp': 'SP',
            'cmvp': 'CMVP',
            'lte': 'LTE',
            'v2x': 'V2X',
            'v2v': 'V2V',
            'stpa': 'STPA',
            'asil': 'ASIL',
            'eee': 'EEE',
            'nacs': 'NACS',
            'iso': 'ISO',
            'iec': 'IEC',
            'iacs': 'IACS',
            'c': 'C',
            'cpu': 'CPU',
            'ram': 'RAM',
            'rom': 'ROM',
            'usb': 'USB',
            'led': 'LED',
            'lcd': 'LCD',
            'hdd': 'HDD',
            'ssd': 'SSD',
            'http': 'HTTP',
            'https': 'HTTPS',
            'html': 'HTML',
            'css': 'CSS',
            'json': 'JSON',
            'xml': 'XML',
            'api': 'API',
            'sql': 'SQL',
            'db': 'DB',
            'ai': 'AI',
            'ml': 'ML',
            'iot': 'IoT',
            'gps': 'GPS',
            'pdf': 'PDF',
            'gif': 'GIF',
            'jpeg': 'JPEG',
            'png': 'PNG',
            'svg': 'SVG',
            'url': 'URL',
            'ip': 'IP',
            'tcp': 'TCP',
            'udp': 'UDP',
            'vpn': 'VPN',
            'wifi': 'WiFi',
            'rfid': 'RFID',
            'nfc': 'NFC',
            'gpu': 'GPU',
            'javascript': 'JavaScript',
            'python': 'Python',
            'java': 'Java',
            'c++': 'C++',
            'c#': 'C#',
            'ruby': 'Ruby',
            'go': 'Go',
            'swift': 'Swift',
            'kotlin': 'Kotlin',
            'rust': 'Rust',
            'php': 'PHP',
            'perl': 'Perl',
            'r': 'R',
            'scala': 'Scala',
            'typescript': 'TypeScript',
            'matlab': 'MATLAB',
            'dart': 'Dart',
            'objective-c': 'Objective-C',
        };

        // Utility function to convert a string to title case based on specified rules
        function toTitleCase(str) {
            const lowerCaseWords = ["a", "an", "and", "as", "at", "but", "by", "for", "if", "in", "nor", "of", "on", "or", "so", "the", "to", "up", "yet"];
            const separators = ['-', ':', '–', '/'];

            // Split by spaces to process each word
            let words = str.split(' ');

            // Process each word in the title
            for (let i = 0; i < words.length; i++) {
                let word = words[i];
                const lowerWord = word.toLowerCase();

                // Handle custom capitalization
                if (customCapitalization[lowerWord]) {
                    words[i] = customCapitalization[lowerWord];
                    continue;
                }

                // Capitalize the first word, words following a special character, and words not in the lowercase words list
                if (i === 0 || !lowerCaseWords.includes(lowerWord) || isFollowingSpecialChar(words, i)) {
                    // Handle parentheses content
                    if (word.includes('(') || word.includes(')')) {
                        let parts = word.split(/([()])/);
                        words[i] = parts.map(part => part.match(/[()]/) ? part : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join('');
                    } else {
                        words[i] = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                    }
                } else {
                    words[i] = word.toLowerCase();
                }
            }

            // Ensure capitalization after separators without adding or removing spaces
            for (let sep of separators) {
                let regex = new RegExp(`(${escapeRegExp(sep)})(\\w+)`, 'g');
                str = words.join(' ').replace(regex, (match, p1, p2) => {
                    const replacement = p1 + (customCapitalization[p2.toLowerCase()] || p2.charAt(0).toUpperCase() + p2.slice(1));
                    return replacement;
                });
            }

            // Handle custom capitalization explicitly for terms with separators
            str = str.split(' ').map(word => {
                return word.split(/([-/])/).map(part => {
                    const lowerPart = part.toLowerCase();
                    return customCapitalization[lowerPart] || part;
                }).join('');
            }).join(' ');

            return str;
        }

        // Check if the word follows a special character (-, :, –, or /)
        function isFollowingSpecialChar(arr, index) {
            if (index > 0) {
                const prevWord = arr[index - 1];
                return ['-', ':', '–', '/'].some(separator => prevWord.endsWith(separator));
            }
            return false;
        }

        // Utility function to escape special characters for regular expressions
        function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        // Utility function to convert a string to sentence case
        function toSentenceCase(str) {
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase().replace(/(\.\s*\w)/g, function(c) {
                return c.toUpperCase();
            }).replace(new RegExp(`\\b(?:${Object.keys(customCapitalization).map(escapeRegExp).join('|')})\\b`, 'gi'), function(match) {
                return customCapitalization[match.toLowerCase()];
            });
        }

        // Utility function to convert a string to upper case
        function toUpperCase(str) {
            return str.toUpperCase();
        }

        // Utility function to convert a string to lower case
        function toLowerCase(str) {
            return str.toLowerCase();
        }

        // Function to get a valid input for the scope of items to edit
        async function getValidEditOption() {
            while (true) {
                const editOption = prompt("Enter '1' to edit only selected items, '2' to edit all items in the current collection, or '3' to edit all items in a saved search:");
                if (['1', '2', '3'].includes(editOption)) {
                    return editOption;
                } else {
                    alert(`Invalid option: "${editOption}". Please enter '1', '2', or '3'.`);
                }
            }
        }

        // Function to get a valid input for title case, sentence case, upper case, or lower case
        async function getValidCaseOption() {
            while (true) {
                const caseOption = prompt("Enter '1' for Title Case, '2' for Sentence Case, '3' for Upper Case, '4' for Lower Case:");
                if (['1', '2', '3', '4'].includes(caseOption)) {
                    return caseOption;
                } else {
                    alert(`Invalid option: "${caseOption}". Please enter '1', '2', '3', or '4'.`);
                }
            }
        }

        const editOption = await getValidEditOption();
        logTime("Time to get valid edit option", performance.now() - startTime);

        const itemsToEdit = await getItemsToEdit(editOption, zoteroPane);
        if (!itemsToEdit || !itemsToEdit.length) {
            Zotero.alert(null, "No items found", "No items found to edit based on your selection.");
            return;
        }
        logTime("Time to retrieve items", performance.now() - startTime);

        const caseOption = await getValidCaseOption();
        logTime("Time to get valid case option", performance.now() - startTime);

        let caseFunction;
        switch (caseOption) {
            case '1':
                caseFunction = toTitleCase;
                break;
            case '2':
                caseFunction = toSentenceCase;
                break;
            case '3':
                caseFunction = toUpperCase;
                break;
            case '4':
                caseFunction = toLowerCase;
                break;
        }

        // Confirm the update with the user
        const confirmationMessage = `You have chosen to edit the titles of ${itemsToEdit.length} records.\n\nDo you want to proceed?`;
        const confirmation = confirm(confirmationMessage);
        if (!confirmation) {
            console.log("User cancelled the editing process.");
            return;
        }
        console.log(confirmationMessage);

        const batchEditPromises = [];
        for (const item of itemsToEdit) {
            if (!item.isNote() && item.getField('title')) {
                batchEditPromises.push((async () => {
                    const oldTitle = item.getField('title');
                    const newTitle = caseFunction(oldTitle);
                    item.setField('title', newTitle);
                    await item.saveTx();
                    console.log(`Updated item ${item.id}: "${oldTitle}" to "${newTitle}"`);
                })());
            }
        }

        await Promise.all(batchEditPromises);
        Zotero.alert(null, "Title Case Update Complete", "The titles of the selected items have been updated.");

    } catch (error) {
        console.error(`Error in title case update script: ${error.message}`);
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
})();
