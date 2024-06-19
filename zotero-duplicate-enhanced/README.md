# Zotero Enhanced Duplicate Detector

This script helps you find and manage duplicate entries in your Zotero library. By comparing various fields such as title, creators, and publication details, it calculates the similarity between items and identifies potential duplicates.

## Features

- **Similarity Calculation**: Compares items based on fields like title, creators, date, and more.
- **Batch Processing**: Efficiently handles large libraries by processing items in batches.
- **User Interaction**: Prompts you to take actions on detected duplicates.
- **Customizable Weights**: Allows you to adjust the importance of each field in the similarity calculation.

## Installation

1. Download the script file: [zotero-duplicate-enhanced](https://github.com/thalient-ai/zotero-scripts/blob/main/zotero-duplicate-enhanced/src/duplicate_enhanced.js)

2. Open Zotero and navigate to `Tools -> Developer -> Run JavaScript`.

3. Copy and paste the contents of `duplicate_enhanced.js` into the console and run the script.

## How It Works

1. **Selecting Items**:
   - The script prompts you to choose items to process: selected items, items in the current collection, or items from a saved search.

2. **Setting the Threshold**:
   - You'll be asked to enter a similarity threshold between 0 and 1 (e.g., 0.6 for 60% similarity). This threshold determines how similar items must be to be considered duplicates.

3. **Processing Items**:
   - The script processes items in batches, calculating similarity based on the fields you specified. It logs potential duplicates for review.

4. **Handling Duplicates**:
   - When potential duplicates are found, you can choose to:
     - Add a tag to both items (e.g., `duplicate-pair-timestamp`).
     - Move one of the items to the trash.
     - Ignore the potential duplicate.

## Key Problem with Zotero's Duplicate Detection

Zotero currently uses the title, DOI, and ISBN fields to determine duplicates. If these fields match (or are absent), Zotero also compares the years of publication (if they are within a year of each other) and author/creator lists (if at least one author last name plus first initial matches) to determine duplicates. This can miss duplicates where these fields differ slightly but the items are otherwise identical.

## How the Script Calculates Similarity

The script compares items based on the following fields:
- Title
- Short Title
- Creators
- Date
- Publisher
- Place
- Journal
- DOI
- ISBN

Each field is given a weight to determine its importance in the similarity calculation. By default, the weights are set as follows:

- Title: 0.45
- Short Title: 0.05
- Creators: 0.2
- Date: 0.05
- Publisher: 0.05
- Place: 0.05
- Journal: 0.05
- DOI: 0.05
- ISBN: 0.05

These weights can be adjusted to meet your needs. The script normalizes these weights to ensure they sum to 1. The similarity is calculated using the Jaccard similarity index, which compares the overlap between the fields of two items. The combined similarity score is then used to identify potential duplicates.

## Example

After running the script, you will see prompts asking you to select items and set the similarity threshold. The script will then process the items, log potential duplicates, and prompt you to take action on each detected duplicate.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## Acknowledgements

Special thanks to the Zotero community for their support and contributions.
