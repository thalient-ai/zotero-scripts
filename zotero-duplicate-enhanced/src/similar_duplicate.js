async function findAndHandleDuplicates() {
  try {
    const items = await getItemsToEdit();
    if (!items) {
      console.log("No items to process.");
      return;
    }

    const weights = {
      title: 0.45,
      shortTitle: 0.05,
      creators: 0.2,
      date: 0.05,
      publisher: 0.05,
      place: 0.05,
      journal: 0.05,
      DOI: 0.05,
      ISBN: 0.05
    };

    normalizeWeights(weights);

    const weightsInfo = `Weights used in the similarity calculation:\nTitle: ${weights.title.toFixed(2)}\nShort Title: ${weights.shortTitle.toFixed(2)}\nCreators: ${weights.creators.toFixed(2)}\nDate: ${weights.date.toFixed(2)}\nPublisher: ${weights.publisher.toFixed(2)}\nPlace: ${weights.place.toFixed(2)}\nJournal: ${weights.journal.toFixed(2)}\nDOI: ${weights.DOI.toFixed(2)}\nISBN: ${weights.ISBN.toFixed(2)}\n\n`;

    const thresholdInput = prompt(weightsInfo + "Enter the similarity threshold for detecting duplicates (a number between 0 and 1, e.g., 0.6 for 60% similarity):", "0.6");
    const threshold = parseFloat(thresholdInput);

    if (isNaN(threshold) || threshold < 0 || threshold > 1) {
      alert("Invalid threshold value. Please enter a number between 0 and 1.");
      return;
    }

    const searchOption = items.searchOption;

    console.log(`Using similarity threshold: ${threshold}`);
    console.log(`Number of items to process: ${items.length}`);

    const batchSize = 100; // Define a batch size
    for (let start = 0; start < items.length; start += batchSize) {
      const end = Math.min(start + batchSize, items.length);
      console.log(`Processing batch ${start + 1} to ${end}`);
      await processBatch(items.slice(start, end), threshold, weights);
    }

    alert("Duplicate detection process completed.");
  } catch (error) {
    console.error(`Error in findAndHandleDuplicates: ${error.message}`);
    alert(`An error occurred: ${error.message}`);
  }
}

function normalizeWeights(weights) {
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  if (totalWeight !== 1) {
    for (let key in weights) {
      weights[key] /= totalWeight;
    }
  }
}

async function processBatch(items, threshold, weights) {
  const potentialDuplicates = [];

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const similarity = calculateSimilarity(items[i], items[j], weights);
      if (similarity > threshold) {
        potentialDuplicates.push([items[i], items[j], similarity]);
        console.log(`Potential duplicate found:\nItem 1: ${items[i].getField('title')}\nItem 2: ${items[j].getField('title')}\nSimilarity: ${similarity}`);
      }
    }
  }

  if (potentialDuplicates.length > 0) {
    await handleDuplicates(potentialDuplicates);
  } else {
    console.log("No duplicates found in this batch.");
  }
}

function normalizeField(field) {
  return (field || "").replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase().trim();
}

function calculateSimilarity(item1, item2, weights) {
  const fields = ['title', 'shortTitle', 'date', 'publisher', 'place', 'journal', 'DOI', 'ISBN'];

  let totalWeight = 0;
  let combinedSimilarity = 0;

  fields.forEach(field => {
    const field1 = normalizeField(item1.getField(field));
    const field2 = normalizeField(item2.getField(field));
    if (field1 || field2) {
      const similarity = jaccardSimilarity(field1, field2);
      console.log(`Comparing ${field}:\nField 1: ${field1}\nField 2: ${field2}\nSimilarity: ${similarity}`);
      combinedSimilarity += similarity * weights[field];
      totalWeight += weights[field];
    }
  });

  const creators1 = normalizeCreators(item1.getCreators());
  const creators2 = normalizeCreators(item2.getCreators());
  console.log(`Creators for Item 1: ${creators1}`);
  console.log(`Creators for Item 2: ${creators2}`);
  const creatorSimilarity = jaccardSimilarity(creators1, creators2);
  console.log(`Creator Jaccard similarity: ${creatorSimilarity}`);
  combinedSimilarity += creatorSimilarity * weights.creators;
  totalWeight += weights.creators;

  if (totalWeight > 0) {
    combinedSimilarity /= totalWeight;
  }

  console.log(`Combined similarity: ${combinedSimilarity}`);
  return combinedSimilarity;
}

function jaccardSimilarity(str1, str2) {
  const set1 = new Set(str1.split(/\s+/));
  const set2 = new Set(str2.split(/\s+/));
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
}

function normalizeCreators(creators) {
  return creators.map(creator => `${creator.firstName || ""} ${creator.lastName || creator.name || ""}`.toLowerCase().trim()).join(' ');
}

async function handleDuplicates(duplicates) {
  const timestamp = Date.now();
  for (const [item1, item2, similarity] of duplicates) {
    let userChoice;
    const firstAuthor1 = getFirstAuthor(item1);
    const firstAuthor2 = getFirstAuthor(item2);
    do {
      userChoice = prompt(`Potential duplicate found with similarity ${similarity.toFixed(2)}:\n\nItem 1:\nTitle: ${item1.getField('title')}\nShort Title: ${item1.getField('shortTitle')}\nFirst Author: ${firstAuthor1}\nPublisher: ${item1.getField('publisher')}\nDate: ${item1.getField('date')}\n\nItem 2:\nTitle: ${item2.getField('title')}\nShort Title: ${item2.getField('shortTitle')}\nFirst Author: ${firstAuthor2}\nPublisher: ${item2.getField('publisher')}\nDate: ${item2.getField('date')}\n\nChoose an action:\n1. Add a tag to both Items (e.g., duplicate-pair-timestamp)\n2. Move Item 2 to Trash\n3. Ignore\n\n(Press Cancel to skip)`);
      if (userChoice === null) {
        console.log(`Skipped potential duplicate:\nItem 1: ${item1.getField('title')}\nItem 2: ${item2.getField('title')}`);
        break; // Skip current pair and move to the next
      }
    } while (!['1', '2', '3'].includes(userChoice));

    switch (userChoice) {
      case '1':
        groupTagAsDuplicate(item1, item2, duplicates.indexOf([item1, item2, similarity]), timestamp);
        break;
      case '2':
        await moveToTrash(item2);
        break;
      case '3':
        console.log(`Ignored potential duplicate:\nItem 1: ${item1.getField('title')}\nItem 2: ${item2.getField('title')}`);
        break;
    }
  }
}

function getFirstAuthor(item) {
  if (!item.getCreators().length) {
    return "N/A";
  }
  const creator = item.getCreators()[0];
  if (creator.fieldMode === 1) {
    return creator.lastName; // 'name' is stored in lastName when fieldMode is 1
  } else if (creator.firstName && creator.lastName) {
    return `${creator.firstName} ${creator.lastName}`;
  } else if (creator.lastName) {
    return creator.lastName;
  } else {
    return "N/A";
  }
}

function groupTagAsDuplicate(item1, item2, index, timestamp) {
  const tag = `duplicate-pair-${timestamp}-${index + 1}`;
  try {
    item1.addTag(tag);
    item2.addTag(tag);
    item1.saveTx();
    item2.saveTx();
    console.log(`Tagged as duplicate pair: ${tag}`);
  } catch (error) {
    console.error(`Error tagging items as duplicates: ${error.message}`);
    alert(`An error occurred while tagging items as duplicates: ${error.message}`);
  }
}

async function moveToTrash(item) {
  try {
    await Zotero.Items.trashTx(item.id);
    console.log(`Moved item to trash: ${item.getField('title')}`);
  } catch (error) {
    console.error(`Error moving item to trash: ${error.message}`);
    alert(`An error occurred while moving the item to trash: ${error.message}`);
  }
}

async function getItemsToEdit() {
  try {
    const zoteroPane = Zotero.getActiveZoteroPane();
    const editOption = prompt("Enter '1' to search selected items, '2' for items in the current collection, or '3' for items in a saved search:");

    let items = [];
    let searchOption = "";

    if (editOption === '2') {
      const collection = zoteroPane.getSelectedCollection();
      if (!collection) {
        alert("No collection selected.");
        return null;
      }
      console.log(`Collection selected: ${collection.name}`);
      items = await collection.getChildItems();
      searchOption = "Current Collection";
    } else if (editOption === '3') {
      const savedSearch = zoteroPane.getSelectedSavedSearch();
      if (!savedSearch) {
        alert("No saved search selected.");
        return null;
      }
      
      console.log(`Saved search selected: ${savedSearch.name}`);
      
      const search = new Zotero.Search();
      search.libraryID = savedSearch.libraryID;
      search.addCondition('savedSearchID', 'is', savedSearch.id);
      
      const itemIDs = await search.search();
      console.log(`Number of items found in saved search: ${itemIDs.length}`);
      if (itemIDs.length === 0) {
        alert("No items found in the saved search.");
        return null;
      }

      items = await Zotero.Items.getAsync(itemIDs);
      searchOption = "Saved Search";
    } else if (editOption === '1') {
      const selectedItems = zoteroPane.getSelectedItems();
      if (!selectedItems.length) {
        alert("No items selected.");
        return null;
      }
      console.log(`Number of selected items: ${selectedItems.length}`);
      items = selectedItems;
      searchOption = "Selected Items";
    } else {
      alert("Invalid option. Please enter '1', '2', or '3'.");
      return null;
    }

    items.searchOption = searchOption;
    return items;
  } catch (error) {
    console.error(`Error getting items to edit: ${error.message}`);
    alert(`An error occurred while retrieving items: ${error.message}`);
    return null;
  }
}

// Run the script
findAndHandleDuplicates();
